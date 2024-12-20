import type { ComponentProps } from "react";

import { IconButton, TextField } from "@radix-ui/themes";
import { useToggle } from "@react-hookz/web";
import IconTablerEye from "~icons/tabler/eye";
import IconTablerEyeClosed from "~icons/tabler/eye-closed";
import { useField } from "formik";
import { useMemo } from "react";

import FormErrors from "./errors";
import FormNumberField from "./number-field";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

function FormDefaultTextField(props: TextField.RootProps & FormWrapperProps) {
  const { name, label, color, type, disabled } = props;
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  const [passwordShown, togglePasswordShown] = useToggle(false);
  const passwordSuffix = useMemo(() => type === "password"
    ? (
        <IconButton
          type="button"
          variant="ghost"
          className="m-0 h-full box-border rounded-l-none"
          onClick={() => {
            togglePasswordShown();
          }}
          disabled={disabled}
        >
          {passwordShown ? <IconTablerEye /> : <IconTablerEyeClosed />}
        </IconButton>
      )
    : null, [passwordShown, togglePasswordShown, type, disabled]);

  const finalType = useMemo(() => {
    if (type === "password") {
      return passwordShown ? "text" : "password";
    }
    return type;
  }, [passwordShown, type]);

  return (
    <FormWrapper {...props}>
      <TextField.Root
        {...field}
        {...props}
        value={field.value ?? ""}
        color={gotError ? "red" : color}
        required={false}
        type={finalType}
      >
        {passwordSuffix}
      </TextField.Root>
      <FormErrors name={name} label={label} />
    </FormWrapper>
  );
}

export default function FormTextField(props: (TextField.RootProps & FormWrapperProps) | ComponentProps<typeof FormNumberField>) {
  const { type, min, max } = props;
  if (type === "number") {
    return (
      <FormNumberField
        {...props}
        type="number"
        min={Number.isNaN(Number(min)) ? undefined : Number(min)}
        max={Number.isNaN(Number(max)) ? undefined : Number(max)}
      />
    );
  }

  return <FormDefaultTextField {...props} />;
}
