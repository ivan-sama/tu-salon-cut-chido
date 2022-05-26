import argon2 from 'argon2';
import User from '../types/user';
import { DatabaseError } from 'pg';
import db from '../knex';
import transporter from '../transporter';
import redis from '../redis';
import { nanoid } from 'nanoid';

export const createUser = async (
  email: string,
  plain_password: string,
): Promise<User | 'EmailTaken'> => {
  const hashed_password = await argon2.hash(plain_password, {
    type: argon2.argon2id,
  });

  try {
    const result = await db('users')
      .insert({
        email,
        hashed_password,
      })
      .returning('*');

    const user = result.at(0) || null;

    await sendConfirmationEmail(user.id, user.email); //TODO handle exception

    return user;
  } catch (err) {
    console.log(err);
    if (err instanceof DatabaseError && err.code == '23505') {
      return 'EmailTaken';
    }
    throw err;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return db('users').select().where({ email }).first();
};

export const sendConfirmationEmail = async (
  userId: number,
  userEmail: string,
) => {
  const uuid = nanoid();
  redis.set(uuid, userId);

  let info = await transporter.sendMail({
    from: '"Tu Salón CUT" <notification@tusaloncut.udg.mx>',
    to: userEmail,
    subject: 'Verificación de correo electrónico',
    text: `Ingresa al siguiente link para verificar tu cuenta: http://localhost:3000/verifica/${uuid}`,
  });

  console.log(info);
};

export const verifyEmail = async (uuid: string) => {
  //TODO handle exceptions

  const userId = await redis.get(uuid);

  await db('users')
    .update({ email_validated_at: db.fn.now() as any })
    .where({ id: parseInt(userId) });

  redis.del(uuid);
};

export const isEmailValidated = async (userId: number): Promise<boolean> => {
  const { email_validated_at } = await db('users')
    .select('email_validated_at')
    .where({ id: userId })
    .first();

  return email_validated_at !== null;
};
