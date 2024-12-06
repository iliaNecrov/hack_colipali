import React, { type ReactElement, useEffect, useState } from 'react';
import { DocumentElement } from '@/features/elemet/DocumentElement.tsx';
import styled from 'styled-components';
import { documentData } from '@/shared/data/document.data.ts';
import axios from 'axios';
import { message } from 'antd';
import { IDocumentObject } from '@/shared/interfaces/document.interface.ts';

interface IDocumentsMenu {
  fetchData: (...args) => Promise<void>;
  documents: IDocumentObject[];
}
export const DocumentsMenu = ({ fetchData, documents }: IDocumentsMenu): ReactElement => {
  useEffect(() => {
    let isMounted = true;
    void fetchData(isMounted);
    return (): void => {
      isMounted = false;
    };
  }, []);

  return (
    <Wrapper>
      {documents?.length > 0
        ? documents?.map((elem: IDocumentObject) => (
            <DocumentElement fetchData={fetchData} key={elem.id} elem={elem} />
          ))
        : 'У вас нет документов'}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  row-gap: 20px;
  overflow-y: auto;
`;
