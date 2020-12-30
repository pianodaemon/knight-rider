import { connect } from 'react-redux';
import { SocialProgramForm } from './social-program-form.component';
import { createSocialProgramAction } from '../state/usecases/create-social-program.usecase';
import { readSocialProgramAction } from '../state/usecases/read-social-program.usecase';
import { updateSocialProgramAction } from '../state/usecases/update-social-program.usecase';
import { socialProgramSelector } from '../state/social-programs.selectors';

const mapDispatchToProps = {
  createSocialProgramAction,
  readSocialProgramAction,
  updateSocialProgramAction,
};

function mapStateToProps(state: any) {
  return {
    socialProgram: socialProgramSelector(state),
  };
}

export const SocialProgramFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialProgramForm);
