import { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import { NoticeImage } from './NoticeImage';
import NoticeTitle from './NoticeTitle';

export const NoticeElement: FC<RenderElementProps & { noticeId: number }> = ({
  attributes,
  children,
  element,
  noticeId,
}) => {
  switch (element.type) {
    case 'image':
      return (
        <NoticeImage
          attributes={attributes}
          element={element}
          noticeId={noticeId}
        >
          {children}
        </NoticeImage>
      );
    case 'list-item':
      return <li>{children}</li>;
    case 'numbered-list':
      return <ol className="list-inside list-decimal">{children}</ol>;
    case 'bulleted-list':
      return <ul className="list-inside list-disc">{children}</ul>;
    case 'title':
      return (
        <NoticeTitle attributes={attributes} element={element}>
          {children}
        </NoticeTitle>
      );
    case 'paragraph':
      return (
        <p className="text-justify" {...attributes}>
          {children}
        </p>
      );
  }
};
