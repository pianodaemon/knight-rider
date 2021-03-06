/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable, { MTableToolbar } from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Paper from '@material-ui/core/Paper';
import { PERMISSIONS } from 'src/shared/constants/permissions.contants';
import { FilterChips } from 'src/shared/components/filter-chips.component';
import { ResultsReportASENL } from '../state/results-report-asenl.reducer';

type Props = {
  reports: Array<ResultsReportASENL>,
  loadResultsReportASENLAction: Function,
  removeResultsReportASENLAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
  filters: Array<any>,
};

export const ResultsReportASENLTable = (props: Props) => {
  const {
    loading,
    loadResultsReportASENLAction,
    reports,
    paging,
    removeResultsReportASENLAction,
    isAllowed,
    filters,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadResultsReportASENLAction({ per_page: paging.per_page, order });
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
      title: 'Número o Clave de Observación',
      field: 'num_observacion',
      sorting,
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
    <>
      <Paper elevation={0}>
        <FilterChips
          filters={filters}
          loadAction={loadResultsReportASENLAction} 
        />
      </Paper>
      <MaterialTable
        title="Informe de Resultados ASENL"
        onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
          loadResultsReportASENLAction({
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
          emptyRowsWhenPaging: false,
          maxBodyHeight: 500,
          rowStyle: (_data: any, index: number, _level: number) => {
            return index % 2 
              ? { backgroundColor: 'rgb(204,204,204,0.3)' }
              : {};
          }
        }}
        components={{
          Pagination: (componentProps) => {
            return (
              <TablePagination
                {...componentProps}
                count={count}
                page={page - 1 || 0}
                rowsPerPage={per_page}
                rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                onChangePage={(event, currentPage: number) => {
                  loadResultsReportASENLAction({
                    per_page,
                    page: currentPage + 1,
                    order,
                    // offset: nextPage * 1,
                  });
                }}
                onChangeRowsPerPage={(event: any) => {
                  componentProps.onChangeRowsPerPage(event);
                  loadResultsReportASENLAction({
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
                    onClick={() => history.push('/results-report-asenl/create')}
                    disabled={!isAllowed('ASER', PERMISSIONS.CREATE)}
                  >
                    Agregar Informe de Resultados ASENL
                  </Button>
                </div>
              </div>
            );
          },
        }}
        actions={[
          {
            icon: 'search',
            tooltip: 'Visualizar Informe de Resultados ASENL',
            onClick: (event, rowData: any) =>
              history.push(`/results-report-asenl/${rowData.id}/view`),
            disabled: !isAllowed('ASER', PERMISSIONS.READ),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Informe de Resultados ASENL',
            onClick: (event, rowData: any) =>
              history.push(`/results-report-asenl/${rowData.id}/edit`),
            disabled: !isAllowed('ASER', PERMISSIONS.UPDATE),
          },
          {
            icon: 'delete',
            tooltip: 'Eliminar Informe de Resultados ASENL',
            onClick: (event, rowData: any) => {
              if (
                // eslint-disable-next-line no-restricted-globals
                confirm(
                  `¿Realmente quieres eliminar la Informe de Resultados ASENL ${rowData.id}?\n Esta acción es irreversible`
                )
              ) {
                removeResultsReportASENLAction(rowData.id);
              }
            },
            disabled: !isAllowed('ASER', PERMISSIONS.DELETE),
          },
        ]}
        isLoading={loading}
      />
    </>
  );
};
