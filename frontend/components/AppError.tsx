import React, { FC } from 'react';

interface IAppErrorProps {
  error: string;
}

const AppError: FC<IAppErrorProps> = ({ error }) => {
  return (
    <div
      role="alert"
      className="mt-4 border border-rose-400 rounded bg-red-100 px-4 py-3 text-red-700"
    >
      <p>{error}</p>
    </div>
  );
};

export default AppError;
