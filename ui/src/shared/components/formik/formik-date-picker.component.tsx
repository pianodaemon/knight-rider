import React, { useState } from 'react';
import { DatePicker } from '@material-ui/pickers';
import format from 'date-fns/format';
import InputAdornment from '@material-ui/core/InputAdornment';

export const FormikDatePicker = ({
  form: { setFieldValue },
  field: { value, name, label },
  ...rest
}: any) => {
  const [selectedDate, handleDateChange] = useState(new Date());
  const date: Date | null =
    value instanceof Date || value === null
      ? null
      : new Date(value ? value.replace(/-/g, '/') : value);
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
      value={date}
      views={['date', 'month']}
      placeholder="2099-12-31"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start"> {null} </InputAdornment>
        ),
      }}
      {...rest}
      // autoOk
      // disableOpenOnEnter
      // keyboard
      // placeholder="10/10/2018"
    />
  );
};
