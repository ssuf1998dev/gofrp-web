import Form from "@/components/form";
import { Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function LoadBalancerForm() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="3">
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
    </Flex>
  );
}
