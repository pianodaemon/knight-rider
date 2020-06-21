/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete';

import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { AnyAction } from 'redux';

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

const useStyles = makeStyles(() =>
  createStyles({
    arrow: {
      verticalAlign: 'middle',
      display: 'inline-flex',
    },
  })
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function AutoCompleteTreeDropdown(props: Props) {
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
  const classes = useStyles();
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
          (item: any) => item[fieldValue].toString() === value.toString(),
        )
      : undefined;
  const itemsSelected =
    opts && Array.isArray(value)
      ? value.map((selected: any) =>
          opts.find(
            (item: any) => item[fieldValue].toString() === selected.toString(),
          )
        )
      : [];
  const selectedx =
    value && Array.isArray(value) ? itemsSelected || [] : itemSelected || null;

  const [lists, setLists] = useState<any>({});
  const handleClick = (index: number | string) => {
    setLists({
      [index]: !lists[index],
    });
  };

  const [search, setSearch] = useState<any>('');

  const checkedAll: (params: any) => boolean = (params: any): boolean => {
    const groupOptions = options
      .filter((option: any) => option[groupField || ''] === params.group)
      .map((option: any) => option.id);
    return (
      params &&
      Array.isArray(params.children) &&
      params.children.length ===
        value.filter((item: any) => groupOptions.includes(item)).length
    );
  };
  const renderGroup = (params: AutocompleteRenderGroupParams) => [
    <ListSubheader
      key={params.key}
      component="div"
      disableSticky
      onClick={() => handleClick(params.key)}
    >
      <div style={{ display: 'inline' }}>
        {lists[params.key] ? (
          <KeyboardArrowUpIcon className={classes.arrow} />
        ) : (
          <ExpandMoreIcon className={classes.arrow} />
        )}
      </div>
      <Checkbox
        icon={icon}
        checkedIcon={checkedIcon}
        checked={checkedAll(params)}
        onClick={(event: any) => {
          event.stopPropagation();
          const checkAll: Array<AnyAction> = options
            .filter((option: any) => option[groupField || ''] === params.group)
            .map((option: any) => option.id);
          onChange(
            checkedAll(params)
              ? value.filter((item: any) => !checkAll.includes(item))
              : Array.from(new Set([...value, ...checkAll]))
          );
        }}
      />
      {params.group}
    </ListSubheader>,
    <Collapse in={lists[params.key]} timeout="auto" unmountOnExit>
      {params.children}{console.log(params)}
    </Collapse>,
  ];
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
      value={selectedx}
      multiple={multiple}
      disableCloseOnSelect
      renderOption={(option, { selected }) => (
        <>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8, marginLeft: 45 }}
            checked={selected}
          />
          {option.title}
        </>
      )}
      renderGroup={renderGroup}
      onInputChange={(event, val: string, reason: string) => {
        if (reason === 'input') setSearch(val);
      }}
      inputValue={search}
      clearOnBlur
    />
  );
}
