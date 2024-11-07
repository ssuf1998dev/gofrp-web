import type { SwitchProps } from "@radix-ui/themes";

import { Switch } from "@radix-ui/themes";
import { useField } from "formik";

import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

export default function FormSwitch(props: SwitchProps & FormWrapperProps) {
  const { name, color } = props;
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <FormWrapper {...props} inlineLabel>
      <Switch
        {...field}
        {...props}
        color={gotError ? "red" : color}
      />
      <FormErrors {...meta} />
    </FormWrapper>
  );
}
