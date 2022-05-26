import Image from 'next/image';
import { FC } from 'react';
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';
import { ImageElement } from '../../types/slate';

export const NoticeImage: FC<
  { element: ImageElement; noticeId: number } & RenderElementProps
> = ({ children, element, noticeId, attributes }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div>
      {children}
      <div
        {...attributes}
        contentEditable={false}
        className="relative"
        onDrag={(ev) => console.log('yo')}
      >
        <div
          className={`z-0 absolute bg-blue-700 w-full h-full top-0 left-0`}
        />

        <img
          src={`/api/notices/${noticeId}/${element.filename}`}
          className={`relative z-10 w-full ${
            selected && focused ? 'opacity-70' : 'opacity-100'
          }`}
        />
      </div>
    </div>
  );
};
