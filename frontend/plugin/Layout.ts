import { Editor, Element, Node, Transforms } from 'slate';
import { TitleElement, ParagraphElement } from '../types/slate';

export const withLayout = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length < 1) {
        const title: TitleElement = {
          type: 'title',
          children: [{ text: 'Untitled' }],
        };
        Transforms.insertNodes(editor, title, { at: path.concat(0) });
      }

      if (editor.children.length < 2) {
        const paragraph: ParagraphElement = {
          type: 'paragraph',
          children: [{ text: '' }],
        };
        Transforms.insertNodes(editor, paragraph, { at: path.concat(1) });
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        const slateIndex = childPath[0];
        const enforceType = (type: Element['type']) => {
          if (Element.isElement(child)) {
            const newProperties: Partial<Element> = { type };
            Transforms.setNodes<Element>(editor, newProperties, {
              at: childPath,
            });
          }
        };

        if (!Element.isElement(child)) {
          continue;
        }

        switch (slateIndex) {
          case 0:
            if (child.type !== 'title') enforceType('title');
            break;
          default:
            if (child.type == 'title') enforceType('paragraph');
            break;
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};
