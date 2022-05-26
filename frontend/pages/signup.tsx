import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import AppTextInput from '../components/AppTextInput';
import { Form, Formik } from 'formik';
import AppButton from '../components/AppButton';
import { useRouter } from 'next/router';
import { signupSchema } from '../schema/signup';
import AppLink from '../components/AppLink';
import Head from 'next/head';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WorstClassrooms } from '../types/worstClassrooms';
import { loginAndSignupGetSSP } from '../util/loginAndSignupGetSSP';
import { INotice } from './admin';
import BadClassroom from '../components/BadClassroom';
import PublicNotice from '../components/notice/PublicNotice';

const Editor: NextPage<{
  notices: INotice[];
  worstClassrooms: WorstClassrooms;
}> = ({ notices, worstClassrooms }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Registro</title>
      </Head>

      <ToastContainer />

      <div className="bg-white flex justify-center h-screen md:divide-x">
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

        <div className="flex pt-8 lg:pt-0 md:items-center w-full px-6 mx-auto">
          <div className="flex-1">
            <div>
              <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-gray-700">
                Tu Salón{' '}
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-cyan-500">
                  CUT
                </span>
              </h2>
            </div>

            <Formik
              initialValues={{
                email: '',
                password: '',
                passwordConfirmation: '',
              }}
              validationSchema={signupSchema}
              onSubmit={async ({ passwordConfirmation, ...submitData }) => {
                const response = await fetch('/api/auth/signup', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(submitData),
                });

                console.log(response);

                if (response.status == 200) {
                  router.push('/');
                } else if (response.status == 400) {
                  const obj = await response.json();
                  toast(obj.error, {
                    type: 'error',
                  });
                } else if (response.status == 500) {
                  toast('Error del servidor, por favor intentalo más tarde', {
                    type: 'error',
                  });
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
                      <AppTextInput
                        autoComplete="new-password"
                        name="password"
                        type="password"
                        label="Contraseña"
                        placeholder="Tu contraseña"
                      />
                    </div>

                    <div className="mt-6">
                      <AppTextInput
                        autoComplete="new-password"
                        name="passwordConfirmation"
                        type="password"
                        label="Confirma tu contraseña"
                        placeholder="Tu contraseña"
                      />
                    </div>

                    <div className="mt-6">
                      <AppButton
                        color="emerald"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Crear Cuenta
                      </AppButton>
                    </div>
                  </Form>

                  <div className="py-4">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>

                  <div>
                    <AppLink href="/login" color="cyan">
                      Iniciar Sesión
                    </AppLink>
                  </div>
                </div>
              )}
            </Formik>
          </div>
        </div>

        <div className="h-full max-h-screen flex-auto hidden md:flex flex-col w-full mx-auto">
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
