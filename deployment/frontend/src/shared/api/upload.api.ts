import type { RcFile } from 'antd/lib/upload';
import { translit } from '@/shared/utils/utils.ts';
import axios from 'axios';
import { IFileWithInfoResponse } from '@/features/upload-file/UploadFileComponent.tsx';
import { api } from '@/path.ts';

export const uploadFileApi = async (
  data: string | Blob | RcFile,
): Promise<IFileWithInfoResponse | undefined> => {
  const file = new FormData();
  if (typeof data !== 'string' && 'name' in data) {
    const name = translit(data?.name);
    file.append('originalname', data?.name);
    file.append('name', name);
  }

  file.append('file', data as Blob);
  return (
    await axios.post(`${api}/file`, file, {
      headers: {
        'Content-Type': 'multipart/form-data;charset=utf-8',
      },
    })
  ).data;
};
