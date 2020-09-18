/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Observation } from 'src/area/auditories/state/observations.reducer';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { PERMISSIONS } from 'src/shared/constants/permissions.contants';

type Props = {
  observations: Array<Observation>,
  loadObservationsSFPAction: Function,
  removeObservationSFPAction: Function,
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

export const ObservationSFPTable = (props: Props) => {
  const {
    loading,
    loadObservationsSFPAction,
    observations,
    paging,
    removeObservationSFPAction,
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
      loadObservationsSFPAction({ per_page: paging.per_page, order });
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
      title: 'Dirección',
      field: 'direccion_id_title',
      sorting,
    },
    {
      title: 'Cuenta Pública',
      field: 'anio_auditoria',
      sorting,
    },
    {
      title: 'Número o Clave de Observación',
      field: 'clave_observacion',
      sorting,
      customSort,
    },
    {
      title: 'Auditoría',
      field: 'auditoria_id_title',
      sorting,
      customSort,
    },
    {
      title: 'Dependencia(s)',
      field: 'dependencies',
      sorting,
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
      localization={{
        body: {
          emptyDataSourceMessage: loading ? 'Cargando registros' : 'No hay registros para mostrar'
        }
      }}
      title="Observaciones de Resultados SFP"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadObservationsSFPAction({
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
                loadObservationsSFPAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadObservationsSFPAction({
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
                  onClick={() => history.push('/observation-sfp/create')}
                  disabled={!isAllowed('SFPR', PERMISSIONS.CREATE)}
                >
                  Agregar Observación SFP
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
            history.push(`/observation-sfp/${rowData.id}/view`),
          disabled: !isAllowed('SFPR', PERMISSIONS.READ),
        },
        {
          icon: 'edit',
          tooltip: 'Editar Observación',
          onClick: (event, rowData: any) =>
            history.push(`/observation-sfp/${rowData.id}/edit`),
          disabled: !isAllowed('SFPR', PERMISSIONS.UPDATE),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Observación',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Observación SFP ${rowData.id}?\n Esta acción es irreversible`
              )
            ) {
              removeObservationSFPAction(rowData.id);
            }
          },
          disabled: !isAllowed('SFPR', PERMISSIONS.DELETE),
        },
      ]}
      isLoading={loading}
    />
  );
};
