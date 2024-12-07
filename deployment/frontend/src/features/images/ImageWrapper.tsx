import React, { type ReactElement } from 'react';
import styled from 'styled-components';
import { IImage } from '@/pages/page/documents/DocumentPage.tsx';

interface IImageWrapper {
  elem: IImage;
}

export const ImageWrapper = ({ elem }: IImageWrapper): ReactElement => {
  return (
    <Wrapper>
      <StyledImage src={`data:image/png;base64,${elem?.img}`} alt="Image" />;
      <Text>{elem.text}</Text>
    </Wrapper>
  );
};

const Text = styled.div`
  color: var(--text-main-color);
`;
const Wrapper = styled.div``;

const StyledImage = styled.img`
  width: 80%;
`;
