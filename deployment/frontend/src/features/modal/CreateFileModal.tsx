import React, { type ReactElement } from 'react';
import { Button, Form, Modal } from 'antd';
import { BaseInput } from '@/features/input/BaseInput.tsx';
import styled from 'styled-components';
import { Formik, FieldArray, FormikTouched, FormikValues, FormikErrors } from 'formik';
import TextArea from 'antd/es/input/TextArea';
import * as Yup from 'yup';

export interface ICreateDocument {
  seller: string;
  buyer: string;
  price: string;
  subject: string;
  customFields: Array<{ name: string; value: string }>;
}

interface FormErrors {
  seller?: string;
  buyer?: string;
  price?: string;
  subject?: string;
  customFields?: Array<{ name?: string; value?: string }>;
}

interface IEditFileModal {
  handleOk: (value: ICreateDocument) => void;
  handleCancel: () => void;
  open: boolean;
}

export const CreateFileModal = ({ handleOk, handleCancel, open }: IEditFileModal): ReactElement => {
  const initialValues: ICreateDocument = {
    seller: '',
    buyer: '',
    price: '',
    subject: '',
    customFields: [],
  };

  const onSubmit = (values, { setSubmitting }) => {
    console.log(JSON.stringify(values, null, 2));
    setSubmitting(false);
    handleOk(values as ICreateDocument);
  };
  const validationSchema = Yup.object().shape({
    seller: Yup.string().required('Продавец обязателен'),
    buyer: Yup.string().required('Покупатель обязателен'),
    price: Yup.string().required('Цена обязательна'),
    subject: Yup.string().required('Предмет договора обязателен'),
    customFields: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required('Название обязательно'),
          value: Yup.string().required('Значение обязательно'),
        }),
      )
      .required('Кастомные поля обязательны'),
  });

  const handlerError = (
    touched: FormikTouched<FormikValues>,
    errors: FormikErrors<FormikValues>,
    filed: string,
  ) => {
    return errors[filed] && touched[filed] && <Error>Поле обязательное для заполения!</Error>;
  };
  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({
          values,
          errors,
          setSubmitting,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Modal
            open={open}
            title={<TitleWrapper>Создать документ</TitleWrapper>}
            onCancel={handleCancel}
            width={700}
            style={{ textAlign: 'center' }}
            footer={[
              <StyledButton
                onClick={() => {
                  handleSubmit();
                }}
                disabled={isSubmitting}
              >
                Подтведить
              </StyledButton>,
            ]}
          >
            <Wrapper>
              <Container>
                <Form>
                  <Text>Продавец</Text>
                  {handlerError(touched, errors, 'seller')}
                  <BaseInput
                    name="seller"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.seller}
                    placeholder="Имя продавца"
                  />
                  <Text>Покупатель</Text>
                  {handlerError(touched, errors, 'buyer')}
                  <BaseInput
                    name="buyer"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.buyer}
                    placeholder="Имя покупателя"
                  />
                  <Text>Цена</Text>
                  {handlerError(touched, errors, 'price')}
                  <BaseInput
                    name="price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price}
                    placeholder="Стоимость товара"
                  />
                  <Text>Предмет договора</Text>
                  {handlerError(touched, errors, 'subject')}
                  <TextArea
                    name="subject"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.subject}
                    placeholder="Напишите о своей предметной области"
                  />
                  <Text>Кастомные поля</Text>
                  <FieldArray name="customFields">
                    {({ push, remove }) => (
                      <>
                        {values.customFields.map((field, index) => (
                          <CustomField key={index}>
                            <StyledCustomField>
                              {errors?.customFields &&
                                errors?.customFields?.[index] &&
                                (errors.customFields?.[index] as any)?.name && (
                                  <Error>Кастомные поля обязательны</Error>
                                )}
                              <BaseInput
                                name={`customFields[${index}].name`}
                                placeholder="Название"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={field.name}
                              />
                            </StyledCustomField>
                            <StyledCustomField>
                              {errors.customFields &&
                                errors.customFields[index] &&
                                (errors.customFields?.[index] as any)?.value && (
                                  <Error>Кастомные поля обязательны</Error>
                                )}
                              <BaseInput
                                name={`customFields[${index}].value`}
                                placeholder="Значение"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={field.value}
                              />
                            </StyledCustomField>
                            <RemoveButton onClick={() => remove(index)}>Удалить</RemoveButton>
                          </CustomField>
                        ))}
                        <AddButton onClick={() => push({ name: '', value: '' })}>
                          Добавить поле
                        </AddButton>
                      </>
                    )}
                  </FieldArray>
                </Form>
              </Container>
            </Wrapper>
          </Modal>
        )}
      </Formik>
    </>
  );
};
const StyledCustomField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Error = styled.div`
  color: var(--error-color);
  line-height: 1;
`;

const Text = styled.h1`
  all: unset;
  line-height: 2;
  font-size: 1.1rem;
  text-align: left;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  column-gap: 30px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CustomField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const AddButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;

const RemoveButton = styled(Button)`
  background-color: var(--error-color);
  color: white;
`;

const StyledButton = styled(Button)`
  width: 100px;
  margin: 0 auto;
  background-color: var(--secondary-background-color);
  color: var(--primary-color);
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
