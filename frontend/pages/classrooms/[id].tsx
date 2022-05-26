import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import ClassroomProblem from '../../components/ClassroomProblem';
import AppButton from '../../components/AppButton';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserType } from '../../types/userTypes';

interface IClassroomComplaints {
  id: number;
  label: string;
  count: string;
  checked: boolean;
}

type IClassroomProblemsProps =
  | {
      userType: 'guest' | 'unverified';
      complaints: IClassroomComplaints[];
      comment: undefined;
      comments: undefined;
    }
  | {
      userType: 'verified';
      complaints: IClassroomComplaints[];
      comment: string;
      comments: undefined;
    }
  | {
      userType: 'admin';
      complaints: IClassroomComplaints[];
      comment: undefined;
      comments: { comment: string; updated_at: string; email: string }[];
    };

const ClassroomProblems: NextPage<IClassroomProblemsProps> = ({
  complaints,
  comment,
  comments,
  userType,
}) => {
  useEffect(() => {
    if (userType == 'unverified') {
      toast('Verificación de correo electrónico pendiente', {
        type: 'info',
      });
    }
  }, [userType]);

  const router = useRouter();
  const { id } = router.query;

  const [submitting, setSubmitting] = useState(false);
  const [commentState, setCommentState] = useState<string>(comment ?? '');

  const [stateArray, setStateArray] = useState(
    complaints.map(({ checked }) => checked),
  );

  const reset = async () => {
    setSubmitting(true);
    const resetResponse = await fetch(`/api/classrooms/${id}/reset`, {
      method: 'POST',
    });

    if (resetResponse.ok) {
      toast('El salón ha sido reiniciado', {
        type: 'success',
      });
    } else {
      toast('Error al reiniciar el salón', {
        type: 'error',
      });
    }
  };

  const save = async () => {
    setSubmitting(true);

    let submitData: { classroomProblemsId: number[] } = {
      classroomProblemsId: [],
    };

    for (let i = 0; i < stateArray.length; i++) {
      if (stateArray[i]) {
        submitData.classroomProblemsId.push(complaints[i].id);
      }
    }

    console.log(submitData);

    const complaintsResponse = await fetch(`/api/complaints/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData),
    });

    const commentResponse = await fetch(`/api/comments/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: commentState }),
    });

    if (complaintsResponse.ok && commentResponse.ok) {
      toast('Datos guardados', {
        type: 'success',
      });
    } else {
      if (!complaintsResponse.ok) {
        toast('Error al guardar las quejas', {
          type: 'error',
        });
      }

      if (!commentResponse.ok) {
        toast('Error al guardar el comentario', {
          type: 'error',
        });
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="w-3/4 mx-auto">
      <ToastContainer />
      <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold text-gray-700 text-center pt-2">
        Edificio <span className="text-emerald-500">{id}</span>
      </h1>

      <div className="bg-white flex justify-center">
        {
          {
            unverified: null,
            guest: null,
            verified: (
              <div className="flex-auto flex flex-col pt-8 px-6 mx-auto w-1/2">
                <label
                  htmlFor="comment"
                  className="font-medium text-xl text-gray-700 pb-4 text-center"
                >
                  Comentario
                </label>

                <textarea
                  name="comment"
                  value={commentState ?? ''}
                  onChange={(e) => setCommentState(e.target.value)}
                  rows={5}
                  className="block resize-none w-full h-full px-4 py-2 text-slate-700 placeholder-slate-400 bg-white border border-slate-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
            ),
            admin: (
              <div className="flex-auto flex flex-col pt-8 px-6 mx-auto w-1/2">
                <p className="font-medium text-xl text-gray-700 pb-4 text-center">
                  Comentarios
                </p>
                {comments?.map((v, i) => (
                  <div key={i} className="bg-slate-50 rounded-md p-2">
                    <div className="flex justify-between mb-2">
                      <p className="text-slate-700 font-medium">
                        {v.email} dice:
                      </p>
                      <p className="text-slate-500">{v.updated_at}</p>
                    </div>
                    <p className="text-slate-700">{v.comment}</p>
                  </div>
                ))}
              </div>
            ),
          }[userType]
        }

        <div
          className={`pt-8 px-6 mx-auto ${
            userType == 'guest' ? 'w-full' : 'w-1/2'
          }`}
        >
          <p className="font-medium text-xl text-gray-700 pb-4 text-center">
            Problemas
          </p>
          <div className="flex flex-col space-y-2">
            {complaints.map(({ id, label, count, checked }, i) => {
              return (
                <ClassroomProblem
                  key={id}
                  label={label}
                  count={parseInt(count)}
                  checked={stateArray[i]}
                  setChecked={(v) => {
                    const newStateArray = [...stateArray];
                    newStateArray[i] = v;
                    setStateArray(newStateArray);
                  }}
                  disabled={userType != 'verified'}
                />
              );
            })}
          </div>
        </div>
      </div>

      {
        {
          unverified: null,
          guest: null,
          verified: (
            <div className="mt-4 pt-8 px-6 mx-auto">
              <AppButton color="emerald" disabled={submitting} onclick={save}>
                Guardar
              </AppButton>
            </div>
          ),
          admin: (
            <div className="mt-4 pt-8 px-6 mx-auto">
              <AppButton color="amber" disabled={submitting} onclick={reset}>
                Reiniciar salón
              </AppButton>
            </div>
          ),
        }[userType]
      }
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const complaintsPromise = fetch(
    `${process.env.API_PATH}/complaints/${query.id}`,
    {
      headers: {
        cookie: `connect.sid=${req.cookies['connect.sid']}`,
      },
    },
  );

  const userTypePromise = fetch(`${process.env.API_PATH}/auth/userType`, {
    headers: {
      cookie: `connect.sid=${req.cookies['connect.sid']}`,
    },
  });

  const [complaintsResponse, userTypeResponse] = await Promise.all([
    complaintsPromise,
    userTypePromise,
  ]);

  if (!(complaintsResponse.ok && userTypeResponse.ok)) {
    if (complaintsResponse.status == 404) {
      return {
        notFound: true,
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/500',
        },
      };
    }
  }

  const complaints = await complaintsResponse.json();
  const userType: UserType = await userTypeResponse.json();

  console.log('usertype', userType);

  switch (userType) {
    case 'unverified':
    case 'guest':
      return {
        props: {
          userType,
          complaints,
        },
      };
    case 'verified':
      const commentResponse = await fetch(
        `${process.env.API_PATH}/comments/${query.id}`,
        {
          headers: {
            cookie: `connect.sid=${req.cookies['connect.sid']}`,
          },
        },
      );

      if (!commentResponse.ok) {
        return {
          redirect: {
            permanent: false,
            destination: '/500',
          },
        };
      }
      const comment = await commentResponse.json();
      return {
        props: {
          userType,
          complaints,
          comment,
        },
      };
    case 'admin':
      const commentsResponse = await fetch(
        `${process.env.API_PATH}/comments/all/${query.id}`,
        {
          headers: {
            cookie: `connect.sid=${req.cookies['connect.sid']}`,
          },
        },
      );

      if (!commentsResponse.ok) {
        return {
          redirect: {
            permanent: false,
            destination: '/500',
          },
        };
      }

      const comments = await commentsResponse.json();
      return {
        props: {
          userType,
          complaints,
          comments,
        },
      };
  }
};

export default ClassroomProblems;
