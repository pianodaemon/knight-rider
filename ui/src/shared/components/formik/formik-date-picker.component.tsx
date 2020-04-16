import React, { useState } from 'react';
import { DatePicker } from '@material-ui/pickers';
import format from 'date-fns/format';

export const FormikDatePicker = ({
  form: { setFieldValue },
  field: { value, name, label },
  ...rest
}: any) => {
  const [selectedDate, handleDateChange] = useState(new Date());
  return (
    <DatePicker
      animateYearScrolling={false}
      clearable
      format="yyyy-MM-dd"
      label={label}
      name={name}
      onChange={(val: Date) => {
        setFieldValue(name, val ? format(val, 'yyyy-MM-dd') : selectedDate);
        return handleDateChange(val);
      }}
      value={new Date(value ? value.replace(/-/g, '/') : value)}
      views={['date', 'month']}
      {...rest}
      // autoOk
      // disableOpenOnEnter
      // keyboard
      // placeholder="10/10/2018"
    />
  );
};
