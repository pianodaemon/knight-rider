/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MaterialTable, { MTableToolbar } from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { PERMISSIONS } from 'src/shared/constants/permissions.contants';
import { ObservationASENL } from '../state/observations-asenl.reducer';

type Props = {
  observations: Array<ObservationASENL>,
  loadObservationsASENLAction: Function,
  removeObservationASENLAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
  divisionId: number,
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

export const ObservationASENLTable = (props: Props) => {
  const {
    loading,
    loadObservationsASENLAction,
    observations,
    paging,
    removeObservationASENLAction,
    isAllowed,
    divisionId,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  const classes = useStyles();
  useEffect(() => {
    if (divisionId || divisionId === 0) {
      loadObservationsASENLAction({ per_page: paging.per_page, order });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisionId]);
  const columns = [
    {
      title: 'ID',
      field: 'id',
      defaultSort: order,
      customSort,
      sorting: !sorting,
    },
    {
      title: 'Cuenta Pública',
      field: 'years',
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
    { title: 'Dependencia(s)', field: 'dependencias', sorting },
    {
      title: 'Observación',
      field: 'observacion',
      sorting,
      render: (rowData: any) => (
        <div>
          <p className={classes.truncate}>{rowData.observacion}</p>
        </div>
      ),
    },
  ];
  return (
    <MaterialTable
      localization={{
        body: {
          emptyDataSourceMessage: loading ? 'Cargando registros' : 'No hay registros para mostrar'
        }
      }}
      title="Observaciones Preliminares ASENL"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadObservationsASENLAction({
          ...paging,
          order: orderDirection,
          order_by: 'id',
        });
      }}
      columns={columns}
      data={observations || []}
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
                loadObservationsASENLAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadObservationsASENLAction({
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
                  onClick={() => history.push('/observation-asenl/create')}
                  disabled={!isAllowed('ASEP', PERMISSIONS.CREATE)}
                >
                  Agregar Observaciones Preliminares ASENL
                </Button>
              </div>
            </div>
          );
        },
      }}
      actions={[
        {
          icon: 'search',
          tooltip: 'Visualizar Observación',
          onClick: (event, rowData: any) =>
            history.push(`/observation-asenl/${rowData.id}/view`),
          disabled: !isAllowed('ASEP', PERMISSIONS.READ),
        },
        {
          icon: 'edit',
          tooltip: 'Editar Observación',
          onClick: (event, rowData: any) =>
            history.push(`/observation-asenl/${rowData.id}/edit`),
          disabled: !isAllowed('ASEP', PERMISSIONS.UPDATE)
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Observación',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Observación Preliminar ASENL ${rowData.id}?\n Esta acción es irreversible`
              )
            ) {
              removeObservationASENLAction(rowData.id);
            }
          },
          disabled: !isAllowed('ASEP', PERMISSIONS.DELETE)
        },
      ]}
      isLoading={loading}
    />
  );
};
