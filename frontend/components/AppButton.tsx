import React, { FC } from 'react';

export type ButtonColor = 'cyan' | 'emerald' | 'amber';

interface IAppButtonProps {
  type?: 'submit' | 'reset' | 'button';
  color: ButtonColor;
  disabled?: boolean;
  onclick?: React.MouseEventHandler<HTMLButtonElement>;
}

const commonClasses =
  'w-full px-4 py-2 tracking-wide text-white rounded-md transform focus:outline-none ' +
  'transition ease-in-out delay-100 duration-300 hover:-translate-y-1 hover:scale-105 ';

const dynamicClasses = {
  cyan: 'bg-cyan-500 hover:bg-sky-500',
  emerald: 'bg-emerald-500 hover:bg-green-500',
  amber: 'bg-amber-500 hover:bg-red-500',
};

export const buttonClass = (color: ButtonColor) => {
  return (
    'font-medium w-full px-4 py-2 tracking-wide text-white rounded-md transform focus:outline-none ' +
    'transition ease-in-out delay-100 duration-300 hover:-translate-y-1 hover:scale-105 ' +
    dynamicClasses[color]
  );
};

const AppButton: FC<IAppButtonProps> = ({
  color,
  children,
  type,
  onclick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onclick}
      disabled={disabled}
      type={type}
      className={buttonClass(color)}
    >
      {children}
    </button>
  );
};

export default AppButton;
