import type { PropsWithChildren } from "react";

import { Select } from "@radix-ui/themes";
import clsx from "clsx";
import { useField } from "formik";

import SelectItemWhenEmpty from "../select-item-when-empty";
import UnselectableSelectItem from "../unselectable-select-item";
import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

export default function FormSelect(props: PropsWithChildren<
  Select.RootProps &
  FormWrapperProps &
  { trigger?: Select.TriggerProps }
>) {
  const { trigger, name, children, onValueChange } = props;
  const { color } = trigger ?? {};
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <FormWrapper {...props}>
      <Select.Root
        value={field.value}
        {...props}
        onValueChange={(value) => {
          field.onChange({ target: { value: value === "<unselect>" ? "" : value, name } });
          onValueChange?.(value === "<unselect>" ? "" : value);
        }}
        required={false}
      >
        <Select.Trigger
          onBlur={(evt) => {
            evt.target.name = name;
            field.onBlur(evt);
          }}
          {...trigger}
          color={gotError ? "red" : color}
          className={clsx(trigger?.className, ":uno: min-w-36")}
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
      <FormErrors {...meta} />
    </FormWrapper>
  );
}
