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
import { SocialProgram } from '../state/social-programs.reducer';

type Props = {
  socialPrograms: Array<SocialProgram> | null,
  loadSocialProgramsAction: Function,
  removeSocialProgramAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
  filters: Array<any>,
};

export const SocialProgramTable = (props: Props) => {
  const {
    loading,
    loadSocialProgramsAction,
    socialPrograms,
    paging,
    removeSocialProgramAction,
    isAllowed,
    filters,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadSocialProgramsAction({ per_page: paging.per_page, order });
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
      title: 'Siglas del Programa Social',
      field: 'title',
      sorting,
    },
    {
      title: 'Nombre del Programa Social',
      field: 'description',
      sorting,
      customSort,
    },
    {
      title: 'Central',
      field: 'central_str',
      sorting,
    },
    {
      title: 'Paraestatal',
      field: 'paraestatal_str',
      sorting,
    },
    {
      title: 'Obra Pública',
      field: 'obra_pub_str',
      sorting,
    },
  ];
  return (
    <>
      <Paper elevation={0}>
        <FilterChips
          filters={filters}
          loadAction={loadSocialProgramsAction} 
        />
      </Paper>
      <MaterialTable
        localization={{
          body: {
            emptyDataSourceMessage: loading ? 'Cargando registros' : 'No hay registros para mostrar'
          }
        }}
        title="Programas Sociales"
        onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
          loadSocialProgramsAction({
            ...paging,
            order: orderDirection,
            order_by: 'id',
          });
        }}
        columns={columns}
        data={socialPrograms || []}
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
                  loadSocialProgramsAction({
                    per_page,
                    page: currentPage + 1,
                    order,
                    // offset: nextPage * 1,
                  });
                }}
                onChangeRowsPerPage={(event: any) => {
                  componentProps.onChangeRowsPerPage(event);
                  loadSocialProgramsAction({
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
                    onClick={() => history.push('/social-program/create')}
                    disabled={!isAllowed('PGM', PERMISSIONS.CREATE)}
                  >
                    Agregar Programa Social
                  </Button>
                </div>
              </div>
            );
          },
        }}
        actions={[
          {
            icon: 'search',
            tooltip: 'Visualizar Programa Social',
            onClick: (event, rowData: any) =>
              history.push(`/social-program/${rowData.id}/view`),
            disabled: !isAllowed('PGM', PERMISSIONS.READ),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Programa Social',
            onClick: (event, rowData: any) =>
              history.push(`/social-program/${rowData.id}/edit`),
            disabled: !isAllowed('PGM', PERMISSIONS.UPDATE)
          },
          {
            icon: 'delete',
            tooltip: 'Eliminar Programa Social',
            onClick: (event, rowData: any) => {
              if (
                // eslint-disable-next-line no-restricted-globals
                confirm(
                  `¿Realmente quieres eliminar el Programa Social ${rowData.id}?\n Esta acción es irreversible`
                )
              ) {
                removeSocialProgramAction(rowData.id);
              }
            },
            disabled: !isAllowed('PGM', PERMISSIONS.DELETE)
          },
        ]}
        isLoading={loading}
      />
    </>
  );
};
