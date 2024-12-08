import { IImage } from '@/pages/page/documents/DocumentPage.tsx';

export interface IEntity {
  value: string;
  label: string;
  score: number;
  start: number;
  end: number;
}

export interface IType {
  label: string;
  score: number;
}

export interface IInfo {
  header: string;
  description: string;
}

export interface IDocumentObject {
  id: string;
  file: string;
  info: IInfo;
  type: IType;
  entities: IEntity[];
}

export interface IImagesResponse {
  images: IImage[];
}
