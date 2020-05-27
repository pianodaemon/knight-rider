import { connect } from 'react-redux';
import { AuditsForm } from './audit-form.component';
import { createAuditAction } from '../state/usecases/create-audit.usecase';
import { readAuditAction } from '../state/usecases/read-audit.usecase';
import { updateAuditAction } from '../state/usecases/update-audit.usecase';

import { auditSelector, catalogSelector } from '../state/audits.selectors';

const mapDispatchToProps = {
  createAuditAction,
  readAuditAction,
  updateAuditAction,
};

function mapStateToProps(state: any) {
  return {
    audit: auditSelector(state),
    catalog: catalogSelector(state),
  };
}

export const AuditContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuditsForm);
