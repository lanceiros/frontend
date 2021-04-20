import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

import Alert from '@components/Alert';
import { Row } from '@components/Grid';
import notification from '@components/notification';
import Heading from '@components/Heading';
import DefaultModal from '@components/Modal';

import Base from './Base';
import { FormContainer } from './Patient.style';

const errorMessage = {
  message: 'Ops! Algo de errado aconteceu.',
  description:
    'Aconteceu algo que nos impediu de salvar os dados deste medicamento. Por favor, tente novamente.'
};

const saveMessage = {
  message: 'Uhu! Dados do paciente salvo com sucesso! :)'
};
const validationSchema = Yup.object().shape({
  weight: Yup.number().nullable(),
  height: Yup.number().nullable()
});

export default function Patient({
  saveStatus,
  savePatient,
  afterSavePatient,
  idPrescription,
  admissionNumber,
  weight,
  height,
  observation,
  clinicalNotes,
  notesInfo,
  notesInfoDate,
  ...props
}) {
  const { isSaving, success, error } = saveStatus;

  const initialValues = {
    idPrescription,
    admissionNumber,
    weight,
    height,
    observation
  };

  useEffect(() => {
    if (success) {
      notification.success(saveMessage);
      afterSavePatient();
    }

    if (error) {
      notification.error(errorMessage);
    }
  }, [success, error, afterSavePatient]);

  return (
    <Formik
      enableReinitialize
      onSubmit={savePatient}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => (
        <DefaultModal
          centered
          destroyOnClose
          {...props}
          onOk={handleSubmit}
          confirmLoading={isSaving}
          okButtonProps={{
            disabled: isSaving
          }}
          cancelButtonProps={{
            disabled: isSaving,
            className: 'gtm-bt-cancel-edit-patient'
          }}
        >
          <header>
            <Heading margin="0 0 11px">Dados do paciente</Heading>
          </header>
          {clinicalNotes != null && notesInfo && (
            <Alert
              message={`NoHarm Care (${moment(notesInfoDate).format('DD/MM/YYYY hh:mm')})`}
              description={notesInfo}
              type="info"
              showIcon
            />
          )}
          <form onSubmit={handleSubmit}>
            <FormContainer>
              <Row type="flex" gutter={[16, 24]}>
                <Base />
              </Row>
            </FormContainer>
          </form>
        </DefaultModal>
      )}
    </Formik>
  );
}

Patient.defaultProps = {
  afterSavePatient: () => {},
  initialValues: {
    weight: '',
    height: ''
  }
};
