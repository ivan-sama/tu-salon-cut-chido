import { Editor, Transforms } from 'slate';
import { ImageElement } from '../types/slate';

export const makeImagesPlugin = (noticeId: number) => (editor: Editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = async (data) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      const filenames = await uploadImages(noticeId, files);
      insertImages(editor, filenames);
    } else {
      insertData(data);
    }
  };

  return editor;
};
//.map((filename) => `/api/notices/${noticeId}/${filename}`)

export const uploadImages = async (
  noticeId: number,
  files: FileList,
): Promise<string[]> => {
  var data = new FormData();
  for (const file of files) {
    const [mime] = file.type.split('/');
    if (mime != 'image') continue;
    data.append('files', file, file.name);
  }

  const response = await fetch(`/api/editor/${noticeId}/imageUpload`, {
    method: 'POST',
    body: data,
  });

  const { filenames } = await response.json();

  return filenames;
};

export const insertImages = (editor: Editor, filenames: string[]) => {
  const images = filenames.map<ImageElement>((filename) => {
    return { type: 'image', filename, children: [{ text: '' }] };
  });

  Transforms.insertNodes(editor, images);
};
