/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = {
  disabled?: boolean,
  fieldLabel: string,
  fieldValue: string,
  // groupField?: string,
  label: string,
  loading: boolean,
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
    // groupField,
    label,
    loading,
    name,
    onChange,
    onSearch,
    options,
    value,
  } = props;
  const opts = options;
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
  console.log('value:', value);
  return (
    <Autocomplete
      id={`grouped-${name}`}
      /*
      groupBy={(option: any) => {
        return groupField ? option[groupField] : option.firstLetter;
      }}
      */
      noOptionsText="Sin opciones"
      getOptionLabel={(option: any) => (option && option[fieldLabel]) || ''}
      getOptionSelected={(option: any, val: any) => {
        if (val === undefined) {
          return false;
        }
        return val[fieldValue] === option[fieldValue];
      }}
      onChange={(event: any, newValue: any) => {
        if (newValue && newValue.length === 2) {
          newValue.shift();
        }
        onChange(
          Array.isArray(value)
            ? (newValue && newValue.map((item: any) => item[fieldValue])) ||
                undefined
            : (newValue && newValue[fieldValue]) || ''
        );
      }}
      options={opts}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
              placeholder: 'Buscar Preliminar',
            }}
          />
        );
      }}
      value={selected}
      disabled={disabled}
      multiple
      loading={loading}
      loadingText="Cargando..."
      onInputChange={(event, val: string, reason: string) => {
        if (reason === 'input') {
          setSearch(val);
          onSearch(val);
        }
      }}
      inputValue={search}
      // clearOnBlur
      ListboxProps={{
        style: {
          height: '100px',
          maxHeight: '150px',
          overflow: 'auto',
        },
        onScroll: (event: any) => {
          if (
            event.target.scrollTop + event.target.clientHeight ===
            event.target.scrollHeight
          ) {
            onSearch(search);
          }
        },
      }}
      filterOptions={(ops) => ops}
    />
  );
}
