/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MaterialTable, { MTableToolbar } from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { ObservationASF } from '../state/observations-asf.reducer';

type Props = {
  observations: Array<ObservationASF>,
  loadObservationsASFAction: Function,
  removeObservationSFPAction: Function,
  loading: boolean,
  paging: any,
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

export const ObservationASFTable = (props: Props) => {
  const {
    loading,
    loadObservationsASFAction,
    observations,
    paging,
    removeObservationSFPAction,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  const classes = useStyles();
  useEffect(() => {
    loadObservationsASFAction({ per_page: paging.per_page, order });
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
    { title: 'Programa', field: 'programa_social_id_title', sorting },
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
      title="Observaciones ASF"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadObservationsASFAction({
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
                loadObservationsASFAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadObservationsASFAction({
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
                  onClick={() => history.push('/observation-asf/create')}
                >
                  Agregar Observación ASF
                </Button>
              </div>
            </div>
          );
        },
      }}
      actions={[
        {
          icon: 'edit',
          tooltip: 'Editar Observación',
          onClick: (event, rowData: any) =>
            history.push(`/observation-asf/${rowData.id}/edit`),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Observación',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Observación ASF ${rowData.id}?\n Esta acción es irreversible`
              )
            ) {
              // removeObservationSFPAction(rowData.id);
            }
          },
        },
      ]}
      isLoading={loading}
    />
  );
};
