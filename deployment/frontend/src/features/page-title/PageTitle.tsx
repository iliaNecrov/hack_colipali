import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { WithChildrenProps } from '@/shared/types/general.types.ts';

export const PageTitle: React.FC<WithChildrenProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{children}</title>
      </Helmet>
    </HelmetProvider>
  );
};
