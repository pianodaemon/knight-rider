/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MaterialTable, { MTableToolbar } from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { ResultsReport } from '../state/results-report.reducer';
import { PERMISSIONS } from 'src/shared/constants/permissions.contants';

type Props = {
  reports: Array<ResultsReport>,
  loadResultsReportAction: Function,
  removeResultsReportAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
};

const useStyles = makeStyles(() =>
  createStyles({
    truncate: {
      overflow: 'hidden',
      paddingRight: '1em',
      maxHeight: '7.5em',
      maxWidth: '30em',
      textOverflow: 'ellipsis',
      width: '30em',
    },
  })
);

export const ResultsReportTable = (props: Props) => {
  const {
    loading,
    loadResultsReportAction,
    reports,
    paging,
    removeResultsReportAction,
    isAllowed,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  const classes = useStyles();
  useEffect(() => {
    loadResultsReportAction({ per_page: paging.per_page, order });
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
      title: 'Cuenta Pública',
      field: 'anio_auditoria',
      sorting,
    },
    {
      title: 'Número o Clave de Observación',
      field: 'num_observacion',
      sorting,
    },
    {
      title: 'Auditoría',
      field: 'auditoria_id_title',
      sorting,
      customSort,
    },
    { title: 'Dependencia', field: 'dependencies', sorting },
    { title: 'Programa', field: 'programa_social_id_title', sorting },
    {
      title: 'Observación',
      field: 'observacion_ir',
      sorting,
      render: (rowData: any) => (
        <div>
          <p className={classes.truncate}>{rowData.observacion_ir}</p>
        </div>
      ),
    },
  ];
  return (
    <MaterialTable
      title="Observaciones de Resultados ASF"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadResultsReportAction({
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
                loadResultsReportAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadResultsReportAction({
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
                  onClick={() => history.push('/results-report/create')}
                  disabled={!isAllowed('ASFR', PERMISSIONS.CREATE)}
                >
                  Agregar Observación de Resultados ASF
                </Button>
              </div>
            </div>
          );
        },
      }}
      actions={[
        {
          icon: 'search',
          tooltip: 'Visualizar Observación de Resultados ASF',
          onClick: (event, rowData: any) =>
            history.push(`/results-report/${rowData.id}/view`),
          disabled: !isAllowed('ASFR', PERMISSIONS.READ),
        },
        {
          icon: 'edit',
          tooltip: 'Editar Observación de Resultados ASF',
          onClick: (event, rowData: any) =>
            history.push(`/results-report/${rowData.id}/edit`),
          disabled: !isAllowed('ASFR', PERMISSIONS.UPDATE),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Observación de Resultados ASF',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Observación de Resultados ASF ${rowData.id}?\n Esta acción es irreversible`
              )
            ) {
              removeResultsReportAction(rowData.id);
            }
          },
          disabled: !isAllowed('ASFR', PERMISSIONS.DELETE),
        },
      ]}
      isLoading={loading}
    />
  );
};
