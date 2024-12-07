import React, { type ReactElement } from 'react';
import styled from 'styled-components';

interface IImageWrapper {
  base64: string;
}
export const ImageWrapper = ({ base64 }: IImageWrapper): ReactElement => {
  return <StyledImage src={`data:image/png;base64,${base64}`} alt="Image" />;
};

const StyledImage = styled.img`
  width: 80%;
`;
