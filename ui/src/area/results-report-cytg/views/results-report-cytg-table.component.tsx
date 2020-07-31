/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable, { MTableToolbar } from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { ResultsReportCYTG } from '../state/results-report-cytg.reducer';

type Props = {
  reports: Array<ResultsReportCYTG>,
  loadResultsReportCYTGAction: Function,
  removeResultsReportCYTGAction: Function,
  loading: boolean,
  paging: any,
};

export const ResultsReportCYTGTable = (props: Props) => {
  const {
    loading,
    loadResultsReportCYTGAction,
    reports,
    paging,
    removeResultsReportCYTGAction,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadResultsReportCYTGAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = [
    {
      title: 'ID',
      field: 'id',
      defaultSort: order,
      customSort,
      sorting: !sorting,
    },
    {
      title: 'Dirección',
      field: 'direccion_id_title',
      sorting,
    },
    {
      title: 'Auditoría',
      field: 'auditoria_id_title',
      sorting,
      customSort,
    },
    { title: 'Dependencia', field: 'dependencies', sorting },
  ];
  return (
    <MaterialTable
      title="Informe de Resultados CYTG"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadResultsReportCYTGAction({
          ...paging,
          order: orderDirection,
          order_by: 'id',
        });
      }}
      columns={columns}
      data={reports || []}
      options={{
        draggable,
        initialPage: 1, // @todo include this settings value in a CONSTANTS file
        paging: true,
        pageSize: per_page,
        thirdSortClick: false,
        actionsColumnIndex: columns.length,
        toolbar: true,
        toolbarButtonAlignment: 'right',
      }}
      components={{
        Pagination: (componentProps) => {
          return (
            <TablePagination
              {...componentProps}
              count={count}
              page={page - 1 || 0}
              rowsPerPage={per_page}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              onChangePage={(event, currentPage: number) => {
                loadResultsReportCYTGAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadResultsReportCYTGAction({
                  per_page: event.target.value,
                });
              }}
            />
          );
        },
        Toolbar: (componentProps) => {
          return (
            <div>
              <MTableToolbar {...componentProps} />
              <div style={{ padding: '0px 10px', textAlign: 'right' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PostAddIcon />}
                  size="medium"
                  onClick={() => history.push('/results-report-cytg/create')}
                >
                  Agregar Informe de Resultados CYTG
                </Button>
              </div>
            </div>
          );
        },
      }}
      actions={[
        {
          icon: 'search',
          tooltip: 'Visualizar Informe de Resultados CYTG',
          onClick: (event, rowData: any) =>
            history.push(`/results-report-cytg/${rowData.id}/view`),
        },
        {
          icon: 'edit',
          tooltip: 'Editar Informe de Resultados CYTG',
          onClick: (event, rowData: any) =>
            history.push(`/results-report-cytg/${rowData.id}/edit`),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Informe de Resultados CYTG',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Informe de Resultados CYTG ${rowData.id}?\n Esta acción es irreversible`
              )
            ) {
              removeResultsReportCYTGAction(rowData.id);
            }
          },
        },
      ]}
      isLoading={loading}
    />
  );
};
