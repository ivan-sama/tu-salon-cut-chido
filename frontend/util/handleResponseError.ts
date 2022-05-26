import { GetServerSidePropsResult } from 'next';

const handleResponseError = (error: string): GetServerSidePropsResult<any> => {
  switch (error) {
    case 'unauthenticated':
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    case 'forbidden':
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    case 'emailNotVerified':
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    default:
      throw error;
  }
};
