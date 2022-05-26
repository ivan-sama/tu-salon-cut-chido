import { BadTwo, DisappointedFace } from '@icon-park/react';
import Link from 'next/link';
import React, { FC } from 'react';

interface IBadClassroomProps {
  name: string;
  nComplaints: string;
}

const BadClassroom: FC<IBadClassroomProps> = ({
  name,
  nComplaints: complaints,
}) => {
  return (
    <Link href={`/classrooms/${name}`}>
      <a>
        <div
          role="alert"
          className="flex justify-between mt-4 rounded bg-slate-50 px-4 py-3 text-slate-700 transition ease-in-out delay-100 duration-300 hover:-translate-y-1 hover:scale-105"
        >
          <p className="font-medium">{name}</p>

          <div className="flex space-x-2">
            <BadTwo theme="filled" size="24" fill="#333" />
            <p>x{complaints}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default BadClassroom;
