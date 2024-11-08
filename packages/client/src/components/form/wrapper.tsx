import type { PropsWithChildren } from "react";

import { Text, Tooltip } from "@radix-ui/themes";
import IconTablerHelp from "~icons/tabler/help";
import clsx from "clsx";

export type FormWrapperProps = PropsWithChildren<{
  name: string;
  label?: string;
  inlineLabel?: boolean;
  tooltip?: string;
  required?: boolean;
  htmlFor?: string;
  disabled?: boolean;
}>;

export default function FormWrapper(props: FormWrapperProps) {
  const { name, label, inlineLabel, tooltip, required, children, htmlFor, disabled } = props;

  return (
    <div className={clsx({ ":uno: inline-flex gap-2 items-center": inlineLabel && htmlFor })}>
      <label htmlFor={htmlFor} className={clsx({ ":uno: inline-flex gap-2 items-center": inlineLabel })}>
        <Text
          size="2"
          className={clsx(
            ":uno: font-bold",
            inlineLabel ? "" : ":uno: mb-1.5 inline-block",
            {
              ":uno: before:content-[--form-required-indicator] before:mr-0.5": required,
              ":uno: before-color-[--red-11]": required && !disabled,
              ":uno: before-color-[--gray-a8]": required && disabled,
            },
            { ":uno: color-[--gray-a8]": disabled },
          )}
        >
          {label || name}
          {tooltip
            ? (
                <Tooltip content={tooltip}>
                  <span>
                    <IconTablerHelp className=":uno: vertical-middle color-[--gray-indicator] ml-1 cursor-help" />
                  </span>
                </Tooltip>
              )
            : null}
        </Text>
        <br />
        {!htmlFor ? children : null}
      </label>
      {htmlFor ? children : null}
    </div>
  );
}
