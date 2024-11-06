import { TextField } from "@radix-ui/themes";
import { useField } from "formik";

import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

export default function FormTextField(props: TextField.RootProps & FormWrapperProps) {
  const { name, color } = props;
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <FormWrapper {...props}>
      <TextField.Root
        {...field}
        {...props}
        color={gotError ? "red" : color}
        required={false}
      />
      <FormErrors {...meta} />
    </FormWrapper>
  );
}
