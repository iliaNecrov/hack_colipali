import React, { type ReactElement } from 'react';
import { PageTitle } from '@/features/page-title/PageTitle.tsx';
import { MainPageInfo } from '@/widgets/main-page-info/MainPageInfo.tsx';

export const MainPage = (): ReactElement => {
  return (
    <>
      <PageTitle>Главная</PageTitle>
      <MainPageInfo />
    </>
  );
};
