import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import AppTextInput from '../components/AppTextInput';
import { Form, Formik } from 'formik';
import AppButton from '../components/AppButton';
import { loginSchema } from '../schema/login';
import AppError from '../components/AppError';
import { useRouter } from 'next/router';
import AppLink from '../components/AppLink';
import Head from 'next/head';
import { INotice } from './admin';
import PublicNotice from '../components/notice/PublicNotice';
import { WorstClassrooms } from '../types/worstClassrooms';
import BadClassroom from '../components/BadClassroom';
import { loginAndSignupGetSSP } from '../util/loginAndSignupGetSSP';

const Editor: NextPage<{
  notices: INotice[];
  worstClassrooms: WorstClassrooms;
}> = ({ notices, worstClassrooms }) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);

  console.log(notices);

  return (
    <>
      <Head>
        <title>Inicio de sesión</title>
      </Head>

      <div className="bg-white flex justify-center items-center h-screen md:divide-x">
        <div className="h-full max-h-screen flex-auto hidden md:flex flex-col w-full mx-auto">
          <div className="m-auto overflow-y-auto w-full p-6">
            <h2 className="block mb-4 text-6xl font-bold text-gray-700">
              Noticias
            </h2>

            {
              <div className="space-y-4 w-full">
                {notices.map((notice) => {
                  return (
                    <div className="p-3 rounded border shadow" key={notice.id}>
                      <PublicNotice notice={notice} />
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </div>

        <div className="flex pt-8 lg:pt-0 md:items-center w-full h-full max-h-screen px-6 mx-auto">
          <div className="flex-1">
            <div>
              <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-gray-700">
                Tu Salón{' '}
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-cyan-500">
                  CUT
                </span>
              </h2>
            </div>

            {error ? <AppError error={error} /> : null}

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={async (data) => {
                const response = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });

                console.log(response);

                if (response.status == 200) {
                  router.push('/');
                } else if (response.status == 403) {
                  const obj = await response.json();
                  setError(obj.error);
                } else if (response.status == 500) {
                  setError('Error del servidor, por favor intentalo más tarde');
                }
              }}
            >
              {({ isSubmitting }) => (
                <div className="mt-8">
                  <Form>
                    <div className="mt-6">
                      <AppTextInput
                        name="email"
                        type="email"
                        label="Correo institucional"
                        placeholder="ejemplo@alumno.udg.mx"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <label
                          htmlFor="password"
                          className="text-sm text-gray-600"
                        >
                          Contraseña
                        </label>
                        <a
                          href="#"
                          className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
                        >
                          Olvidaste tu contraseña?
                        </a>
                      </div>

                      <AppTextInput
                        name="password"
                        type="password"
                        placeholder="Tu contraseña"
                      />
                    </div>
                    <div className="mt-6">
                      <AppButton
                        color="emerald"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Iniciar Sesión
                      </AppButton>
                    </div>
                  </Form>

                  <div className="py-4">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>

                  <div>
                    <AppLink href="/signup" color="cyan">
                      Crear Cuenta
                    </AppLink>
                  </div>
                </div>
              )}
            </Formik>
          </div>
        </div>

        <div className="h-full max-h-screen flex-auto hidden xl:flex flex-col w-full mx-auto">
          <div className="m-auto overflow-y-auto w-full p-6">
            <h2 className="block mb-4 text-6xl font-bold text-gray-700">
              Salones
            </h2>

            {
              <div className="space-y-4 w-full">
                {worstClassrooms.map((classroom) => {
                  return (
                    <BadClassroom
                      key={classroom.fk_classroom}
                      name={classroom.fk_classroom}
                      nComplaints={classroom.count}
                    />
                  );
                })}
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = loginAndSignupGetSSP;

export default Editor;
