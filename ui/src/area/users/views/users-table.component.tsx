/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { User } from 'src/area/users/state/users.reducer';
import MaterialTable, { MTableToolbar } from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';

type Props = {
  users: Array<User>,
  loadUsersAction: Function,
  removeUserAction: Function,
  loading: boolean,
  paging: any,
};

export const UsersTable = (props: Props) => {
  const { users, loadUsersAction, removeUserAction, loading, paging } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadUsersAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MaterialTable
      title="Usuarios"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadUsersAction({
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
          title: 'Nombre de Usuario',
          field: 'username',
          sorting,
        },
        {
          title: 'Rol en la Organización',
          field: 'orgchart_role_id_title',
          sorting,
          customSort,
        },
        {
          title: 'División',
          field: 'division_id_title',
          sorting,
        },
        { title: 'Activo', field: 'disabled', sorting },
      ]}
      data={users || []}
      options={{
        draggable,
        initialPage: 1, // @todo include this settings value in a CONSTANTS file
        paging: true,
        pageSize: per_page,
        thirdSortClick: false,
        actionsColumnIndex: 5, // @todo this shouldn't be hardcoded, calculate using columns.lenght
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
                loadUsersAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadUsersAction({
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
                  onClick={() => history.push('/user/create')}
                >
                  Agregar Usuario
                </Button>
              </div>
            </div>
          );
        },
      }}
      actions={[
        {
          icon: 'edit',
          tooltip: 'Editar Usuario',
          onClick: (event, rowData: any) =>
            history.push(`/user/${rowData.id}/edit`),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Usuario',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar el Usuario ${rowData.id}?\n Esta acción es irreversible`,
              )
            ) {
              removeUserAction(rowData.id);
            }
          },
        },
      ]}
      isLoading={loading}
    />
  );
};
