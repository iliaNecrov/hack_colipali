import React, { type ReactElement, useCallback, useEffect, useState } from 'react';
import { PageTitle } from '@/features/page-title/PageTitle.tsx';
import styled from 'styled-components';
import { IImagesResponse } from '@/shared/interfaces/document.interface.ts';
import axios from 'axios';
import { Button, message } from 'antd';
import { api } from '@/path.ts';
import { BaseInput } from '@/features/input/BaseInput.tsx';
import { ImageWrapper } from '@/features/images/ImageWrapper.tsx';

export interface IImage {
  page: number;
  text: string;
  name: string;
  img: string;
}

export const DocumentPage = (): ReactElement => {
  const [messageApi, contextHolder] = message.useMessage();
  const [images, setImages] = useState<IImage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [text, setText] = useState<string>('');
  const fetchData = useCallback(
    async (value: string, isMounted?: boolean, url = `${api}/search`): Promise<void> => {
      try {
        const response: IImagesResponse = (
          await axios.post(
            url,
            { query: value },
            {
              headers: { 'Content-Type': 'application/json' },
            },
          )
        ).data;

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
  const fetchGenerate = async (value: string) => {
    const response: string = (
      await axios.post(
        `${api}/generate`,
        { query: value },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
    ).data;

    setText(response);
  };

  const onButtonClick = () => {
    void fetchData(inputValue, true);
    void fetchGenerate(inputValue);
  };
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
              placeholder={'Введите вопрос'}
            />

            <Button onClick={onButtonClick}>Отправить</Button>
          </SubHeaderWrapper>
          <BodyWrapper>
            <ImageContainer>
              {images.map((elem, index) => (
                <ImageWrapper key={index} elem={elem} />
              ))}
            </ImageContainer>
            <TextContainer>{text}</TextContainer>
          </BodyWrapper>
        </Wrapper>
      </Container>
    </>
  );
};
const StyledButton = styled(Button)`
  background-color: var(--secondary-background-color);
  color: var(--primary-color);
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow-y: scroll;
  height: 500px;
`;
const ImageContainer = styled.div`
  width: 60%;
  height: 500px;
`;
const TextContainer = styled.div`
  align-items: center;
  justify-content: center;
  width: 30%;
  background: var(--primary-color);
  border-radius: 10px;
  line-height: 1;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: left;
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
