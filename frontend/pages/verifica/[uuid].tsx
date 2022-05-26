import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';

const ClassroomProblems: NextPage = () => {
  return (
    <>
      <p>Tu correo ha sido verificado</p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const response = await fetch(
    `${process.env.API_PATH}/auth/verifyEmail/${query.uuid}`,
  );
  console.log(response);

  if (response.ok) {
    return { props: {} };
  } else if (response.status == 404) {
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
};

export default ClassroomProblems;
