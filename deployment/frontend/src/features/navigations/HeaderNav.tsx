import React, { type ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { IHeaderNavbarData } from '@/shared/data/header-navbar.data.ts';
import { useNavigate } from 'react-router-dom';

interface IHeaderNav {
  elem: IHeaderNavbarData;
}

export const HeaderNav = ({ elem }: IHeaderNav): ReactElement => {
  const navigate = useNavigate();
  const handelOnClick = () => {
    navigate(elem.url);
  };
  return (
    <HeaderElement onClick={handelOnClick} isActive={elem.isActive}>
      {elem.text}
    </HeaderElement>
  );
};

const activeStyles = css`
  background-color: var(--primary-color);
`;

const inactiveStyles = css``;

const HeaderElement = styled.li.attrs<{ isActive: boolean }>(({ isActive }) => ({
  className: isActive ? 'active' : '',
}))`
  ${({ isActive }) => (isActive ? activeStyles : inactiveStyles)}
  padding: 1% 2% 1% 2%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
