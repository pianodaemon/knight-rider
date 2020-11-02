import React from 'react';
import NumberFormat from 'react-number-format';

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string, value: string } }) => void;
  name: string;
  allowNegatives: boolean;
}

export function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, allowNegatives, ...other } = props;

  return (
    <NumberFormat
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix=""
      allowNegative={allowNegatives || false}
      {...other}
    />
  );
}
