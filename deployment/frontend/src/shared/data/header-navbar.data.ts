import { DOCUMENTS, EDITOR, MAIN } from '@/shared/constants/paths.ts';

export interface IHeaderNavbarData {
  id: number;
  text: string;
  url: string;
  isActive: boolean;
}

export const headerNavBarData: IHeaderNavbarData[] = [
  {
    id: 1,
    text: 'Главная',
    url: MAIN,
    isActive: true,
  },
  {
    id: 2,
    text: 'Документы',
    url: DOCUMENTS,
    isActive: false,
  },
  {
    id: 3,
    text: 'Редактор',
    url: EDITOR,
    isActive: false,
  },
];
