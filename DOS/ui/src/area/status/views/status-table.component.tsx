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
import { Status } from '../state/status.reducer';

type Props = {
  statuses: Array<Status> | null,
  loadStatusesAction: Function,
  removeStatusAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
  filters: Array<any>,
};

export const StatusTable = (props: Props) => {
  const {
    loading,
    loadStatusesAction,
    statuses,
    paging,
    removeStatusAction,
    isAllowed,
    filters,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadStatusesAction({ per_page: paging.per_page, order });
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
      title: 'Órgano fiscalizador',
      field: 'org_fiscal_id_title',
      sorting,
    },
    {
      title: 'Título del estatus',
      field: 'title',
      sorting,
      customSort,
    },
    {
      title: 'Preliminar o Informe de Resultados {pre | ires}',
      field: 'pre_ires',
      sorting,
    },
  ];
  return (
    <>
      <Paper elevation={0}>
        <FilterChips
          filters={filters}
          loadAction={loadStatusesAction}
        />
      </Paper>
      <MaterialTable
        localization={{
          body: {
            emptyDataSourceMessage: loading ? 'Cargando registros' : 'No hay registros para mostrar'
          }
        }}
        title="Estatus"
        onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
          loadStatusesAction({
            ...paging,
            order: orderDirection,
            order_by: 'id',
          });
        }}
        columns={columns}
        data={statuses || []}
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
                  loadStatusesAction({
                    per_page,
                    page: currentPage + 1,
                    order,
                    // offset: nextPage * 1,
                  });
                }}
                onChangeRowsPerPage={(event: any) => {
                  componentProps.onChangeRowsPerPage(event);
                  loadStatusesAction({
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
                    onClick={() => history.push('/estatus/create')}
                    disabled={!isAllowed('EST', PERMISSIONS.CREATE)}
                  >
                    Agregar Estatus (Pre e IRes)
                  </Button>
                </div>
              </div>
            );
          },
        }}
        actions={[
          {
            icon: 'search',
            tooltip: 'Visualizar Estatus (Pre e IRes)',
            onClick: (event, rowData: any) =>
              history.push(`/estatus/${rowData.org_fiscal_id}/${rowData.pre_ires}/${rowData.id}/view`),
            disabled: !isAllowed('EST', PERMISSIONS.READ),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Estatus (Pre e IRes)',
            onClick: (event, rowData: any) =>
              history.push(`/estatus/${rowData.org_fiscal_id}/${rowData.pre_ires}/${rowData.id}/edit`),
            disabled: !isAllowed('EST', PERMISSIONS.UPDATE)
          },
          {
            icon: 'delete',
            tooltip: 'Eliminar Estatus (Pre e IRes)',
            onClick: (event, rowData: any) => {
              if (
                // eslint-disable-next-line no-restricted-globals
                confirm(
                  `¿Realmente quieres eliminar el Estatus (Pre e IRes) ${rowData.id}?\n Esta acción es irreversible`
                )
              ) {
                const { org_fiscal_id, pre_ires, id } = rowData;
                removeStatusAction({ org_fiscal_id, pre_ires, id });
              }
            },
            disabled: !isAllowed('ACC', PERMISSIONS.DELETE)
          },
        ]}
        isLoading={loading}
      />
    </>
  );
};
