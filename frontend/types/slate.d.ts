import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomText = {
  text: string;
};

type ParagraphElement = { type: 'paragraph'; children: RichText[] };
type TitleElement = { type: 'title'; children: RichText[] };
type ImageElement = { type: 'image'; filename: string; children: CustomText[] };

type NumberedList = {
  type: 'numbered-list';
  children: CustomText[];
};
type BulletList = { type: 'bulleted-list'; children: CustomText[] };
type ListItem = { type: 'list-item'; children: RichText[] };

type RichText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  h1?: boolean;
  h2?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element:
      | ParagraphElement
      | ImageElement
      | ListItem
      | NumberedList
      | BulletList
      | TitleElement;
    Text: RichText;
  }
}
