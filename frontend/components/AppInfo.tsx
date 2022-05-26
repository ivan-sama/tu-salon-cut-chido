import React, { FC } from 'react';

const AppInfo: FC = ({ children }) => {
  return (
    <div
      role="alert"
      className="mt-4 border border-gray-400 rounded bg-gray-100 px-4 py-3 text-gray-700"
    >
      {children}
    </div>
  );
};

export default AppInfo;
