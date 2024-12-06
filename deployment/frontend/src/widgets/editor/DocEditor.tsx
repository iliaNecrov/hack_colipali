import React, { type ReactElement, useEffect, useState } from 'react';
import mammoth from 'mammoth';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import styled from 'styled-components';
import { Button } from 'antd';

interface IDocEditor {
  fileUrl: string;
}

const modules = {
  toolbar: [[{ list: 'ordered' }, { list: 'bullet' }], ['bold', 'italic', 'underline'], ['link']],
};
export const DocEditor = ({ fileUrl }: IDocEditor): ReactElement => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocx = async () => {
      try {
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const arrayBuffer = response.data;

        const result = await mammoth.convertToHtml({ arrayBuffer });
        setContent(result.value);
      } catch (error) {
        console.error('Error loading the document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocx();
  }, [fileUrl]);

  const saveDoc = () => {
    const newDoc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(content)],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(newDoc).then(blob => {
      const link = document?.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'edited-document.docx';
      link.click();
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <DocumentWrapper>
        <SubHeader>
          <Title>Изменить документ</Title>
          <StyledButton onClick={saveDoc}>Сохранить</StyledButton>
        </SubHeader>
        <DocumentContainer>
          <ReactQuill modules={modules} value={content} onChange={setContent} />
        </DocumentContainer>
      </DocumentWrapper>
    </div>
  );
};

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 80%;
  padding-bottom: 5px;
  padding-top: 5px;
`;
const StyledButton = styled(Button)`
  z-index: 1;
  background-color: var(--secondary-background-color);
  color: var(--primary-color);
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

const DocumentContainer = styled.div`
  width: 80%;
  height: 70vh;
  overflow-y: scroll;
  background-color: var(--primary1-color);
  .ql-toolbar {
    width: 100%;
    font-size: 12px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .ql-toolbar .ql-picker-label,
  .ql-toolbar .ql-picker-item {
    width: 50px;
  }
`;

const DocumentWrapper = styled.div`
  z-index: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`;
