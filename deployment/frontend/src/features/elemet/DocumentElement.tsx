import React, { type ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DocumentSvg } from '@/shared/svg/document.svg.tsx';
import { Button, message, theme } from 'antd';
import { IDocumentData } from '@/shared/data/document.data.ts';
import { CloudDownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { EditFileModal } from '@/features/modal/EditFileModal.tsx';
import { IDocumentObject } from '@/shared/interfaces/document.interface.ts';
import axios from 'axios';
import { downloadFile } from '@/shared/utils/utils.ts';
import { useNavigate } from 'react-router-dom';
import { EDITOR } from '@/shared/constants/paths.ts';
import { api } from '@/path.ts';

interface IDocumentElement {
  elem: IDocumentObject;
  fetchData: (...args) => Promise<void>;
}
export const DocumentElement = ({ elem, fetchData }: IDocumentElement): ReactElement => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  useEffect((): void => {
    if (loading) {
      void messageApi.loading({ content: 'Скачивание файла', duration: 9000 });
    }
  }, [loading]);
  const onClickDownload = (): void => {
    void (async (): Promise<void> => {
      const response = (
        await axios.get(`${api}/download?document_id=${elem.id}`, {
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' },
        })
      ).data;
      downloadFile(response, `${elem.info?.header?.replace('.txt', '')}.docx`);
    })();
  };

  const handleDelete = (): void => {
    void (async (): Promise<void> => {
      await axios.delete(`${api}/document?document_id=${elem.id}`);
      await fetchData(true);
    })();
  };
  const handleCancel = (): void => {
    setOpen(false);
  };

  const showModal = (): void => {
    if (loading) return;
    setOpen(true);
  };

  const handlerEditOnClick = (): void => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const onClickEdit = (): void => {
    localStorage.setItem('fileId', elem.id);
    navigate(EDITOR);
  };
  return (
    <DocumentWrapper>
      {contextHolder}
      <EditFileModal handleCancel={handleCancel} open={open} handleOk={handlerEditOnClick} />
      <DocumentIconStyles>
        <DocumentSvg />
      </DocumentIconStyles>
      <InfoWrapper>
        <Text>{elem.info.header}</Text>
        <Description>{elem.info.description}</Description>
        <ButtonWrapper>
          <StyledButton onClick={onClickEdit} color="default" variant="filled">
            Редактировать
          </StyledButton>
          <SummaryButton type={'dashed'}>Сводка</SummaryButton>
        </ButtonWrapper>
      </InfoWrapper>
      <DeleteWrapper>
        <DeleteOutlined onClick={handleDelete} />
      </DeleteWrapper>
      <DownloadWrapper>
        <CloudDownloadOutlined onClick={onClickDownload} />
      </DownloadWrapper>
    </DocumentWrapper>
  );
};

const DownloadWrapper = styled.div`
  position: absolute;
  z-index: 1;
  right: 15px;
  bottom: -40px;
`;

const DocumentWrapper = styled.div`
  position: relative;
  min-width: 600px;
  background: var(--primary1-color);
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-radius: 10px;
  border: 1px solid var(--border-base-color);
`;

const InfoWrapper = styled.div`
  display: flex;
  width: 90%;
  padding: 5% 5% 5%;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  height: 100%;
  row-gap: 20px;
`;

const DocumentIconStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.h2`
  all: unset;
  line-height: 1;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: left;
  margin-top: -20px;
`;
const Description = styled.p`
  all: unset;
  line-height: 1.5;
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 10px;
`;

const StyledButton = styled(Button)``;

const DeleteWrapper = styled.div`
  position: absolute;
  z-index: 1;
  right: 15px;
  top: -40px;
`;

const SummaryButton = styled(Button)`
  &:hover {
    color: var(--secondary-color) !important;
    border-color: var(--secondary-color) !important;
  }
`;
