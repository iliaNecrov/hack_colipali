import React, { type ReactElement, useEffect, useState } from 'react';
import { Button, message } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { DocumentTypeSelect } from '@/widgets/document-type/DocumentTypeSelect.tsx';
import { UploadFileComponent } from '@/features/upload-file/UploadFileComponent.tsx';

export const MainPageInfo = (): ReactElement => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (loading) {
      void messageApi.loading({ content: 'Генерация файла', duration: 9000 });
    }
  }, [loading]);

  return (
    <>
      {contextHolder}
      <Wrapper>
        <MainContainer>
          <TextContainer>
            <TitleText>Визуализация RAG</TitleText>
            <Description>Загрузите файл</Description>
          </TextContainer>
          <SearchContainer>
            <UploadFileComponent />
          </SearchContainer>
        </MainContainer>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 50%;
  width: 80%;
  margin-top: -5%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  row-gap: 1px;
`;

const Description = styled.p`
  font-size: 2.3rem;
  color: var(--secondary-color);
  line-height: normal;
  width: 100%;
  white-space: nowrap;
  margin-top: 0;
`;
const TitleText = styled.h1`
  all: unset;
  font-weight: bold;
  font-size: 3rem;
  line-height: normal;
  width: 100%;
  white-space: nowrap;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 600px;
  min-width: 30%;
  margin-top: -1%;
  gap: 12px;
`;

const StyledSelect = styled(DocumentTypeSelect)`
  width: 80%;
  height: 40px;
`;

const StyledButton = styled(Button)`
  height: 40px;
  width: 30%;
  border-radius: 8px;
  background-color: var(--secondary-background-color);
  color: var(--primary-color);
`;
