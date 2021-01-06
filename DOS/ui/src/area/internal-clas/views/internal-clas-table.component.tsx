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
import { InternalClas } from '../state/internal-clas.reducer';

type Props = {
  internalClasses: Array<InternalClas> | null,
  loadInternalClasAction: Function,
  removeInternalClasAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
  filters: Array<any>,
};

export const InternalClasTable = (props: Props) => {
  const {
    loading,
    loadInternalClasAction,
    internalClasses,
    paging,
    removeInternalClasAction,
    isAllowed,
    filters,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadInternalClasAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = [
    {
      title: 'ID',
      field: 'sorting_val',
      defaultSort: order,
      customSort,
      sorting: !sorting,
    },
    {
      title: 'Órgano fiscalizador para la Clasificación interna',
      field: 'org_fiscal_id_title',
      sorting,
    },
    {
      title: 'Dirección para la Clasificación interna',
      field: 'direccion_id_title',
      sorting,
      customSort,
    },
    {
      title: 'Título o siglas de la Clasificación interna',
      field: 'title',
      sorting,
    },
  ];
  console.log(internalClasses);
  return (
    <>
      <Paper elevation={0}>
        <FilterChips
          filters={filters}
          loadAction={loadInternalClasAction} 
        />
      </Paper>
      <MaterialTable
        localization={{
          body: {
            emptyDataSourceMessage: loading ? 'Cargando registros' : 'No hay registros para mostrar'
          }
        }}
        title="Clasificación Interna CyTG"
        onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
          loadInternalClasAction({
            ...paging,
            order: orderDirection,
            order_by: 'id',
          });
        }}
        columns={columns}
        data={internalClasses || []}
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
                  loadInternalClasAction({
                    per_page,
                    page: currentPage + 1,
                    order,
                    // offset: nextPage * 1,
                  });
                }}
                onChangeRowsPerPage={(event: any) => {
                  componentProps.onChangeRowsPerPage(event);
                  loadInternalClasAction({
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
                    onClick={() => history.push('/internal-clas/create')}
                    disabled={!isAllowed('CLSF', PERMISSIONS.CREATE)}
                  >
                    Agregar Clasificación Interna de CyTG
                  </Button>
                </div>
              </div>
            );
          },
        }}
        actions={[
          {
            icon: 'search',
            tooltip: 'Visualizar Clasificación Interna de CyTG',
            onClick: (event, rowData: any) =>
              history.push(`/internal-clas/${rowData.org_fiscal_id}/${rowData.direccion_id}/${rowData.sorting_val}/view`),
            disabled: !isAllowed('CLSF', PERMISSIONS.READ),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Clasificación Interna de CyTG',
            onClick: (event, rowData: any) =>
              history.push(`/internal-clas/${rowData.org_fiscal_id}/${rowData.direccion_id}/${rowData.sorting_val}/edit`),
            disabled: !isAllowed('CLSF', PERMISSIONS.UPDATE)
          },
          {
            icon: 'delete',
            tooltip: 'Eliminar Clasificación Interna de CyTG',
            onClick: (event, rowData: any) => {
              if (
                // eslint-disable-next-line no-restricted-globals
                confirm(
                  `¿Realmente quieres eliminar la Clasificación Interna de CyTG ${rowData.sorting_val}?\n Esta acción es irreversible`
                )
              ) {
                const { org_fiscal_id, direccion_id, sorting_val } = rowData;
                const id = sorting_val;
                removeInternalClasAction({ org_fiscal_id, direccion_id, id });
              }
            },
            disabled: !isAllowed('CLSF', PERMISSIONS.DELETE)
          },
        ]}
        isLoading={loading}
      />
    </>
  );
};
