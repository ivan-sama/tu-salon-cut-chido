import Link, { LinkProps } from 'next/link';
import React, { FC } from 'react';
import { buttonClass, ButtonColor } from './AppButton';

interface IAppLinkProps extends React.PropsWithChildren<LinkProps> {
  color: ButtonColor;
}

const AppLink: FC<IAppLinkProps> = ({ color, children, href }) => {
  return (
    <Link href={href}>
      <a
        className={'font-medium text-center block w-full' + buttonClass(color)}
      >
        {children}
      </a>
    </Link>
  );
};

export default AppLink;
