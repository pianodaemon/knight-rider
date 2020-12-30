import { connect } from 'react-redux';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import { SocialProgramTable } from './social-program-table.component';
import { loadSocialProgramsAction } from '../state/usecases/load-social-programs.usecase';
import { removeSocialProgramAction } from '../state/usecases/remove-social-program.usecase';

import {
  isLoadingSelector,
  socialProgramCatalogSelector,
  pagingSelector,
  filterSelector,
} from '../state/social-programs.selectors';

const mapDispatchToProps = {
  loadSocialProgramsAction,
  removeSocialProgramAction,
};

function mapStateToProps(state: any) {
  return {
    filters: filterSelector(state),
    socialPrograms: socialProgramCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const SocialProgramTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialProgramTable);
