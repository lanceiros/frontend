import React, { useEffect } from 'react';

import PrescriptionList from '@containers/Screening/PrescriptionDrug/PrescriptionList';

export default function WhiteLabel({ match, fetch }) {
  const { id } = match.params;

  useEffect(() => {
    fetch(id);
  }, [id, fetch]);

  return (
    <PrescriptionList
      emptyMessage="Nenhum medicamento encontrado."
      hasFilter
      listType="prescription"
    />
  );
}
