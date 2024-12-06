import styled from 'styled-components';

export const GothamBold = styled.div`
  font-family: 'Gotham Pro', sans-serif;
  font-style: normal;
  font-weight: bold;
`;

export const GothamNormal = styled.div`
  font-family: 'Gotham Pro', sans-serif;
  font-style: normal;
  font-weight: 400;
`;

export const ClampText = () => `
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`;

export const Inter = () => `
  font-family: 'Inter', sans-serif;
`;
