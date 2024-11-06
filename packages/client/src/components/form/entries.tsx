import { Flex, IconButton, TextField } from "@radix-ui/themes";
import IconTablerPlus from "~icons/tabler/plus";
import IconTablerTrash from "~icons/tabler/trash";
import clsx from "clsx";
import { FieldArray, useField } from "formik";
import { useTranslation } from "react-i18next";

import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

export default function FormEntries(props: {
  keyTextFieldProps?: TextField.RootProps;
  valueTextFieldProps?: TextField.RootProps;
} & FormWrapperProps) {
  const { t } = useTranslation();
  const { name, keyTextFieldProps, valueTextFieldProps } = props;
  const [field, meta] = useField<string[][]>(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <FormWrapper {...props}>
      <FieldArray
        name={name}
        render={(helper) => {
          const rows = field.value.map(([key, value], idx, { length }) => (
            // eslint-disable-next-line react/no-array-index-key
            <Flex key={idx} gap="2" align="center">
              <TextField.Root
                placeholder={t("formatting.upper_first", { value: t("key") })}
                {...keyTextFieldProps}
                value={key}
                onChange={(evt) => {
                  field.value[idx][0] = evt.target.value;
                  field.onChange({ target: { value: field.value, name } });
                  keyTextFieldProps?.onCanPlay?.(evt);
                }}
                color={gotError ? "red" : keyTextFieldProps?.color}
                required={false}
                className={clsx(":uno: flex-basis-1/3", keyTextFieldProps?.className)}
              />
              <TextField.Root
                placeholder={t("formatting.upper_first", { value: t("value") })}
                {...valueTextFieldProps}
                value={value}
                onChange={(evt) => {
                  field.value[idx][1] = evt.target.value;
                  field.onChange({ target: { value: field.value, name } });
                  valueTextFieldProps?.onCanPlay?.(evt);
                }}
                color={gotError ? "red" : valueTextFieldProps?.color}
                required={false}
                className={clsx(":uno: flex-basis-2/3", valueTextFieldProps?.className)}
              />

              <IconButton
                type="button"
                variant="surface"
                onClick={() => {
                  helper.insert(idx + 1, ["", ""]);
                }}
              >
                <IconTablerPlus />
              </IconButton>

              <IconButton
                type="button"
                variant="surface"
                color="red"
                onClick={() => {
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

      <FormErrors {...meta} />
    </FormWrapper>
  );
}
