import { Flex, IconButton, TextField } from "@radix-ui/themes";
import IconTablerMinus from "~icons/tabler/minus";
import IconTablerPlus from "~icons/tabler/plus";
import clsx from "clsx";
import { useField } from "formik";
import { nanoid } from "nanoid";

import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

const uid = nanoid();

export default function FormNumberField(props: TextField.RootProps & FormWrapperProps & {
  min?: number;
  max?: number;
}) {
  const { name, color, className, max, min } = props;
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <FormWrapper {...props} htmlFor={uid}>
      <Flex>
        <IconButton
          type="button"
          variant="surface"
          className=":uno: rounded-r-none"
          onClick={() => {
            field.onChange({ target: { value: Number(field.value) - 1, name } });
          }}
          disabled={field.value <= (min ?? -Infinity)}
        >
          <IconTablerMinus />
        </IconButton>
        <TextField.Root
          {...field}
          {...props}
          value={field.value ?? ""}
          color={gotError ? "red" : color}
          required={false}
          type="number"
          id={uid}
          className={clsx(
            ":uno: rounded-none mx-[-1px] has-[:focus]:[clip-path:none] has-[:focus]:z-1 [clip-path:inset(0_1px_0_1px)]",
            ":uno: min-w-28 text-align-center",
            className,
          )}
        />
        <IconButton
          type="button"
          variant="surface"
          className=":uno: rounded-l-none"
          onClick={() => {
            field.onChange({ target: { value: Number(field.value) + 1, name } });
          }}
          disabled={field.value >= (max ?? Infinity)}
        >
          <IconTablerPlus />
        </IconButton>
      </Flex>
      <FormErrors {...meta} />
    </FormWrapper>
  );
}
