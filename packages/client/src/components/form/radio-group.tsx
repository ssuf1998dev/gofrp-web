import type { FlexProps } from "@radix-ui/themes";

import { RadioCards, RadioGroup } from "@radix-ui/themes";
import clsx from "clsx";
import { useField } from "formik";

import type { FormWrapperProps } from "./wrapper";

import FormErrors from "./errors";
import FormWrapper from "./wrapper";

export default function FormRadioGroupField(props: (
  (RadioGroup.RootProps & { card?: false } & Pick<FlexProps, "direction">) |
  (RadioCards.RootProps & { card: true })) &
  FormWrapperProps) {
  const { card, label, name, color, children, className, onValueChange, disabled } = props;
  const { direction } = props as FlexProps;
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  const Root = card ? RadioCards.Root : RadioGroup.Root;

  return (
    <FormWrapper {...props}>
      <Root
        {...field}
        {...props as any}
        value={field.value ?? ""}
        color={gotError ? "red" : color}
        onValueChange={(value) => {
          field.onChange({ target: { value, name } });
          onValueChange?.(value);
        }}
        onBlur={(evt) => {
          (evt.target as any).name = name;
          field.onBlur(evt);
        }}
        className={clsx(
          !card && `:uno: ${({
            "row": "flex-row gap-4",
            "column": "flex-col",
            "row-reverse": "flex-row-reverse gap-4",
            "column-reverse": "flex-col-reverse",
          } as any)[(direction ?? "col") as string]}`,
          { ":uno: color-[--gray-a11]": disabled },
          className,
        )}
      >
        {children}
      </Root>
      <FormErrors name={name} label={label} />
    </FormWrapper>
  );
}
