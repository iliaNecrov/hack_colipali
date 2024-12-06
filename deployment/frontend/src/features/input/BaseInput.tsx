import React from 'react';
import { Input, type InputProps as AntInputProps } from 'antd';
import styled from 'styled-components';

export interface InputProps extends AntInputProps {
  className?: string;
}

export const BaseInput = React.forwardRef<any, InputProps>(
  ({ className, children, ...props }, ref) => (
    <StyledInput ref={ref} className={className} {...props}>
      {children}
    </StyledInput>
  ),
);

const StyledInput = styled(Input)`
  color: var(--secondary-color);
  border-color: var(--secondary-color);
  &:hover {
    border-color: var(--secondary-color) !important;
  }
  &:active {
    border-color: var(--secondary-color) !important;
  }
  &:focus {
    border-color: var(--secondary-color) !important;
    box-shadow: 0px 1px 6px var(--secondary-color) !important;
  }
`;
