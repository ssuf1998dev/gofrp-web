import type { PropsWithChildren } from "react";

import { Text, Tooltip } from "@radix-ui/themes";
import IconTablerHelp from "~icons/tabler/help";
import clsx from "clsx";

export type FormWrapperProps = PropsWithChildren<{
  name: string;
  label?: string;
  tooltip?: string;
  required?: boolean;
  htmlFor?: string;
}>;

export default function FormWrapper(props: FormWrapperProps) {
  const { name, label, tooltip, required, children, htmlFor } = props;

  return (
    <div>
      <label htmlFor={htmlFor}>
        <Text
          size="2"
          className={clsx(
            ":uno: font-bold mb-1.5 block",
            { ":uno: before:content-[--form-required-indicator] before:mr-0.5 before-color-[--red-11]": required },
          )}
        >
          {label || name}
          {tooltip
            ? (
                <Tooltip content={tooltip}>
                  <span>
                    <IconTablerHelp className=":uno: vertical-text-top color-[--gray-indicator] ml-1 cursor-help" />
                  </span>
                </Tooltip>
              )
            : null}
        </Text>
        {!htmlFor ? children : null}
      </label>
      {htmlFor ? children : null}
    </div>
  );
}
