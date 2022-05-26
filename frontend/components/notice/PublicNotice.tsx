import { DeleteOne, Down, Editor, Lock, Unlock } from '@icon-park/react';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';
import { INotice } from '../../pages/admin';
import { withCorrectVoidBehavior } from '../../plugin/CorrectVoidBehaviour';
import { makeImagesPlugin } from '../../plugin/Images';
import { withLayout } from '../../plugin/Layout';
import { TitleElement } from '../../types/slate';
import { NoticeElement } from './NoticeElement';
import { NoticeLeaf } from './NoticeLeaf';

interface IPublicNoticeProps {
  notice: INotice;
}

const PublicNotice: FC<IPublicNoticeProps> = ({ notice }) => {
  const [isOpened, setIsOpened] = useState(false);

  const [titleElement, ...body] = notice.document ?? [];

  const titleText = (titleElement as TitleElement).children.at(0)?.text;

  const withImages = makeImagesPlugin(notice.id);

  const editor = useMemo(
    () =>
      withCorrectVoidBehavior(
        withLayout(withImages(withHistory(withReact(createEditor())))),
      ),
    [],
  );

  return (
    <div>
      <div className="flex justify-between">
        <p
          className={`block text-5xl whitespace-normal text-justify items-center mr-8`}
        >
          {titleText}
        </p>

        <div className="flex items-end">
          <button
            className={`block cursor-default transition-transform ease-in-out duration-200 ${
              isOpened ? 'rotate-180' : ''
            }`}
            onClick={() => setIsOpened(!isOpened)}
            disabled={!titleText}
          >
            <Down
              theme="filled"
              size="36"
              fill={!titleText ? '#CCC' : '#333'}
            />
          </button>
        </div>
      </div>

      <div className={`${isOpened ? 'block' : 'hidden'} mt-4`}>
        <Slate editor={editor} value={body}>
          <Editable
            readOnly
            className="h-full w-full"
            renderElement={(props) => (
              <NoticeElement {...props} noticeId={notice.id} />
            )}
            renderLeaf={NoticeLeaf}
          />
        </Slate>
      </div>
    </div>
  );
};

export default PublicNotice;
