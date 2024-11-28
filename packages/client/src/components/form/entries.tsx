import MainContext from "@/contexts/main";
import { Card, Flex, IconButton, Link as RadixLink, TextField } from "@radix-ui/themes";
import { useMediaQuery } from "@react-hookz/web";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import IconTablerPlus from "~icons/tabler/plus";
import IconTablerTrash from "~icons/tabler/trash";
import clsx from "clsx";
import { FieldArray, useField } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import FormErrors from "./errors";
import FormWrapper, { type FormWrapperProps } from "./wrapper";

interface InteractivelyProps {
  keyTextFieldProps?: TextField.RootProps;
  valueTextFieldProps?: TextField.RootProps;
  onEditDirectly?: () => void;
};
function FormEntriesInteractively(props: InteractivelyProps & FormWrapperProps) {
  const { t } = useTranslation();
  const { name, label, keyTextFieldProps, valueTextFieldProps, onEditDirectly } = props;
  const [field, meta, helper] = useField<string[][]>(name);

  const gotError = meta.error?.length && meta.touched;

  useEffect(() => {
    if (typeof field.value === "object" && !Array.isArray(field.value)) {
      helper.setValue(Object.entries(field.value));
    }
  }, [field.value, helper]);

  return (
    <FormWrapper {...props}>
      <FieldArray
        name={name}
        render={(helper) => {
          const rows = (field.value ?? [["", ""]]).map(([key, value], idx, { length }) => (
            // eslint-disable-next-line react/no-array-index-key
            <Flex key={idx} gap="2" align="center">
              <TextField.Root
                placeholder={t("formatting.upper_first", { value: t("key") })}
                {...keyTextFieldProps}
                value={key}
                onChange={(evt) => {
                  (field.value ??= [["", ""]])[idx][0] = evt.target.value;
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
                  (field.value ??= [["", ""]])[idx][1] = evt.target.value;
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
                  !field.value && field.onChange({ target: { value: [["", ""]], name } });
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
                  !field.value && field.onChange({ target: { value: [["", ""]], name } });
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

      <Flex justify="end" className=":uno: mt-2">
        <RadixLink
          href="javacript:void(0);"
          onClick={(evt) => {
            evt.preventDefault();
            onEditDirectly?.();
          }}
          size="1"
        >
          {t("formatting.sentence_case", { value: t("edit_entries_directly") })}
        </RadixLink>
      </Flex>

      <FormErrors name={name} label={label} />
    </FormWrapper>
  );
}

interface DirectlyProps {
  onEditInteractively?: () => void;
};
function FormEntriesDirectly(props: DirectlyProps & FormWrapperProps) {
  const { themeAppearance } = useContext(MainContext);
  const prefersDarkColorScheme = useMediaQuery("(prefers-color-scheme: dark)");

  const { t } = useTranslation();
  const { name, label, onEditInteractively } = props;
  const [field, meta, helper] = useField<string[][]>(name);

  const gotError = meta.error?.length && meta.touched;

  const theme = useMemo(() => {
    if (themeAppearance === "inherit") {
      return prefersDarkColorScheme ? githubDark : githubLight;
    }

    return themeAppearance === "dark" ? githubDark : githubLight;
  }, [prefersDarkColorScheme, themeAppearance]);

  const [innerValue, setInnerValue] = useState(
    (field.value ?? []).filter(entries => entries.every(Boolean)).map(entries => entries.join("=")).join("\n"),
  );

  return (
    <FormWrapper {...props}>
      <Card
        className={clsx(
          ":uno: p-0",
          ":uno: has-[.cm-focused]:after:(outline outline-[--focus-8] outline-2px) has-[.cm-focused]:(overflow-visible contain-unset)",
          { ":uno: has-[.cm-focused]:after:outline-[--accent-8]": gotError },
        )}
        data-accent-color={gotError ? "red" : ""}
      >
        <CodeMirror
          value={innerValue}
          onChange={(value) => {
            setInnerValue(value);

            const entries = value.split("\n").map((line) => {
              // eslint-disable-next-line regexp/no-misleading-capturing-group
              const matched = /([\s\S]+)=([\s\S]+)/.exec(line);
              return matched && [matched[1], matched[2]];
            });
            field.onChange({ target: { value: entries.filter(Boolean).length ? entries.filter(Boolean) : [["", ""]], name } });
            helper.setTouched(true, true);
          }}
          onBlur={() => {
            field.onBlur({ target: { name } });
          }}
          className=":uno: text-sm h-32 [&_.cm-focused]:outline-unset overflow-auto [&_.cm-editor]:h-full [&_.cm-content]:cursor-text"
          theme={theme}
          extensions={[]}
        />
      </Card>

      <Flex justify="end" className=":uno: mt-2">
        <RadixLink
          href="javacript:void(0);"
          onClick={(evt) => {
            evt.preventDefault();
            onEditInteractively?.();
          }}
          size="1"
        >
          {t("formatting.sentence_case", { value: t("edit_entries_interactively") })}
        </RadixLink>
      </Flex>

      <FormErrors name={name} label={label} />
    </FormWrapper>
  );
}

export default function FormEntries(props: InteractivelyProps & DirectlyProps & FormWrapperProps) {
  const [mode, setMode] = useState<"directly" | "interactively">("interactively");

  if (mode === "interactively") {
    return (
      <FormEntriesInteractively
        {...props}
        onEditDirectly={() => {
          setMode("directly");
        }}
      />
    );
  }

  if (mode === "directly") {
    return (
      <FormEntriesDirectly
        {...props}
        onEditInteractively={() => {
          setMode("interactively");
        }}
      />
    );
  }

  return null;
}
