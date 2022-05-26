import React, { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import { TitleElement } from '../../types/slate';

interface INoticeTitleProps {
  element: TitleElement;
}

const NoticeTitle: FC<RenderElementProps & INoticeTitleProps> = ({
  element,
  attributes,
  children,
}) => {
  const isEmpty = (element.children.at(0)?.text?.length ?? 1) == 0;
  return (
    <div className="z-10 relative pb-4">
      <p
        className="placeholder text-5xl whitespace-normal text-justify"
        {...attributes}
      >
        {children}
      </p>
      {isEmpty ? (
        <div
          suppressContentEditableWarning={true}
          contentEditable="false"
          className="-z-10 text-5xl absolute top-0 left-0 select-none text-neutral-400"
          style={{ pointerEvents: 'none' }}
        >
          Título
        </div>
      ) : null}
    </div>
  );
};

export default NoticeTitle;
