import styled, { css } from 'styled-components';
import { GothamNormal } from '@/app/styles/fonts/FontsStyles.tsx';

export const CenteredContent = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1vh;
`;

export const WhiteButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  gap: 5px;
  width: 214px;
  background: #ffffff;
  border-radius: 20px;
`;
export const BlackText = styled(GothamNormal)`
  font-size: 1.3rem;
  font-weight: 400;
  color: #000000;
  padding: 5% 5% 5% 10%;
`;
