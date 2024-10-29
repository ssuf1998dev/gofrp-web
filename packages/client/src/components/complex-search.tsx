import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import { useMountEffect } from "@react-hookz/web";
import IconTablerSearch from "~icons/tabler/search";
import clsx from "clsx";
import { type ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function SelectItemWhenEmpty() {
  const { t } = useTranslation();
  return (
    <Select.Item
      value="<empty>"
      className=":uno: pointer-events-none bg-[unset]! color-[var(--gray-a8)] [&_.rt-SelectItemIndicator]:opacity-0"
    >
      {t("formatting.capital_case", { value: t("empty") })}
    </Select.Item>
  );
}

type TypeItem = {
  type: "text";
  inputProps?: Omit<TextField.RootProps, "value" | "onChange">;
} | {
  type: "select";
  inputProps?: Omit<Select.RootProps, "value" | "onValueChange"> & { className?: string };
  selectItems?: ReactElement[];
  selectContentProps?: Select.ContentProps;
};
interface ComplexSearchProps {
  selectProps?: Omit<Select.RootProps, "value" | "onValueChange"> & { className?: string };
  selectContentProps?: Select.ContentProps;
  selectItems?: ReactElement[];
  types?: Record<string, TypeItem>;

  value?: Record<string, any>;
  onChange?: (value: Required<ComplexSearchProps>["value"]) => void;
};
export default function ComplexSearch(props: ComplexSearchProps) {
  const { selectProps, selectContentProps, selectItems, types, value, onChange } = props;

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
    onChange?.((selectItems ?? []).reduce((map: Record<string, any>, curr) => {
      curr.props?.value && (map[curr.props.value] = "");
      return map;
    }, {}));
  });

  const inputNode = useMemo(() => {
    if (currentType.type === "text") {
      return (
        <TextField.Root
          {...currentType.inputProps}
          className={clsx(
            ":uno: rounded-none border-l-transparent min-w-78 mx-[-1px] [clip-path:inset(0_1px_0_1px)] has-[:focus]:[clip-path:none] has-[:focus]:z-1",
            currentType.inputProps?.className,
          )}
          value={(value ?? searched)[selected]}
          onChange={(evt) => {
            if (onChange) {
              onChange({ ...value, [selected]: evt.target.value });
              return;
            }
            setSearched(old => ({ ...old, [selected]: evt.target.value }));
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
            if (onChange) {
              onChange({ ...value, [selected]: selectValue });
              return;
            }
            setSearched(old => ({ ...old, [selected]: selectValue }));
          }}
        >
          <Select.Trigger className={clsx(
            ":uno: rounded-none border-l-transparent min-w-78 mx-[-1px]",
            ":uno: [clip-path:inset(0_1px_0_1px)] focus:[clip-path:none] focus:z-1",
            currentType.inputProps?.className,
          )}
          />
          <Select.Content {...currentType.selectContentProps}>
            {currentType.selectItems ?? <SelectItemWhenEmpty />}
          </Select.Content>
        </Select.Root>
      );
    }

    return null;
  }, [currentType, searched, selected, value, onChange]);

  return (
    <Flex>
      <Select.Root
        {...selectProps}
        value={selected}
        onValueChange={(value) => {
          setSelected(value);
        }}
      >
        <Select.Trigger className={clsx(
          ":uno: rounded-r-none min-w-22 focus-z-1",
          selectProps?.className,
        )}
        />
        <Select.Content {...selectContentProps}>
          {selectItems ?? <SelectItemWhenEmpty />}
        </Select.Content>
      </Select.Root>

      {inputNode}

      <Button variant="surface" className="rounded-l-none focus-z-1">
        <IconTablerSearch />
      </Button>
    </Flex>
  );
}
