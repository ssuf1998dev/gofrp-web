import type { SwitchProps } from "@radix-ui/themes";

import { Switch } from "@radix-ui/themes";
import { useField } from "formik";

import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

export default function FormSwitch(props: SwitchProps & FormWrapperProps) {
  const { name, label, color, onCheckedChange } = props;
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <FormWrapper {...props} inlineLabel>
      <Switch
        {...field}
        {...props}
        checked={!!field.value}
        color={gotError ? "red" : color}
        onBlur={(evt) => {
          evt.target.name = name;
          field.onBlur(evt);
        }}
        onCheckedChange={(value) => {
          field.onChange({ target: { value, name } });
          onCheckedChange?.(value);
        }}
      />
      <FormErrors name={name} label={label} />
    </FormWrapper>
  );
}
