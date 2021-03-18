import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import PrescriptionList from '@containers/Screening/PrescriptionDrug/PrescriptionList';

export default function WhiteLabel({ match, fetch }) {
  const { id } = match.params;

  const { i18n } = useTranslation();

  useEffect(() => {
    fetch(id);
  }, [id, fetch]);

  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  return <PrescriptionList emptyMessage="Empty prescription." hasFilter listType="prescription" />;
}
