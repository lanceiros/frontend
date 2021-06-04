import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import styled from 'styled-components/macro';

import Empty from '@components/Empty';
import LoadBox from '@components/LoadBox';
import notification from '@components/notification';
import { ExpandableTable } from '@components/Table';
import interventionColumns, {
  expandedInterventionRowRender
} from '@components/Screening/Intervention/columns';
import FormIntervention from '@containers/Forms/Intervention';
import Tag from '@components/Tag';
import BackTop from '@components/BackTop';
import { Select } from '@components/Inputs';
import { uniqBy } from '@utils/lodash';
import { toDataSource } from '@utils';

const errorMessage = {
  message: 'Ops! Algo de errado aconteceu.',
  description: 'Aconteceu algo que nos impediu de lhe mostrar os dados, por favor, tente novamente.'
};

const TableInfo = styled.div`
  background: #eff1f4;
  padding: 10px;

  .filter-field {
    display: inline-block;
    margin-right: 10px;

    label {
      display: block;
      margin-bottom: 2px;
      color: #2e3c5a;
    }
  }
`;

export default function InterventionList({
  fetchList,
  checkData,
  checkIntervention,
  select,
  updateList,
  futurePrescription,
  fetchFuturePrescription,
  isFetching,
  list,
  error
}) {
  const [visible, setVisibility] = useState(false);
  const [filter, setFilter] = useState({
    status: null,
    responsible: []
  });
  const onShowModal = data => {
    select({
      dosage: `${data.dose} ${data.measureUnit.value}`,
      frequency: data.frequency,
      drug: data.drugName,
      route: data.route,
      intervention: data
    });
    setVisibility(true);
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // show message if has error
  useEffect(() => {
    if (!isEmpty(error)) {
      notification.error(errorMessage);
    }
  }, [error]);

  const afterSaveIntervention = item => {
    updateList(item);
  };

  if (isFetching) {
    return <LoadBox />;
  }

  const getResponsibleList = () => {
    if (!list) return [];

    return uniqBy(list, 'user')
      .map(i => i.user)
      .sort();
  };

  const handleResponsibleChange = responsible => {
    setFilter({ ...filter, responsible });
  };

  const handleStatusChange = status => {
    setFilter({ ...filter, status: !status || status === 'all' ? null : [status] });
  };

  const dsInterventions = toDataSource(list, null, {
    check: checkData,
    saveInterventionStatus: checkIntervention,
    onShowModal,
    futurePrescription,
    fetchFuturePrescription
  });
  const listCount = {
    all: list ? list.length : 0,
    pending: 0,
    accepted: 0,
    notAccepted: 0,
    notAcceptedJustified: 0,
    notApplicable: 0
  };

  if (list) {
    list.forEach(item => {
      switch (item.status) {
        case 'a':
          listCount.accepted += 1;
          break;
        case 'n':
          listCount.notAccepted += 1;
          break;
        case 'j':
          listCount.notAcceptedJustified += 1;
          break;
        case 'x':
          listCount.notApplicable += 1;
          break;
        default:
          listCount.pending += 1;
      }
    });
  }

  return (
    <>
      <TableInfo style={{ marginBottom: 15 }}>
        <div className="filter-field">
          <label>Responsável</label>
          <Select
            onChange={handleResponsibleChange}
            placeholder="Filtrar por responsável"
            allowClear
            style={{ minWidth: '300px' }}
            mode="multiple"
            optionFilterProp="children"
          >
            {getResponsibleList().map((p, i) => (
              <Select.Option value={p} key={i}>
                {p}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="filter-field">
          <label>Situação</label>
          <Select
            onChange={handleStatusChange}
            placeholder="Filtrar por situação"
            allowClear
            style={{ minWidth: '300px' }}
            optionFilterProp="children"
            defaultValue="all"
          >
            <Select.Option value="s" key="s">
              Pendentes <Tag color="orange">{listCount.pending}</Tag>
            </Select.Option>
            <Select.Option value="a" key="a">
              Aceitas <Tag color="green">{listCount.accepted}</Tag>
            </Select.Option>
            <Select.Option value="n" key="n">
              Não aceitas <Tag color="red">{listCount.notAccepted}</Tag>
            </Select.Option>
            <Select.Option value="j" key="j">
              Não aceitas (Justificadas) <Tag color="red">{listCount.notAcceptedJustified}</Tag>
            </Select.Option>
            <Select.Option value="x" key="x">
              Não se aplica <Tag>{listCount.notApplicable}</Tag>
            </Select.Option>
            <Select.Option value="all" key="all">
              Todas <Tag>{listCount.all}</Tag>
            </Select.Option>
          </Select>
        </div>
      </TableInfo>

      <BackTop />

      <ExpandableTable
        columns={interventionColumns(filter, true)}
        pagination={{
          pageSize: 50,
          position: 'both'
        }}
        loading={isFetching}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Nenhuma intervenção encontrada."
            />
          )
        }}
        dataSource={!isFetching ? dsInterventions : []}
        expandedRowRender={expandedInterventionRowRender}
      />
      <FormIntervention
        visible={visible}
        setVisibility={setVisibility}
        afterSaveIntervention={afterSaveIntervention}
        disableUndoIntervention
      />
    </>
  );
}
