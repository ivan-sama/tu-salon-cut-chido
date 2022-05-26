import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import router from 'next/router';
import AppButton from '../../components/AppButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Descendant } from 'slate';
import AdminNotice from '../../components/notice/AdminNotice';

export interface INotice {
  id: number;
  document: Descendant[] | null;
  is_public: boolean;
}

const AdminPage: NextPage<{ notices: INotice[] }> = (props) => {
  const [notices, setNotices] = useState(props.notices);

  const createNewNotice = async () => {
    console.log('yo');

    const response = await fetch('/api/editor/createNotice', {
      method: 'POST',
    });

    console.log(response);

    if (response.status == 200) {
      const { id } = await response.json();
      console.log(id);
      router.push(`/admin/editor/${id}`);
    } else if (response.status == 400) {
      const { error } = await response.json();
      toast(error, {
        type: 'error',
      });
    } else if (response.status == 500) {
      toast('Error del servidor, por favor intentalo más tarde', {
        type: 'error',
      });
    }
  };

  const deleteNotice = async (noticeId: number) => {
    const response = await fetch(`/api/notices/${noticeId}`, {
      method: 'delete',
    });

    if (response.status == 200) {
      toast('Anuncio eliminado', {
        type: 'success',
      });
      setNotices(notices.filter((notice) => notice.id != noticeId));
    } else if (response.status == 400) {
      const obj = await response.json();
      toast(obj.error, {
        type: 'error',
      });
    } else if (response.status == 500) {
      toast('Error del servidor, por favor intentalo más tarde', {
        type: 'error',
      });
    }
  };

  const setPublic = async (noticeId: number) => {
    const response = await fetch(`/api/editor/${noticeId}/setPublic`, {
      method: 'post',
    });

    if (response.status == 200) {
      toast('Anuncio fue hecho publico', {
        type: 'success',
      });
      setNotices(
        notices.map((notice) =>
          notice.id != noticeId ? notice : { ...notice, is_public: true },
        ),
      );
    } else {
      toast('Error', {
        type: 'error',
      });
    }
  };

  const setPrivate = async (noticeId: number) => {
    const response = await fetch(`/api/editor/${noticeId}/setPrivate`, {
      method: 'post',
    });

    if (response.status == 200) {
      toast('Anuncio fue hecho privado', {
        type: 'success',
      });
      setNotices(
        notices.map((notice) =>
          notice.id != noticeId ? notice : { ...notice, is_public: false },
        ),
      );
    } else {
      toast('Error', {
        type: 'error',
      });
    }
  };

  return (
    <div className="bg-white px-0 md:px-8 lg:px-16 h-fit my-8 p-4 ">
      <ToastContainer />

      <div className="space-y-4">
        {notices.map((notice) => {
          return (
            <div className="p-3 rounded border shadow" key={notice.id}>
              <AdminNotice
                onDelete={deleteNotice}
                onSetPrivate={setPrivate}
                onSetPublic={setPublic}
                notice={notice}
              />
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <AppButton color="emerald" type="submit" onclick={createNewNotice}>
          Nuevo anuncio
        </AppButton>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies['connect.sid']) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  const response = await fetch(`${process.env.API_PATH}/notices/all`, {
    headers: {
      cookie: `connect.sid=${req.cookies['connect.sid']}`,
    },
  });

  if (response.ok) {
    const notices = await response.json();
    console.log(notices);
    return { props: { notices } };
  } else if (response.status == 404) {
    return {
      notFound: true,
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
};

export default AdminPage;
