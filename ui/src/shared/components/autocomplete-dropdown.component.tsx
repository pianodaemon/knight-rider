/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

type Props = {
  options: Array<any>,
  onChange: any,
  fieldLabel: string,
  fieldValue: string,
  label: string,
  name: string,
  value: any,
};

export function AutoCompleteDropdown(props: Props) {
  const {
    fieldLabel,
    fieldValue,
    label,
    name,
    onChange,
    options,
    value,
  } = props;
  const opts = options.map((option: any) => {
    const firstLetter = option[fieldLabel][0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });
  const itemSelected =
    opts && opts.find((item: any) => item[fieldValue] === value)
      ? opts.find((item: any) => item[fieldValue] === value)
      : undefined;
  return (
    <Autocomplete
      id={`grouped-${name}`}
      groupBy={(option: any) => option.firstLetter}
      noOptionsText="Sin opciones"
      getOptionLabel={(option: any) => option[fieldLabel] || ''}
      getOptionSelected={(option: any, val: any) => {
        return val[fieldValue] === option[fieldValue];
      }}
      onChange={(event: any, newValue: any) => {
        onChange((newValue && newValue[fieldValue]) || '');
      }}
      options={opts.sort((a: any, b: any) => {
        return -b.firstLetter.localeCompare(a.firstLetter);
      })}
      renderInput={(params) => {
        return <TextField {...params} label={label} />;
      }}
      value={itemSelected && value ? itemSelected : null}
    />
  );
}
