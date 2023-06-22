import {
  FormControl as ChakraFormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  StatHelpTextProps,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { FC } from "react";

export interface BaseProps extends Omit<FormControlProps, "label"> {
  name: string;
  type?: string;
  label?: React.ReactNode;
  labelProps?: FormLabelProps;
  helperText?: React.ReactNode;
  helperTextProps?: StatHelpTextProps;
  errorMessageProps?: FormErrorMessageProps;
}

export const FormControl: FC<BaseProps> = (props: BaseProps) => {
  const {
    children,
    name,
    label,
    labelProps,
    helperText,
    helperTextProps,
    errorMessageProps,
    ...rest
  } = props;
  const [, { error, touched }] = useField(name);

  return (
    <ChakraFormControl isInvalid={!!error && touched} {...rest}>
      {label && typeof label === "string" ? (
        <FormLabel htmlFor={name} {...labelProps}>
          {label}
        </FormLabel>
      ) : (
        label
      )}
      {children}
      {error && (
        <FormErrorMessage {...errorMessageProps}>{error}</FormErrorMessage>
      )}
      {helperText && typeof helperText === "string" ? (
        <FormHelperText {...helperTextProps}>{helperText}</FormHelperText>
      ) : (
        helperText
      )}
    </ChakraFormControl>
  );
};

// export default FormControl;
