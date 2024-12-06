import React from 'react';
import styled from 'styled-components';
import { darkColorsTheme } from '@/app/styles/theme/dark-theme.ts';
import { GlobalSpinner } from '@/features/loading/global-spinner/GlobalSpinner.tsx';

interface LoadingProps {
  size?: string;
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size, color }) => {
  const spinnerColor = color ?? darkColorsTheme.spinnerBase;
  return (
    <SpinnerContainer>
      <GlobalSpinner size={size} color={spinnerColor} />
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
