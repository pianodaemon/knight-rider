/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Observation } from 'src/area/auditories/state/observations.reducer';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';

type Props = {
  observations: Array<Observation>,
  mutatedObservations: Array<any>,
  loadObservationsAction: Function,
  removeObservationAction: Function,
  loading: boolean,
  paging: any,
};

export const Table = (props: Props) => {
  const {
    loadObservationsAction,
    removeObservationAction,
    loading,
    mutatedObservations,
    paging,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadObservationsAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MaterialTable
      title="Observaciones"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadObservationsAction({
          ...paging,
          order: orderDirection,
          order_by: 'id',
        });
      }}
      columns={[
        {
          title: 'ID',
          field: 'id',
          defaultSort: order,
          customSort,
          sorting: !sorting,
        },
        {
          title: 'Auditoría no.',
          field: 'audit_id_title',
          sorting,
        },
        {
          title: 'Tipo de Observación',
          field: 'observation_type_id_title',
          sorting,
          customSort,
        },
        {
          title: 'Programa',
          field: 'social_program_id_title',
          sorting,
        },
        { title: 'Descripción', field: 'title', sorting },
      ]}
      data={mutatedObservations || []}
      options={{
        draggable,
        initialPage: 1, // @todo include this settings value in a CONSTANTS file
        paging: true,
        pageSize: per_page,
        thirdSortClick: false,
        actionsColumnIndex: 5, // @todo this shouldn't be hardcoded, calculate using columns.lenght
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
                loadObservationsAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadObservationsAction({
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
                  onClick={() => history.push('/observation/create')}
                >
                  Agregar Observación
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
            history.push(`/observation/${rowData.id}/edit`),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Observación',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Observación ${rowData.id}?\n Esta acción es irreversible`
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
