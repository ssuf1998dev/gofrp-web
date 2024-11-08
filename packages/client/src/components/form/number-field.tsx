import { Flex, IconButton, Select, TextField } from "@radix-ui/themes";
import IconTablerMinus from "~icons/tabler/minus";
import IconTablerPlus from "~icons/tabler/plus";
import clsx from "clsx";
import { useField } from "formik";
import { nanoid } from "nanoid";
import { useState } from "react";

import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

const uid = nanoid();

export default function FormNumberField(props: TextField.RootProps & FormWrapperProps & {
  type: "number";
  min?: number;
  max?: number;
  units?: { key: string; label?: string }[];
}) {
  const { name, label, color, className, max, min, units, disabled, onChange } = props;
  const [field, meta] = useField(name);
  const uniting = !!units?.length;
  const fieldValue = uniting ? field.value?.value : field.value;

  const gotError = meta.error?.length && meta.touched;

  const [selectedUnit, setSelectedUnit] = useState(units?.[0]?.key);

  return (
    <FormWrapper {...props} htmlFor={uid}>
      <Flex>
        <IconButton
          type="button"
          variant="surface"
          className=":uno: rounded-r-none"
          onClick={() => {
            const next = Number(fieldValue) - 1;
            field.onChange({ target: {
              value: uniting
                ? { value: Number.isNaN(next) ? 0 : next, unit: selectedUnit }
                : Number.isNaN(next) ? 0 : next,
              name,
            } });
          }}
          disabled={fieldValue <= (min ?? -Infinity) || disabled}
        >
          <IconTablerMinus />
        </IconButton>
        <TextField.Root
          {...field}
          {...props}
          value={fieldValue ?? ""}
          onChange={(evt) => {
            uniting && ((evt.target as any).value = { value: evt.target.value, unit: selectedUnit });
            field.onChange(evt);
            onChange?.(evt);
          }}
          color={gotError ? "red" : color}
          required={false}
          type="number"
          id={uid}
          className={clsx(
            ":uno: rounded-none mx-[-1px] has-[:focus]:[clip-path:none] has-[:focus]:z-1 [clip-path:inset(0_1px_0_1px)]",
            ":uno: text-align-center",
            uniting ? ":uno: w-36" : ":uno: w-28",
            className,
          )}
        >
          {uniting
            ? (
                <Select.Root
                  value={selectedUnit}
                  onValueChange={(value) => {
                    field.onChange({ target: { value: { value: fieldValue, unit: value }, name } });
                    setSelectedUnit(value);
                  }}
                  disabled={disabled}
                >
                  <Select.Trigger variant="ghost" className="m-0 h-full box-border rounded-none" />
                  <Select.Content>
                    {units.map(item => (
                      <Select.Item key={item.key} value={item.key}>{item.label ?? item.key}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )
            : null}
        </TextField.Root>
        <IconButton
          type="button"
          variant="surface"
          className=":uno: rounded-l-none"
          onClick={() => {
            const next = Number(fieldValue) + 1;
            field.onChange({ target: {
              value: uniting
                ? { value: Number.isNaN(next) ? 0 : next, unit: selectedUnit }
                : Number.isNaN(next) ? 0 : next,
              name,
            } });
          }}
          disabled={fieldValue >= (max ?? Infinity) || disabled}
        >
          <IconTablerPlus />
        </IconButton>
      </Flex>
      <FormErrors name={name} label={label} />
    </FormWrapper>
  );
}
