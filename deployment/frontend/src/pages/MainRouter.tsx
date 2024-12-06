import React, { type ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DOCUMENTS, EDITOR, MAIN, ROOT } from '@/shared/constants/paths.ts';
import { MainLayout } from '@/widgets/main-layout/MainLayout.tsx';
import { MainPage } from '@/pages/page/main/MainPage.tsx';
import { DocumentPage } from '@/pages/page/documents/DocumentPage.tsx';
import { EditorPage } from '@/pages/page/editor/EditorPage.tsx';

export const MainRouter = (): ReactElement => {
  return (
    <Routes>
      <Route path={ROOT} element={<MainLayout />}>
        <Route path={MAIN} element={<MainPage />} />
        <Route path={DOCUMENTS} element={<DocumentPage />} />
        <Route path={EDITOR} element={<EditorPage />} />

        <Route path={ROOT} element={<Navigate to={MAIN} />} />
      </Route>

      <Route path="*" element={<Navigate to={MAIN} />} />
    </Routes>
  );
};
