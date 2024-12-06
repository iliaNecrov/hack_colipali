import React, { type ReactElement, useState } from 'react';
import { PageTitle } from '@/features/page-title/PageTitle.tsx';
import { DocumentsMenu } from '@/widgets/document-page/DocumentsMenu.tsx';
import styled from 'styled-components';
import {
  DocumentTypeSelect,
  IChooseFileType,
} from '@/widgets/document-type/DocumentTypeSelect.tsx';
import { IDocumentObject } from '@/shared/interfaces/document.interface.ts';
import axios from 'axios';
import { Button, message } from 'antd';
import { api } from '@/path.ts';

export const DocumentPage = (): ReactElement => {
  const [chooseFileType, setChooseFileType] = useState<IChooseFileType>({ value: 'Выберете тип' });
  const [messageApi, contextHolder] = message.useMessage();
  const [documents, setDocument] = useState<IDocumentObject[]>([]);
  const fetchData = async (isMounted?: boolean, url = `${api}/documents`): Promise<void> => {
    try {
      const response: IDocumentObject[] = (await axios.get(url)).data;
      if (isMounted) {
        setDocument(response);
      }
    } catch (e) {
      messageApi.error(`Ошибка загрузки: ${e}`);
    }
  };
  const onSelect = (v: IChooseFileType) => {
    void fetchData(true, `${api}/documents`);
  };
  return (
    <>
      {contextHolder}
      <PageTitle>Документы</PageTitle>
      <Container>
        <Wrapper>
          <Title>Ваши документы</Title>
          <SubHeaderWrapper>
            <FilterContainer>
              <DocumentTypeSelect
                chooseFileType={chooseFileType}
                setChooseFileType={setChooseFileType}
                placeholder={'Выберете тип'}
                onCustomSelect={onSelect}
              />
            </FilterContainer>
            <StyledButton>Загрузить</StyledButton>
          </SubHeaderWrapper>
          <DocumentsMenu fetchData={fetchData} documents={documents} />
        </Wrapper>
      </Container>
    </>
  );
};
const StyledButton = styled(Button)`
  background-color: var(--secondary-background-color);
  color: var(--primary-color);
`;

const SubHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 20%;
  height: 40px;
  align-self: flex-start;
`;
const Wrapper = styled.div`
  padding-top: 2%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 20px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  all: unset;
  line-height: 1.3;
  font-weight: 500;
  font-size: 1.5rem;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;
