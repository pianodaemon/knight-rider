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
import { Dependency } from '../state/dependencies.reducer';

type Props = {
  dependencies: Array<Dependency>,
  loadDependenciesAction: Function,
  removeDependencyAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
  divisionId: number,
  filters: Array<any>,
};

export const DependencyTable = (props: Props) => {
  const {
    loading,
    loadDependenciesAction,
    dependencies,
    paging,
    removeDependencyAction,
    isAllowed,
    divisionId,
    filters,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    if (divisionId || divisionId === 0) {
      loadDependenciesAction({ per_page: paging.per_page, order });
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
      title: 'Título o siglas de la Dependencia',
      field: 'title',
      sorting,
    },
    {
      title: 'Descripción',
      field: 'description',
      sorting,
      customSort,
    },
    {
      title: 'Clasificación',
      field: 'clasif_title',
      sorting,
    },
  ];
  console.log(dependencies);
  return (
    <>
      <Paper elevation={0}>
        <FilterChips
          filters={filters}
          loadAction={loadDependenciesAction} 
        />
      </Paper>
      <MaterialTable
        localization={{
          body: {
            emptyDataSourceMessage: loading ? 'Cargando registros' : 'No hay registros para mostrar'
          }
        }}
        title="Dependencias"
        onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
          loadDependenciesAction({
            ...paging,
            order: orderDirection,
            order_by: 'id',
          });
        }}
        columns={columns}
        data={dependencies || []}
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
                  loadDependenciesAction({
                    per_page,
                    page: currentPage + 1,
                    order,
                    // offset: nextPage * 1,
                  });
                }}
                onChangeRowsPerPage={(event: any) => {
                  componentProps.onChangeRowsPerPage(event);
                  loadDependenciesAction({
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
                    onClick={() => history.push('/dependency/create')}
                    disabled={!isAllowed('DEP', PERMISSIONS.CREATE)}
                  >
                    Agregar Dependencia
                  </Button>
                </div>
              </div>
            );
          },
        }}
        actions={[
          {
            icon: 'search',
            tooltip: 'Visualizar Dependencia',
            onClick: (event, rowData: any) =>
              history.push(`/dependency/${rowData.id}/view`),
            disabled: !isAllowed('DEP', PERMISSIONS.READ),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Dependencia',
            onClick: (event, rowData: any) =>
              history.push(`/dependency/${rowData.id}/edit`),
            disabled: !isAllowed('DEP', PERMISSIONS.UPDATE)
          },
          {
            icon: 'delete',
            tooltip: 'Eliminar Dependencia',
            onClick: (event, rowData: any) => {
              if (
                // eslint-disable-next-line no-restricted-globals
                confirm(
                  `¿Realmente quieres eliminar la Dependencia ${rowData.id}?\n Esta acción es irreversible`
                )
              ) {
                removeDependencyAction(rowData.id);
              }
            },
            disabled: !isAllowed('DEP', PERMISSIONS.DELETE)
          },
        ]}
        isLoading={loading}
      />
    </>
  );
};
