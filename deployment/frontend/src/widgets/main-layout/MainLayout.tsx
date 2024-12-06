import React, { type ReactElement } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { MainHeader } from '@/widgets/main-layout/header/MainHeader.tsx';
import { MainFooter } from '@/widgets/main-layout/footer/MainFooter.tsx';
const { Content } = Layout;

export const MainLayout = (): ReactElement => {
  return (
    <MainLayoutStyled>
      <MainHeader />
      <ContentStyled>
        <Outlet />
      </ContentStyled>
      <MainFooter />
    </MainLayoutStyled>
  );
};

const MainLayoutStyled = styled(Layout)`
  overflow: hidden;
  width: 100%;
  height: 100vh;
`;

const ContentStyled = styled(Content)`
  text-align: center;
  min-height: 120px;
  line-height: 120px;
  background-color: var(--primary-color);
`;
