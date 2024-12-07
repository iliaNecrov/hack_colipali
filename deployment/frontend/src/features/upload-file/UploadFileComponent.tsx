import { type RcFile, UploadChangeParam } from 'antd/lib/upload';
import { ReactElement, useState } from 'react';
import { message, Upload, type UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadFileApi } from '@/shared/api/upload.api.ts';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { DOCUMENTS } from '@/shared/constants/paths.ts';
import { type UploadFile } from 'antd/lib';

const { Dragger } = Upload;

export interface IFileWithInfoResponse {
  content: string;
  fileId: string;
  fileName: string;
  contentType: string;
  size: number;
}

interface IUploadFileModal {}
export const UploadFileComponent = ({}: IUploadFileModal): ReactElement => {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();
  const validFileUpload = (fileType: string): boolean => {
    return fileType === 'application/pdf';
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (file: RcFile): boolean => {
      const isValid = validFileUpload(file.type);
      if (!isValid) {
        void messageApi.error(`${file.name} is not a valid file`);
      }
      return isValid;
    },
    onChange(info: UploadChangeParam): void {
      const { status } = info.file;
      if (status === 'done') {
        void messageApi.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        void messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    async customRequest({ file, onSuccess, onError }: any): Promise<void> {
      if (typeof file === 'string') return;
      try {
        void messageApi.loading('Загрузка', 999999);
        const response = await uploadFileApi(file);
        console.log(file);
        if (!response) return;
        onSuccess?.(response);
        messageApi.destroy();
        messageApi.success(
          'Файл успешно загружен на сервер!\n' +
            'Перейдите на другую страницу для выбора вашего файла',
          10,
        );
        setFileList(prevState => [
          {
            ...response,
            id: response?.fileId,
            name: file?.name,
            content: response.content,
            uid: response.fileId,
            fileName: response.fileName,
            type: file.type,
            size: response.size,
            fileId: response.fileId,
          },
          ...prevState,
        ]);
      } catch (e) {
        onError?.(e as ProgressEvent);
        messageApi.destroy();
        messageApi.error('При загрузке файла произошла ошибка');
      }
    },
  };

  return (
    <DraggerStyled {...props} listType="picture" fileList={fileList}>
      <div>
        <p className="ant-upload-drag-icon">
          {contextHolder}
          <Icon />
        </p>
        <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
        <p className="ant-upload-hint">Загрузите файл и наш сервис поможет в его анализе</p>
      </div>
    </DraggerStyled>
  );
};

const DraggerStyled = styled(Dragger)`
  &:hover {
    color: var(--primary-color1) !important;
  }
  color: var(--text-main-color) !important;
`;

const Icon = styled(InboxOutlined)`
  color: var(--primary-color1) !important;
`;
