import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ClassroomPicker from '../components/ClassroomPicker';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import buildings from '../json/buildings.json';

const Home: NextPage<{ classrooms: string[] }> = ({ classrooms }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [building, setBuilding] = useState('');

  return (
    <div className="absolute overflow-y-scroll">
      {/* <Navbar /> */}
      <div className="p-2 flex">
        <div className="shrink-0 flex justify-start items-center px-4">
          <Link href="login">
            <a className="hover:underline">Iniciar sesión</a>
          </Link>
        </div>
        <SearchBar list={classrooms} />
      </div>
      <div className="relative w-full h-fit">
        <img src="/map.jpg" alt="mapa" />
        {buildings.map((b) => (
          <button
            key={b.building}
            className="absolute"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
            }}
            title={`Edificio ${b.building}`}
            onClick={() => {
              setBuilding(b.building);
              setIsDialogOpen(true);
            }}
          />
        ))}
      </div>
      <ClassroomPicker
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        building={building}
        classrooms={classrooms}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(`${process.env.API_PATH}/classrooms`);

  if (response.ok) {
    const classrooms = await response.json();
    return { props: { classrooms } };
  } else if (response.status == 404) {
    return {
      notFound: true,
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/500',
      },
    };
  }
};

export default Home;
