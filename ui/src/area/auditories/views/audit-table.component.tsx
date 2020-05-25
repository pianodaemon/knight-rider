/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable, { MTableToolbar } from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { Audit } from '../state/audits.reducer';

type Props = {
  audits: Array<Audit>,
  loadAuditsAction: Function,
  removeAuditAction: Function,
  loading: boolean,
  paging: any,
};

export const AuditTable = (props: Props) => {
  const {
    audits,
    loadAuditsAction,
    removeAuditAction,
    loading,
    paging,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadAuditsAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MaterialTable
      title="Auditorías"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadAuditsAction({
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
          title: 'Clave de Auditoría',
          field: 'title',
          sorting,
        },
        {
          title: 'Dependencia',
          field: 'dependency_id_title',
          sorting,
          customSort,
        },
        {
          title: 'Año',
          field: 'year',
          sorting,
        },
      ]}
      data={audits || []}
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
                loadAuditsAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadAuditsAction({
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
                  onClick={() => history.push('/audit/create')}
                >
                  Agregar Auditoría
                </Button>
              </div>
            </div>
          );
        },
      }}
      actions={[
        {
          icon: 'edit',
          tooltip: 'Editar Auditoría',
          onClick: (event, rowData: any) =>
            history.push(`/audit/${rowData.id}/edit`),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Auditoría',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Auditoría ${rowData.id}?\n Esta acción es irreversible`,
              )
            ) {
              removeAuditAction(rowData.id);
            }
          },
        },
      ]}
      isLoading={loading}
    />
  );
};
