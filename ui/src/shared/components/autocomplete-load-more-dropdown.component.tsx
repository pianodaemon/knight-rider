/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

type Props = {
  disabled?: boolean,
  fieldLabel: string,
  fieldValue: string,
  groupField?: string,
  label: string,
  name: string,
  onChange: any,
  onSearch: any,
  options: Array<any>,
  value: any,
};

export function AutoCompleteLoadMoreDropdown(props: Props) {
  const {
    disabled,
    fieldLabel,
    fieldValue,
    groupField,
    label,
    name,
    onChange,
    onSearch,
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
  const [search, setSearch] = useState<any>('');
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
      value={selected}
      disabled={disabled}
      /*
      // @todo Load More Options feature
      ListboxProps={{
        onScroll: (event: any) => {
          console.log(
            event.target.scrollTop,
            event.target.scrollHeight,
            event.target.clientHeight,
            event.target.scrollTop+event.target.clientHeight === event.target.scrollHeight
          );
          if (
            event.target.scrollTop + event.target.clientHeight ===
            event.target.scrollHeight
          ) {
            alert('lol');
          }
        }
      }}
      debug
      */
      onInputChange={(event, val: string, reason: string) => {
        if (reason === 'input') {
          setSearch(val);
          onSearch(val);
        }
      }}
      inputValue={search}
      clearOnBlur
      /*
      // @todo Load More Options feature
      ListboxProps={{
        onScroll: (event: any) => {
          console.log(
            event.target.scrollTop,
            event.target.scrollHeight,
            event.target.clientHeight,
            event.target.scrollTop+event.target.clientHeight === event.target.scrollHeight
          );
          if (
            event.target.scrollTop + event.target.clientHeight ===
            event.target.scrollHeight
          ) {
            alert('lol');
          }
        }
      }}
      debug
      */
      filterOptions={(ops) => ops}
    />
  );
}
