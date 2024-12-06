import React, { type ReactElement } from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import { LogoSvg } from '@/shared/svg/logo.svg.tsx';
const { Footer } = Layout;
export const MainFooter = (): ReactElement => {
  return <FooterStyled>{/*<LogoSvg />*/}</FooterStyled>;
};

const FooterStyled = styled(Footer)`
  box-shadow: 0 -1px 2px var(--shadow-color);
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 12%;
  z-index: 1;
`;
