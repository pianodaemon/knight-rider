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
import { Action } from '../state/actions.reducer';

type Props = {
  actions: Array<Action> | null,
  loadActionsAction: Function,
  removeActionAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
  filters: Array<any>,
};

export const ActionTable = (props: Props) => {
  const {
    loading,
    loadActionsAction,
    actions,
    paging,
    removeActionAction,
    isAllowed,
    filters,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadActionsAction({ per_page: paging.per_page, order });
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
      title: 'Órgano fiscalizador Acción',
      field: 'org_fiscal_id_title',
      sorting,
    },
    {
      title: 'Siglas de la acción',
      field: 'title',
      sorting,
      customSort,
    },
    {
      title: 'Nombre de la acción',
      field: 'description',
      sorting,
    },
  ];
  return (
    <>
      <Paper elevation={0}>
        <FilterChips
          filters={filters}
          loadAction={loadActionsAction}
        />
      </Paper>
      <MaterialTable
        localization={{
          body: {
            emptyDataSourceMessage: loading ? 'Cargando registros' : 'No hay registros para mostrar'
          }
        }}
        title="Acción (ASF y ASENL)"
        onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
          loadActionsAction({
            ...paging,
            order: orderDirection,
            order_by: 'id',
          });
        }}
        columns={columns}
        data={actions || []}
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
                  loadActionsAction({
                    per_page,
                    page: currentPage + 1,
                    order,
                    // offset: nextPage * 1,
                  });
                }}
                onChangeRowsPerPage={(event: any) => {
                  componentProps.onChangeRowsPerPage(event);
                  loadActionsAction({
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
                    onClick={() => history.push('/acciones/create')}
                    disabled={!isAllowed('CLSF', PERMISSIONS.CREATE)}
                  >
                    Agregar Acción (ASF y ASENL)
                  </Button>
                </div>
              </div>
            );
          },
        }}
        actions={[
          {
            icon: 'search',
            tooltip: 'Visualizar Acción (ASF y ASENL)',
            onClick: (event, rowData: any) =>
              history.push(`/acciones/${rowData.org_fiscal_id}/${rowData.id}/view`),
            disabled: !isAllowed('CLSF', PERMISSIONS.READ),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Acción (ASF y ASENL)',
            onClick: (event, rowData: any) =>
              history.push(`/acciones/${rowData.org_fiscal_id}/${rowData.id}/edit`),
            disabled: !isAllowed('CLSF', PERMISSIONS.UPDATE)
          },
          {
            icon: 'delete',
            tooltip: 'Eliminar Acción (ASF y ASENL)',
            onClick: (event, rowData: any) => {
              if (
                // eslint-disable-next-line no-restricted-globals
                confirm(
                  `¿Realmente quieres eliminar la Acción (ASF y ASENL) ${rowData.id}?\n Esta acción es irreversible`
                )
              ) {
                const { org_fiscal_id, id } = rowData;
                removeActionAction({ org_fiscal_id, id });
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
