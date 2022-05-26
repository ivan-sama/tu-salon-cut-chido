import db from '../knex';
import Notice from '../types/notice';
import fs from 'fs/promises';
import path from 'path';
import knex from 'knex';
import { limits } from 'argon2';

export const createNotice = async (): Promise<number> => {
  const result = await db('notices').insert({ document: null }).returning('id');
  return result.at(0);
};

export const updateNotice = async (
  noticeId: number,
  document: Descendant[],
) => {
  await db('notices')
    .update({ document: JSON.stringify(document) })
    .where({ id: noticeId });
};

export const getNotices = async ({
  is_public,
  pagination,
}: {
  is_public?: boolean | undefined;
  pagination?:
    | {
        limit: number;
        offset: number;
      }
    | undefined;
} = {}): Promise<Notice[]> => {
  const query = db('notices').select('*').orderBy('created_at', 'desc');

  if (is_public !== undefined) {
    query.where({ is_public });
  }

  if (pagination !== undefined) {
    query.limit(pagination.limit);
    query.offset(pagination.offset);
  }

  console.log(query.toSQL());

  return await query;
};

export const getNotice = async (id: number): Promise<Notice | undefined> => {
  return (await db('notices').where({ id }).select('*').first()) || null;
};

export const deleteNotice = async (id: number) => {
  await db('notices').where({ id }).del();
};

export const setNoticeVisibility = async (
  id: number,
  is_public: boolean,
): Promise<'not_found' | 'null_document'> => {
  const trx = await db.transaction();

  try {
    const result = (await db('notices')
      .transacting(trx)
      .where({ id })
      .select(db.raw('document is not null as has_document'))
      .first()) as any;

    const has_document = result?.has_document ?? null;

    if (has_document === null) {
      return 'not_found';
    }

    if (!has_document) {
      return 'null_document';
    }

    await db('notices').update({ is_public }).where({ id });

    await trx.commit();
  } catch (err) {
    trx.rollback(err);
    throw err;
  }

  return;
};

export const deleteUnusedImages = async (
  noticeId: number,
  document: Descendant[],
) => {
  const images: string[] = [];

  document.forEach(async (element) => {
    if (element.type == 'image') {
      images.push(element.filename);
    }
  });

  const files = await fs
    .readdir(`./public/notices/${noticeId}`)
    .catch((err) => {
      if (err.code !== 'ENOENT') {
        throw err;
      }

      return [];
    });

  const promises: Promise<void>[] = [];

  for (const file of files) {
    if (!images.includes(file)) {
      promises.push(
        fs.unlink(`./public/notices/${noticeId}/${file}`).catch((err) => {
          if (err.code !== 'ENOENT') {
            throw err;
          }
        }),
      );
    }
  }

  await Promise.all(promises);
};
