import React, { type ReactElement } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { HeaderNavBar } from '@/widgets/main-layout/header/header-elements/HeaderNavBar.tsx';
import { LogoSvg } from '@/shared/svg/logo.svg.tsx';

const { Header } = Layout;
export const MainHeader = (): ReactElement => {
  return (
    <HeaderStyled>
      <LogoWrapper>{/*<LogoSvg />*/}</LogoWrapper>
      <HeaderNavContainer>
        <HeaderNavBar />
      </HeaderNavContainer>
    </HeaderStyled>
  );
};

const LogoWrapper = styled.div`
  display: flex;
  transform: scale(0.5);
  align-items: center;
  min-width: 300px;
  margin-left: -75px;
`;

const HeaderStyled = styled(Header)`
  background-color: var(--primary1-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  height: 12%;
  box-shadow: 0 1px 2px var(--shadow-color);
`;

const HeaderNavContainer = styled.div`
  display: flex;
`;
