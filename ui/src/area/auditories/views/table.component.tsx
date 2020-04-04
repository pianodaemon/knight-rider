/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import { Observation } from 'src/area/auditories/state/observations.reducer';

type Props = {
  observations: Array<Observation>,
  mutatedObservations: Array<any>,
  loadObservationsAction: Function,
  removeObservationAction: Function,
  loading: boolean,
};

export const Table = (props: Props) => {
  const {
    loadObservationsAction,
    removeObservationAction,
    loading,
    mutatedObservations,
  } = props;
  useEffect(() => {
    loadObservationsAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const options = { initialPage: 3, paging: true, pageSize: 12 };
  return (
    <MaterialTable
      title="Observaciones"
      columns={[
        { title: 'ID', field: 'id', sorting: true, defaultSort: 'desc' },
        { title: 'Auditoría no.', field: 'audit_id_title' },
        { title: 'Tipo de Observación', field: 'observation_type_id_title' },
        {
          title: 'Programa',
          field: 'social_program_id_title',
          // type: 'numeric',
        },
      ]}
      data={mutatedObservations || []}
      actions={[
        {
          icon: 'edit',
          tooltip: 'Editar Observación',
          // eslint-disable-next-line no-alert
          onClick: (event, rowData) => alert(`Edit!`),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Observación',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              // eslint-disable-next-line no-alert
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Observación ${rowData.id}?\n Esta acción es irreversible`,
              )
            ) {
              removeObservationAction(rowData.id);
            }
          },
        },
      ]}
      isLoading={loading}
    />
  );
};
