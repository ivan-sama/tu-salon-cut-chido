import React from 'react';
import { GetServerSideProps, NextPage } from 'next';

const Logout: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!req.cookies['connect.sid']) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  const response = await fetch(`${process.env.API_PATH}/auth/logout`, {
    headers: {
      cookie: `connect.sid=${req.cookies['connect.sid']}`,
    },
  });

  console.log(response);

  if (response.ok) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
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

export default Logout;
