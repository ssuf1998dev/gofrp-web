import type { PropsWithChildren } from "react";

import { Select, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { useField } from "formik";

import SelectItemWhenEmpty from "../select-item-when-empty";
import UnselectableSelectItem from "../unselectable-select-item";

export default function FormSelect(props: PropsWithChildren<
  Select.RootProps &
  { trigger?: Select.TriggerProps; name: string; label?: string }
>) {
  const { trigger, name, label, children, required } = props;
  const { color } = trigger ?? {};
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <label className=":uno: flex flex-col gap-1">
      <Text
        size="2"
        className={clsx(
          ":uno: font-bold",
          { ":uno: before:content-[--form-required-indicator] before:mr-0.5 before-color-[--red-11]": required },
        )}
      >
        {label || name}
      </Text>
      <Select.Root
        value={field.value}
        onValueChange={(value) => {
          field.onChange({ target: { value: value === "<unselect>" ? "" : value, name } });
        }}
        {...props}
        required={false}
      >
        <Select.Trigger
          onBlur={(evt) => {
            evt.target.name = name;
            field.onBlur(evt);
          }}
          {...trigger}
          color={gotError ? "red" : color}
        />
        <Select.Content>
          {children
            ? (
                <>
                  <UnselectableSelectItem />
                  {children}
                </>
              )
            : <SelectItemWhenEmpty />}
        </Select.Content>
      </Select.Root>
      {gotError
        ? (
            <div>
              {([meta.error].flat().filter(Boolean) as string[]).map(
                error => <Text key={error} size="1" color="red">{error}</Text>,
              )}
            </div>
          )
        : null}
    </label>
  );
}
