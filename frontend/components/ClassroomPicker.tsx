import { Dialog, Transition } from '@headlessui/react';
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';
import {} from 'react';

interface ClassroomPicker {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  building: string;
  classrooms: string[];
}

const ordinal: Record<string, string> = {
  '1': 'Primer',
  '2': 'Segundo',
  '3': 'Tercer',
  '4': 'Cuarto',
  '5': 'Quinto',
  '6': 'Sexto',
  '7': 'Séptimo',
  '8': 'Octavo',
  '9': 'Noveno',
};

const ClassroomPicker: FC<ClassroomPicker> = ({
  isOpen,
  setIsOpen,
  building,
  classrooms,
}) => {
  const record = classrooms
    .filter((classroom) => classroom.startsWith(building))
    .reduce<Record<string, string[]>>((acc, value) => {
      const floor = value.at(1);

      if (floor) {
        acc[floor] = [...(acc[floor] ?? []), value];
      }

      return acc;
    }, {});

  console.log(record);

  return (
    <Dialog
      open={isOpen}
      onClose={setIsOpen}
      as="div"
      className={`fixed inset-0 z-10 overflow-y-auto bg-slate-50`}
    >
      <div className="min-w-full min-h-full flex justify-center">
        <div className="my-auto bg-slate-100 rounded-md w-96 py-8 px-4 text-center">
          <Dialog.Title className="text-emerald-500 text-5xl pb-8">
            Edificio {building}
          </Dialog.Title>

          {Object.keys(record).map((floor) => (
            <div className="pb-4" key={floor}>
              <h2 className="text-cyan-500 text-3xl">{ordinal[floor]} Piso</h2>

              <div className="flex flex-wrap justify-center">
                {record[floor].map((classroom) => (
                  <a
                    key={classroom}
                    href={`/classrooms/${classroom}`}
                    className="text-xl m-2 hover:underline"
                  >
                    {classroom}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <button
            className="m-4 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setIsOpen(false)}
          >
            Regresar
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ClassroomPicker;
