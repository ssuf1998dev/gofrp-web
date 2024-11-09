import { Flex, IconButton, TextField } from "@radix-ui/themes";
import IconTablerPlus from "~icons/tabler/plus";
import IconTablerTrash from "~icons/tabler/trash";
import clsx from "clsx";
import { FieldArray, useField } from "formik";

import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

export default function FormList(props: {
  itemTextFieldProps?: TextField.RootProps;
} & FormWrapperProps) {
  const { name, label, itemTextFieldProps } = props;
  const [field, meta] = useField<string[]>(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <FormWrapper {...props}>
      <FieldArray
        name={name}
        render={(helper) => {
          const rows = (field.value ?? [""]).map((value, idx, { length }) => (
            // eslint-disable-next-line react/no-array-index-key
            <Flex key={idx} gap="2" align="center">
              <TextField.Root
                {...itemTextFieldProps}
                value={value}
                onChange={(evt) => {
                  (field.value ??= [""])[idx] = evt.target.value;
                  field.onChange({ target: { value: field.value, name } });
                  itemTextFieldProps?.onCanPlay?.(evt);
                }}
                color={gotError ? "red" : itemTextFieldProps?.color}
                required={false}
                className={clsx(":uno: flex-grow-1", itemTextFieldProps?.className)}
              />
              <IconButton
                type="button"
                variant="surface"
                onClick={() => {
                  !field.value && field.onChange({ target: { value: [""], name } });
                  helper.insert(idx + 1, "");
                }}
              >
                <IconTablerPlus />
              </IconButton>

              <IconButton
                type="button"
                variant="surface"
                color="red"
                onClick={() => {
                  !field.value && field.onChange({ target: { value: [""], name } });
                  helper.remove(idx);
                }}
                disabled={length <= 1}
              >
                <IconTablerTrash />
              </IconButton>
            </Flex>
          ));

          return (
            <Flex gap="2" direction="column">
              {rows}
            </Flex>
          );
        }}
      />

      <FormErrors name={name} label={label} />
    </FormWrapper>
  );
}
