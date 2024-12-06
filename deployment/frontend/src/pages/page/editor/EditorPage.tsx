import React, { type ReactElement } from 'react';
import { DocEditor } from '@/widgets/editor/DocEditor.tsx';
import { api } from '@/path.ts';

export const EditorPage = (): ReactElement => {
  console.log(`${api}/get-test-file`);

  const fileId = localStorage.getItem('fileId');
  return (
    <>
      <DocEditor fileUrl={`${api}/download?document_id=${fileId}`} />
    </>
  );
};
