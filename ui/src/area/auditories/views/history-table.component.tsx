/* eslint-disable no-alert */
import React from 'react';
import MaterialTable from 'material-table';
import Icon from '@material-ui/core/Icon';
// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

type Props = {
  history: Array<any>,
};

export const HistoryTable = (props: Props) => {
  const { history } = props;
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  const paddingCell = '10px';
  return (
    <MaterialTable
      style={{ marginTop: '20px', display: 'grid' }}
      title={
        <span
          style={{
            color: 'rgba(0, 0, 0, 0.87)',
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.6,
            letterSpacing: '0.0075em',
          }}
        >
          <Icon
            style={{
              verticalAlign: '-5px',
              margin: '0 6px 0 0',
              fontSize: '1.3rem',
            }}
          >
            history
          </Icon>
          Historial de Cambios
        </span>
      }
      data={history || []}
      columns={[
        {
          title: 'Fecha',
          field: 'date',
          sorting,
          customSort,
          cellStyle: { padding: paddingCell },
        },
        {
          title: 'Comentarios',
          field: 'comments',
          sorting,
          cellStyle: { padding: paddingCell },
        },
        {
          title: 'Solventado',
          field: 'solved',
          sorting,
          cellStyle: { padding: paddingCell },
        },
        {
          title: 'Proyectado',
          field: 'projected',
          cellStyle: { padding: paddingCell },
        },
      ]}
      options={{
        draggable,
        thirdSortClick: false,
        search: false,
        paging: false,
        maxBodyHeight: '180px',
        headerStyle: {
          fontWeight: 'bold',
          color: '#128aba',
          padding: '3px 10px',
        },
        rowStyle: (rowData) => ({
          backgroundColor:
            rowData.tableData.id % 2 === 0
              ? 'rgba(0,0,0,0)'
              : 'rgba(200,200,200,0.1)',
          color: '#888',
        }),
      }}
    />
  );
};
