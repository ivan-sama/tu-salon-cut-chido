import {
  H1,
  H2,
  MindmapList,
  OrderedList,
  Picture,
  TextBold,
  TextItalic,
  TextUnderline,
  UploadTwo,
} from '@icon-park/react';
import { GetServerSideProps, NextPage } from 'next';
import React, { ChangeEventHandler, FC, useMemo, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  Transforms,
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
} from 'slate';
import { withHistory } from 'slate-history';
import { Slate, Editable, useSlateStatic, withReact } from 'slate-react';
import Toolbar from '../../../components/Toolbar';
import { withCorrectVoidBehavior } from '../../../plugin/CorrectVoidBehaviour';
import {
  insertImages,
  uploadImages,
  makeImagesPlugin,
} from '../../../plugin/Images';
import { withLayout } from '../../../plugin/Layout';
import 'react-toastify/dist/ReactToastify.css';
import { NoticeElement } from '../../../components/notice/NoticeElement';
import { NoticeLeaf } from '../../../components/notice/NoticeLeaf';

const EditorPage: NextPage<{
  noticeId: number;
  editorDocument: Descendant[] | null;
}> = ({ noticeId, editorDocument }) => {
  const withImages = makeImagesPlugin(noticeId);

  const editor = useMemo(
    () =>
      withCorrectVoidBehavior(
        withLayout(withImages(withHistory(withReact(createEditor())))),
      ),
    [withImages],
  );

  const initialValue: Descendant[] = editorDocument || defaultValue;

  return (
    <>
      <div className="absolute flex justify-center min-w-full min-h-full bg-gray-100">
        <ToastContainer />

        <div className="bg-white md:w-5/6 lg:w-3/4 h-fit my-8 p-4 rounded border shadow">
          <Slate editor={editor} value={initialValue}>
            <Toolbar>
              <MarkButton type="bold">
                <TextBold theme="filled" size="18" />
              </MarkButton>
              <MarkButton type="italic">
                <TextItalic theme="filled" size="18" />
              </MarkButton>
              <MarkButton type="underline">
                <TextUnderline theme="filled" size="18" />
              </MarkButton>
              <MarkButton type="h1">
                <H1 theme="filled" size="18" />
              </MarkButton>
              <MarkButton type="h2">
                <H2 theme="filled" size="18" />
              </MarkButton>

              <BlockButton type="numbered-list">
                <OrderedList theme="filled" size="18" />
              </BlockButton>
              <BlockButton type="bulleted-list">
                <MindmapList theme="filled" size="18" />
              </BlockButton>

              <ImageButton noticeId={noticeId} />

              <UploadButton editor={editor} noticeId={noticeId} />
            </Toolbar>

            <Editable
              className="h-full w-full mt-4"
              renderElement={(props) => (
                <NoticeElement {...props} noticeId={noticeId} />
              )}
              renderLeaf={NoticeLeaf}
            />
          </Slate>
        </div>
      </div>
    </>
  );
};

const UploadButton: FC<{ noticeId: number; editor: Editor }> = ({
  noticeId,
  editor,
}) => {
  const handleClick = async () => {
    const response = await fetch(`/api/editor/${noticeId}/updateNotice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ document: editor.children }),
    });

    console.log(response);

    if (response.status == 200) {
      toast('Datos guardados', {
        type: 'success',
      });
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

  return (
    <button onClick={handleClick}>
      <UploadTwo theme="filled" size="18" />
    </button>
  );
};

const ImageButton: FC<{ noticeId: number }> = ({ noticeId }) => {
  const editor = useSlateStatic();
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const filenames = await uploadImages(noticeId, files);
      insertImages(editor, filenames);
    }
  };

  return (
    <div className="w-fit h-fit p-0">
      <input
        className="hidden"
        type="file"
        ref={ref}
        onChange={handleFileSelect}
        multiple
      />
      <button className="block" onClick={handleClick}>
        <Picture theme="filled" size="18" />
      </button>
    </div>
  );
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

type MarkType = 'bold' | 'italic' | 'underline' | 'h1' | 'h2';

const MarkButton: FC<{
  type: MarkType;
}> = ({ type, children }) => {
  const editor = useSlateStatic();
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, type);
      }}
    >
      {children}
    </button>
  );
};

type BlockType = 'bulleted-list' | 'numbered-list';

const BlockButton: FC<{
  type: BlockType;
}> = ({ type, children }) => {
  const editor = useSlateStatic();
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, type);
      }}
    >
      {children}
    </button>
  );
};

const isMarkActive = (editor: Editor, format: MarkType) => {
  const marks: any = Editor.marks(editor)!;
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, mark: MarkType) => {
  const { selection } = editor;
  if (!selection) return;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        SlateElement.isElement(n) && (n.type == 'title' || n.type == 'image'),
    }),
  );

  if (match) {
    return;
  }

  const isActive = isMarkActive(editor, mark);

  if (isActive) {
    Editor.removeMark(editor, mark);
  } else {
    if (mark == 'h1') {
      Editor.removeMark(editor, 'h2');
    } else if (mark == 'h2') {
      Editor.removeMark(editor, 'h1');
    }

    Editor.addMark(editor, mark, true);
  }
};

const toggleBlock = (
  editor: Editor,
  format: 'numbered-list' | 'bulleted-list',
) => {
  const { selection } = editor;
  if (!selection) return;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        SlateElement.isElement(n) && (n.type == 'title' || n.type == 'image'),
    }),
  );

  if (match) {
    return;
  }

  const isActive = isBlockActive(editor, format);
  const isList = true;

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),

    split: true,
  });

  let newProperties: Partial<SlateElement>;

  newProperties = {
    type: isActive ? 'paragraph' : 'list-item',
  };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    }),
  );
  return !!match;
};

const defaultValue: Descendant[] = [
  {
    type: 'title',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!req.cookies['connect.sid']) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  console.log(query.noticeId);

  const response = await fetch(
    `${process.env.API_PATH}/notices/${query.noticeId}`,
    {
      headers: {
        cookie: `connect.sid=${req.cookies['connect.sid']}`,
      },
    },
  );

  console.log(response);

  if (response.ok) {
    const { document } = await response.json();
    return { props: { noticeId: query.noticeId, editorDocument: document } };
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

export default EditorPage;
