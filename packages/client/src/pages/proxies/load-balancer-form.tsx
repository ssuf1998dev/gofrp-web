import Form from "@/components/form";
import { Flex } from "@radix-ui/themes";
import IconTablerLoadBalancer from "~icons/tabler/load-balancer";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function LoadBalancerForm() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<{ _: { loadBalancerEnable: boolean } }>();
  const { loadBalancerEnable } = values?._ ?? {};

  return (
    <Flex direction="column" gap="3">
      <Form.Switch
        name="_.loadBalancerEnable"
        label={t("formatting.upper_first", { value: t("enable") })}
        onCheckedChange={(value) => {
          !value && setFieldValue("loadBalancer", undefined);
        }}
      />

      {loadBalancerEnable
        ? (
            <>
              <Form.TextField
                name="loadBalancer.group"
                label={t("formatting.upper_first", { value: t("lb_group_name") })}
                required
              />
              <Form.TextField
                name="loadBalancer.groupKey"
                label={t("formatting.upper_first", { value: t("lb_group_key") })}
                type="password"
              />
            </>
          )
        : <IconTablerLoadBalancer data-accent-color="gray" className=":uno: color-[--accent-3] text-16 mx-a" />}
    </Flex>
  );
}
