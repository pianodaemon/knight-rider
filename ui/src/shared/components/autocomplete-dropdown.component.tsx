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
  groupField?: string,
  multiple?: boolean,
};

export function AutoCompleteDropdown(props: Props) {
  const {
    fieldLabel,
    fieldValue,
    groupField,
    label,
    multiple,
    name,
    onChange,
    options,
    value,
  } = props;
  const opts = groupField
    ? options
    : options.map((option: any) => {
        const firstLetter = option[fieldLabel][0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      });
  const itemSelected =
    opts &&
    opts.find((item: any) => item[fieldValue].toString() === value.toString())
      ? opts.find(
          (item: any) => item[fieldValue].toString() === value.toString()
        )
      : undefined;
  const itemsSelected =
    opts && Array.isArray(value)
      ? value.map((selected: any) =>
          opts.find(
            (item: any) => item[fieldValue].toString() === selected.toString()
          )
        )
      : [];
  const selected =
    value && Array.isArray(value) ? itemsSelected || [] : itemSelected || null;
  return (
    <Autocomplete
      id={`grouped-${name}`}
      groupBy={(option: any) => {
        return groupField ? option[groupField] : option.firstLetter;
      }}
      noOptionsText="Sin opciones"
      getOptionLabel={(option: any) => option[fieldLabel] || ''}
      getOptionSelected={(option: any, val: any) => {
        return val[fieldValue] === option[fieldValue];
      }}
      onChange={(event: any, newValue: any) => {
        onChange(
          Array.isArray(value)
            ? (newValue && newValue.map((item: any) => item[fieldValue])) || ''
            : (newValue && newValue[fieldValue]) || ''
        );
      }}
      options={opts.sort((a: any, b: any) => {
        return groupField
          ? -b[groupField].localeCompare(a[groupField])
          : -b.firstLetter.localeCompare(a.firstLetter);
      })}
      renderInput={(params) => {
        return <TextField {...params} label={label} />;
      }}
      // value={itemSelected && value ? itemSelected : null}
      value={selected}
      multiple={multiple}
    />
  );
}
