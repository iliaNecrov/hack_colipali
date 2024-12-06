import React, { type ReactElement, useState } from 'react';
import { HeaderNav } from '@/features/navigations/HeaderNav.tsx';
import { headerNavBarData, IHeaderNavbarData } from '@/shared/data/header-navbar.data.ts';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

export const HeaderNavBar = (): ReactElement => {
  const location = useLocation();
  return (
    <NavBar>
      {headerNavBarData.map((elem: IHeaderNavbarData) => (
        <HeaderNav key={elem.id} elem={{ ...elem, isActive: location.pathname === elem.url }} />
      ))}
    </NavBar>
  );
};

const NavBar = styled.ul`
  height: 30px;
  list-style-type: none;
  padding-left: 0;
  display: flex;
  flex-direction: row;
  column-gap: 20px;
`;
