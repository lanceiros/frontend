import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash.isempty';

import DefaultModal from '@components/Modal';
import ClinicalNotes from '@containers/Screening/ClinicalNotes';

export default function Modal({
  fetchClinicalNotes,
  clinicalNotesList,
  admissionNumber,
  visible,
  setVisibility
}) {
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      if (isEmpty(Object.keys(clinicalNotesList)) && admissionNumber) {
        fetchClinicalNotes(admissionNumber);
      }
    }
  }, [visible, admissionNumber]); // eslint-disable-line

  return (
    <DefaultModal
      title={t('tableHeader.clinicalNotes')}
      destroyOnClose
      visible={visible}
      onCancel={() => setVisibility(false)}
      width="90%"
      footer={null}
      style={{ top: '10px', height: '100vh' }}
      bodyStyle={{ padding: 0 }}
    >
      <ClinicalNotes />
    </DefaultModal>
  );
}
