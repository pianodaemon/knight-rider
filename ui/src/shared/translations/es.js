export default {
  observation: {
    id: 'Id',
    observation_type_id: 'Tipo de Observación',
    social_program_id: 'Programa',
    'audit_id: number': 'Auditoría no.',
    fiscal_id: 'Auditor',
    title: 'Descripción',
    amount_observed: 'Observado',
    error_responses: {
      unique_constraint:
        'Observation not found. duplicate key value violates unique constraint',
      unique_error:
        'El título de esta observación ya existe, por favor revisa el campo Observación e ingresa uno diferente.',
    },
  },
};
