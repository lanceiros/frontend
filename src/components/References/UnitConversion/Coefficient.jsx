import 'styled-components/macro';
import React, { useState } from 'react';

import Button from '@components/Button';
import Icon from '@components/Icon';
import { InputNumber } from '@components/Inputs';

export default function Escore({ idMeasureUnit, fator, saveUnitCoefficient, updateDrugData }) {
  const [edit, setEdit] = useState(false);
  const [coefficient, setCoefficient] = useState(fator || 0);

  const handleClick = event => {
    event.preventDefault();
    setEdit(true);
  };

  const handleSave = () => {
    setEdit(false);
    saveUnitCoefficient(idMeasureUnit, {
      fator: coefficient
    });
    updateDrugData({ touched: true });
  };

  return edit ? (
    <>
      <InputNumber
        style={{
          marginRight: 8,
          width: 80
        }}
        defaultValue={coefficient}
        onChange={setCoefficient}
      />
      <Button type="primary gtm-bt-save-factor" onClick={handleSave}>
        <Icon type="check" />
      </Button>
    </>
  ) : (
    <>
      <span css="margin-right: 10px;">{fator}</span>
      {/*eslint-disable-next-line*/}
      <a href="#" css="color: inherit;" onClick={handleClick}>
        <Icon type="edit" />
      </a>
    </>
  );
}
