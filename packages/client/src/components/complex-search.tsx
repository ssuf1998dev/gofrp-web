import type { ButtonProps } from "@radix-ui/themes";

import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import { useMountEffect } from "@react-hookz/web";
import IconTablerSearch from "~icons/tabler/search";
import clsx from "clsx";
import { type ReactElement, useMemo, useState } from "react";

import SelectItemWhenEmpty from "./select-item-when-empty";
import UnselectableSelectItem from "./unselectable-select-item";

type TypeItem = {
  type: "text";
  inputProps?: Omit<TextField.RootProps, "value" | "onChange">;
} | {
  type: "select";
  inputProps?: Omit<Select.RootProps, "value" | "onValueChange"> & { className?: string; unselectable?: boolean };
  selectItems?: ReactElement[];
  selectContentProps?: Select.ContentProps;
};
interface ComplexSearchProps {
  selectProps?: Omit<Select.RootProps, "value" | "onValueChange"> & { className?: string };
  selectContentProps?: Select.ContentProps;
  selectItems?: ReactElement[];
  submitButtonProps?: ButtonProps;
  types?: Record<string, TypeItem>;

  value?: Record<string, any>;
  onChange?: (value: Required<ComplexSearchProps>["value"], changes: string[]) => void;
  onSubmit?: (value: Required<ComplexSearchProps>["value"]) => void;
  disabled?: boolean;
};
export default function ComplexSearch(props: ComplexSearchProps) {
  const {
    selectProps,
    selectContentProps,
    selectItems,
    submitButtonProps,
    types,

    value,
    onChange,
    onSubmit,
    disabled,
  } = props;

  const [selected, setSelected] = useState<string>((selectItems ?? [])[0]?.props?.value);
  const currentType = useMemo(
    () => ((selected && types?.[selected]) ?? { type: "text" }) as TypeItem,
    [types, selected],
  );

  const [searched, setSearched] = useState<Record<string, any>>(
    (selectItems ?? []).reduce((map: Record<string, any>, curr) => {
      curr.props?.value && (map[curr.props.value] = "");
      return map;
    }, {}),
  );

  useMountEffect(() => {
    const changedValues = (selectItems ?? []).reduce((map: Record<string, any>, curr) => {
      curr.props?.value && (map[curr.props.value] = "");
      return map;
    }, {});
    onChange?.(changedValues, Object.keys(changedValues),
    );
  });

  const inputNode = useMemo(() => {
    if (currentType.type === "text") {
      return (
        <TextField.Root
          {...currentType.inputProps}
          className={clsx(
            ":uno: rounded-l-none border-l-transparent mx-[-1px] has-[:focus]:[clip-path:none] has-[:focus]:z-1",
            {
              ":uno: rounded-r-none min-w-64 [clip-path:inset(0_1px_0_1px)]": !!onSubmit,
              ":uno: min-w-72 [clip-path:inset(0_0_0_1px)]": !onSubmit,
            },
            currentType.inputProps?.className,
          )}
          disabled={currentType.inputProps?.disabled || disabled}
          value={(value ?? searched)[selected]}
          onChange={(evt) => {
            if (onChange) {
              onChange({ ...value, [selected]: evt.target.value }, [selected]);
              return;
            }
            setSearched(old => ({ ...old, [selected]: evt.target.value }));
          }}
          onKeyUp={(evt) => {
            if (onSubmit && evt.key === "Enter") {
              evt.preventDefault();
              onSubmit(value ?? {});
            }
            currentType.inputProps?.onKeyUp?.(evt);
          }}
        />
      );
    }

    if (currentType.type === "select") {
      return (
        <Select.Root
          {...currentType.inputProps}
          value={(value ?? searched)[selected]}
          onValueChange={(selectValue) => {
            const finalSelectValue = selectValue === "<unselect>" ? "" : selectValue;
            if (onChange) {
              onChange({ ...value, [selected]: finalSelectValue }, [selected]);
              return;
            }
            setSearched(old => ({ ...old, [selected]: finalSelectValue }));
          }}
          disabled={currentType.inputProps?.disabled || disabled}
        >
          <Select.Trigger
            className={clsx(
              ":uno: rounded-l-none border-l-transparent mx-[-1px] focus:z-1 focus:[clip-path:none]",
              {
                ":uno: rounded-r-none min-w-64 [clip-path:inset(0_1px_0_1px)]": !!onSubmit,
                ":uno: min-w-72 [clip-path:inset(0_0_0_1px)]": !onSubmit,
              },
              currentType.inputProps?.className,
            )}
            onKeyUp={(evt) => {
              if (onSubmit && evt.key === "Enter") {
                evt.preventDefault();
                onSubmit(value ?? {});
              }
            }}
          />
          <Select.Content {...currentType.selectContentProps}>
            {(value ?? searched)[selected] && currentType.inputProps?.unselectable ? <UnselectableSelectItem /> : null}
            {currentType.selectItems ?? <SelectItemWhenEmpty />}
          </Select.Content>
        </Select.Root>
      );
    }

    return null;
  }, [currentType, searched, selected, value, onChange, onSubmit, disabled]);

  return (
    <Flex>
      <Select.Root
        {...selectProps}
        value={selected}
        onValueChange={(value) => {
          setSelected(value);
        }}
        disabled={selectProps?.disabled || disabled}
      >
        <Select.Trigger
          className={clsx(
            ":uno: rounded-r-none min-w-30 focus-z-1",
            selectProps?.className,
          )}
        />
        <Select.Content {...selectContentProps}>
          {selectItems ?? <SelectItemWhenEmpty />}
        </Select.Content>
      </Select.Root>

      {inputNode}

      {onSubmit
        ? (
            <Button
              {...submitButtonProps}
              variant="surface"
              className={clsx(
                ":uno: rounded-l-none focus-z-1",
                submitButtonProps?.className,
              )}
              onClick={(evt) => {
                onSubmit(value ?? {});
                submitButtonProps?.onClick?.(evt);
              }}
              disabled={submitButtonProps?.disabled || disabled}
            >
              <IconTablerSearch />
            </Button>
          )
        : null}
    </Flex>
  );
}
