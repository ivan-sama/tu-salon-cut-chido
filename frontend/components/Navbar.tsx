import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

const Navbar: FC = () => {
  const router = useRouter();
  return (
    <nav className="bg-slate-800 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-start">
            <div className="flex-shrink-0 flex items-center">
              <p className="text-slate-100">Tu Salón CUT</p>
            </div>
            <div className="block sm:ml-6">
              <div className="flex space-x-4">
                <Link href="/">
                  <a className="text-slate-100 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Inicio
                  </a>
                </Link>
                <Link href="/">
                  <a className="text-slate-100 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Noticias
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <div className="hidden relative mr-2 md:block">
              <input
                type="text"
                id="navbarSearch"
                className="block p-2 w-full rounded-lg border sm:text-sm bg-slate-700 border-slate-300 placeholder-slate-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar..."
              />
            </div> */}
            <a
              href="{{ url('/login') }}"
              className="text-slate-100 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
