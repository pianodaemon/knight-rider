import React from 'react';
import { DatePicker } from '@material-ui/pickers';
import format from 'date-fns/format';

export const FormikDatePicker = ({
  form: { setFieldValue },
  field: { value, name, label },
  ...rest
}: any) => {
  return (
    <DatePicker
      animateYearScrolling={false}
      clearable
      format="yyyy-MM-dd"
      label={label}
      name={name}
      onChange={(val: Date) => {
        setFieldValue(name, val ? format(val, 'yyyy-MM-dd') : '');
      }}
      value={value ? value.replace('-', '/') : null}
      views={['year', 'date', 'month']}
      {...rest}
      // autoOk
      // disableOpenOnEnter
      // keyboard
      // placeholder="10/10/2018"
    />
  );
};
