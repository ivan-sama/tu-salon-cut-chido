import { DeleteOne, Down, Editor, Lock, Unlock } from '@icon-park/react';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';
import { INotice } from '../../pages/admin';
import { withCorrectVoidBehavior } from '../../plugin/CorrectVoidBehaviour';
import { makeImagesPlugin } from '../../plugin/Images';
import { withLayout } from '../../plugin/Layout';
import { TitleElement } from '../../types/slate';
import { NoticeElement } from './NoticeElement';
import { NoticeLeaf } from './NoticeLeaf';

interface IAdminNoticeProps {
  notice: INotice;
  onDelete: (noticeId: number) => void;
  onSetPublic: (noticeId: number) => void;
  onSetPrivate: (noticeId: number) => void;
}

const AdminNotice: FC<IAdminNoticeProps> = ({
  notice,
  onDelete,
  onSetPublic,
  onSetPrivate,
}) => {
  const router = useRouter();

  const [isOpened, setIsOpened] = useState(false);

  const [titleElement, ...body] = notice.document ?? [];

  const titleText = (titleElement as TitleElement | null)?.children.at(0)?.text;

  const withImages = makeImagesPlugin(notice.id);

  const editor = useMemo(
    () =>
      withCorrectVoidBehavior(
        withLayout(withImages(withHistory(withReact(createEditor())))),
      ),
    [],
  );

  return (
    <div>
      <div className="flex justify-between">
        <p
          className={`block text-5xl whitespace-normal text-justify items-center mr-8 ${
            titleText ? '' : 'text-neutral-400'
          }`}
        >
          {titleText ?? 'Anuncio sin titulo'}
        </p>

        <div className="flex items-center">
          <div className="mr-2">
            <button
              title="Editar"
              onClick={() => router.push(`/admin/editor/${notice.id}`)}
            >
              <Editor theme="filled" size="22" fill="#333" />
            </button>
          </div>

          <div className="mr-2">
            {notice.is_public ? (
              <button
                title="Hacer Privado"
                onClick={() => onSetPrivate(notice.id)}
              >
                <Unlock theme="outline" size="22" fill="#333" />
              </button>
            ) : (
              <button
                title="Hacer Publico"
                onClick={() => onSetPublic(notice.id)}
                disabled={!titleText}
              >
                <Lock
                  theme="outline"
                  size="22"
                  fill={!titleText ? '#CCC' : '#333'}
                />
              </button>
            )}
          </div>

          <div className="mr-8">
            <button title="Borrar" onClick={() => onDelete(notice.id)}>
              <DeleteOne theme="outline" size="22" fill="#333" />
            </button>
          </div>

          <button
            className={`block cursor-default transition-transform ease-in-out duration-200 ${
              isOpened ? 'rotate-180' : ''
            }`}
            onClick={() => setIsOpened(!isOpened)}
            disabled={!titleText}
          >
            <Down
              theme="filled"
              size="36"
              fill={!titleText ? '#CCC' : '#333'}
            />
          </button>
        </div>
      </div>

      <div className={`${isOpened ? 'block' : 'hidden'} mt-4`}>
        <Slate editor={editor} value={body}>
          <Editable
            readOnly
            className="h-full w-full"
            renderElement={(props) => (
              <NoticeElement {...props} noticeId={notice.id} />
            )}
            renderLeaf={NoticeLeaf}
          />
        </Slate>
      </div>
    </div>
  );
};

export default AdminNotice;
