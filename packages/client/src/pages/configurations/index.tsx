import type { FormikProps } from "formik";

import apis from "@/apis";
import { configurationSchema, type ConfigurationSchemaType } from "@/apis/schema";
import { Button, Flex, ScrollArea, Spinner } from "@radix-ui/themes";
import { useAsync, useMountEffect } from "@react-hookz/web";
import IconTablerDeviceFloppy from "~icons/tabler/device-floppy";
import clsx from "clsx";
import consola from "consola";
import { Formik } from "formik";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import BasicForm from "./form/basic";

export default function Configurations() {
  const { t } = useTranslation();
  const formRef = useRef<FormikProps<ConfigurationSchemaType | object>>(null);

  const $config = useAsync<ConfigurationSchemaType>(async () => {
    const config = await apis.getConfig({ headers: { Accept: "application/toml" } });
    config.metadatas && (config.metadatas = Object.entries(config.metadatas));
    return config;
  }, {});

  const loading = useMemo(() => $config[0].status === "loading" || $config[0].status === "not-executed", [$config]);

  useMountEffect(() => {
    $config[1].execute().then((data) => {
      formRef.current?.setValues(data);
    });
  });

  return (
    <div className=":uno: h-full w-full px-3 pt-2 pb-4 mx-a min-w-2xl max-w-5xl box-border">
      <Spinner loading={loading} size="3">
        <ScrollArea className={clsx(":uno: h-full", { ":uno: max-h-36": loading })}>
          <div className=":uno: pos-absolute z-2 top-0 left-0 w-[calc(100%-8px)] bg-gradient-to-t from-transparent to-white h-4" />

          <Formik
            innerRef={formRef}
            initialValues={$config[0].result}
            onSubmit={(values) => {
              const parsed = configurationSchema.parse(values);
              consola.debug(parsed);
            }}
          >
            {({ handleSubmit, touched }) => (
              <form
                onSubmit={(evt) => {
                  handleSubmit(evt);
                }}
                autoComplete="off"
                className=":uno: w-3/5 pos-relative px-1 box-border"
              >

                <BasicForm />

                <Flex
                  gap="3"
                  justify="end"
                  className={clsx(
                    ":uno: pos-sticky pt-4 pb-1 px-6 bottom-0 left-0 w-5/3 bg-[--color-background] mt-6",
                    ":uno: after:(content-empty pos-absolute top--6 left-0 h-6 w-full bg-gradient-to-b from-transparent to-white)",
                  )}
                >
                  <Button variant="solid" type="submit" disabled={!Object.keys(touched).length}>
                    <IconTablerDeviceFloppy />
                    {t("formatting.upper_first", { value: t("save") })}
                  </Button>
                </Flex>
              </form>
            )}
          </Formik>
        </ScrollArea>
      </Spinner>
    </div>
  );
}
