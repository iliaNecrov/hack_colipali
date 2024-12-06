import Buffer from 'buffer';

type DeepEqualResult = boolean | { [key: string]: DeepEqualResult };

export const downloadFile = (blob: Blob | undefined, text: string): void => {
  if (!blob) return;
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', text);

  document.body.appendChild(link);

  link.click();

  if (link.parentNode) {
    link.parentNode.removeChild(link);
  }
};

export interface IFileWithInfoResponse {
  content: string;
  fileId: string;
  fileName: string;
  contentType: string;
  size: number;
}
export const blobToBase64 = async (
  blob: Blob | undefined,
): Promise<undefined | string | null | ArrayBuffer> => {
  if (!blob) return;
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return await new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
export const makeFileFromResponse = (response: IFileWithInfoResponse | undefined) => {
  if (!response) return;
  const { content, contentType } = response;
  const blob = new Blob([Buffer.Buffer.from(content, 'base64')], { type: contentType });
  const file: any = {
    id: response?.fileId,
    name: response.fileName,
    content: response.content,
    uid: response.fileId,
    fileName: response.fileName,
    type: response.contentType,
    size: response.size,
    fileId: response.fileId,
    url: URL.createObjectURL(blob),
  };

  file.originFileObj = content;

  void blobToBase64(blob).then(r => {
    if (!r || typeof r !== 'string') return;
    file.preview = r;
  });
  return file;
};

export function deepEqual(obj1: any, obj2: any): DeepEqualResult {
  // Base case: If both objects are identical, return true.
  if (obj1 === obj2) {
    return true;
  }

  // Check if both objects are objects and not null.
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  // Get the keys of both objects.
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

export const sliceText = (description: string | undefined, index: number): string | undefined => {
  if (!description) return;
  if (description.length <= index) {
    return description;
  }
  const words = description.split(' ');
  let result = '';

  for (let word of words) {
    if (result.length + word.length + 1 > index) {
      break;
    }
    result += (result ? ' ' : '') + word;
  }
  return result.trim() + '...';
};

export function getRandomColor(): string {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  );
}

export const isString = (value: unknown): boolean => {
  return typeof value === 'string';
};

export const translit = (word: string): string => {
  const converter = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ь: '',
    ы: 'y',
    ъ: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  word = word.toLowerCase();

  let answer = '';
  for (let i = 0; i < word.length; ++i) {
    if (converter[word[i] as keyof typeof converter] === undefined) {
      answer += word[i];
    } else {
      answer += converter[word[i] as keyof typeof converter];
    }
  }
  return answer;
};

export const isArraysEqual = (array1: string[], array2: string[]): boolean => {
  const array2Sorted = array2.slice().sort();
  return (
    array1.length === array2.length &&
    array1
      .slice()
      .sort()
      .every(function (value, index) {
        return value === array2Sorted[index];
      })
  );
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const isEmptyString = (str: string): boolean => {
  return /^\s+$/.test(str) || str.length === 0;
};

export const uuid = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const hexToRGB = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;
};

export const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(((R * (100 + percent)) / 100).toString());
  G = parseInt(((G * (100 + percent)) / 100).toString());
  B = parseInt(((B * (100 + percent)) / 100).toString());

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
};

/**
 * Remove useless spaces
 * Exp: Hello    World   Js -> Hello World Js
 * @param value - entry string
 */
export const trimEveryWord = (value: string): string => {
  return value
    ?.split(/(\s+)/)
    ?.filter(e => e.trim().length > 0)
    ?.join(' ');
};

export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return {
      h,
      s,
      l,
    };
  } else {
    throw new Error('Non valid HEX color');
  }
};
