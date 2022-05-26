import { GetServerSideProps } from 'next';

export const loginAndSignupGetSSP: GetServerSideProps = async ({ req }) => {
  const noticesResponse = await fetch(
    `${process.env.API_PATH}/notices/public/all`,
  );
  const worstClassroomsResponse = await fetch(
    `${process.env.API_PATH}/classrooms/worst`,
  );

  //TODO
  if (!noticesResponse.ok || !noticesResponse.ok) {
    throw noticesResponse.status;
  }

  const notices = await noticesResponse.json();
  const worstClassrooms = await worstClassroomsResponse.json();

  return { props: { notices, worstClassrooms } };
};
