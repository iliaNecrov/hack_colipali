import React from 'react';
import styled from 'styled-components';
import { Select, SelectProps } from 'antd';

export interface ISelectProps extends SelectProps {
  className?: string;
}
export const BaseRoundSelect = React.forwardRef<any, ISelectProps>(
  ({ className, children, ...props }, ref) => (
    <StyledSelect ref={ref} className={className} {...props}>
      {children}
    </StyledSelect>
  ),
);

const StyledSelect = styled(Select)`
  border-radius: 20px;
  color: var(--secondary-color);
  border-color: var(--secondary-color);
  &:hover {
    border-color: var(--secondary-color) !important;
  }
  &:active {
    border-color: var(--secondary-color) !important;
  }
  &:before {
    border-color: var(--secondary-color) !important;
    box-shadow: 0px 1px 6px var(--secondary-color) !important;
  }
  &:focus {
    border-color: var(--secondary-color) !important;
    box-shadow: 0px 1px 6px var(--secondary-color) !important;
  }
`;
