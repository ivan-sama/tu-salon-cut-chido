import React, { FC, useRef } from 'react';

const Toolbar: FC = ({ children }) => {
  return <div className="flex space-x-2">{children}</div>;
};

export default Toolbar;
