/* eslint-disable no-alert */
import React from 'react';
import MaterialTable from 'material-table';
// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

type Props = {
  history: Array<any>,
};

export const HistoryTable = (props: Props) => {
  const { history } = props;
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  return (
    <MaterialTable
      style={{ marginTop: '20px', display: 'grid' }}
      title="Historial de Cambios"
      data={history || []}
      columns={[
        {
          title: 'Fecha',
          field: 'date',
          sorting,
          customSort,
        },
        {
          title: 'Comentarios',
          field: 'comments',
          sorting,
        },
        {
          title: 'Solventado',
          field: 'solved',
          sorting,
        },
        {
          title: 'Proyectado',
          field: 'projected',
        },
      ]}
      options={{
        draggable,
        thirdSortClick: false,
        search: false,
        paging: false,
      }}
    />
  );
};
