import { RenderLeafProps } from 'slate-react';

export const NoticeLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em {...attributes}>{children}</em>;
  }

  if (leaf.underline) {
    children = <u {...attributes}>{children}</u>;
  }

  if (leaf.h1) {
    children = (
      <span className="text-xl" {...attributes}>
        {children}
      </span>
    );
  }

  if (leaf.h2) {
    children = (
      <span className="text-3xl" {...attributes}>
        {children}
      </span>
    );
  }

  return <span {...attributes}>{children}</span>;
};
