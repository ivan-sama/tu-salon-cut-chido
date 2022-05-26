import React, { FC, useEffect, useRef, useState } from 'react';

interface IClassroomProblemProps {
  disabled?: boolean;
  label: string;
  count: number;
  checked: boolean;
  setChecked: (v: boolean) => void;
}

const ClassroomProblem: FC<IClassroomProblemProps> = ({
  disabled = false,
  label,
  count,
  checked,
  setChecked,
}) => {
  const uiCount = useRef(count - (checked ? 1 : 0));

  const dynamicClass = (checked: boolean) => {
    return checked ? 'bg-rose-100 text-rose-700' : 'bg-slate-50 text-slate-700';
  };

  const toggle = () => {
    setChecked(!checked);
  };

  return (
    <div
      role="alert"
      className={
        (disabled ? '' : 'cursor-pointer ') +
        'flex justify-between px-4 py-3 rounded ' +
        dynamicClass(checked)
      }
      onClick={disabled ? undefined : toggle}
    >
      <p className="select-none">{label}</p>
      <p className="select-none">{uiCount.current + (checked ? 1 : 0)}</p>
    </div>
  );
};

export default ClassroomProblem;
