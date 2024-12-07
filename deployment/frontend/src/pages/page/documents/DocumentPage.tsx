import React, { type ReactElement, useCallback, useEffect, useState } from 'react';
import { PageTitle } from '@/features/page-title/PageTitle.tsx';
import styled from 'styled-components';
import { IImagesResponse } from '@/shared/interfaces/document.interface.ts';
import axios from 'axios';
import { Button, message } from 'antd';
import { api } from '@/path.ts';
import { BaseInput } from '@/features/input/BaseInput.tsx';
import { ImageWrapper } from '@/features/images/ImageWrapper.tsx';

export const DocumentPage = (): ReactElement => {
  const [messageApi, contextHolder] = message.useMessage();
  const [images, setImages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const fetchData = useCallback(
    async (isMounted?: boolean, url = `${api}/images`): Promise<void> => {
      try {
        const response: IImagesResponse = (await axios.get(url)).data;
        if (isMounted) {
          const images = response.images;
          setImages(images);
        }
      } catch (e) {
        messageApi.error(`Ошибка загрузки: ${e}`);
      }
    },
    [],
  );
  console.log('value', inputValue);
  useEffect(() => {
    let isMounted = true;
    void fetchData(isMounted);
    return (): void => {
      isMounted = false;
    };
  }, [fetchData]);
  return (
    <>
      {contextHolder}
      <PageTitle>Документы</PageTitle>
      <Container>
        <Wrapper>
          <Title>Ваши документы</Title>
          <SubHeaderWrapper>
            <BaseInput
              onChange={e => setInputValue(e.target.value)}
              value={inputValue}
              placeholder={'Введите промпт'}
            />
            <Button>Отправить</Button>
          </SubHeaderWrapper>
          {images.map((imgBase64, index) => (
            <ImageWrapper key={index} base64={imgBase64} alt="Image" />
          ))}
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
  column-gap: 40px;
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
