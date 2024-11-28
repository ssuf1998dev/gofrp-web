import Form from "@/components/form";
import { Flex, Heading } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function BasicForm() {
  const { t } = useTranslation();

  return (
    <div>
      <Heading size="4" id="configuration.basic">
        {t("formatting.upper_first", { value: t("basic") })}
      </Heading>
      <Flex direction="column" gap="3">
        <Form.TextField
          name="user"
          label={t("formatting.upper_first", { value: t("username") })}
          autoFocus
        />
        <Form.TextField
          name="serverAddr"
          label={t("formatting.upper_first", { value: t("server_addr") })}
        />
        <Form.TextField
          name="serverPort"
          label={t("formatting.upper_first", { value: t("server_port") })}
          type="number"
          min={0}
          max={65535}
        />
        <Form.TextField
          name="natHoleStunServer"
          label={t("formatting.upper_first", { value: t("hole_punching_server") })}
        />
        <Form.TextField
          name="dnsServer"
          label={t("dns")}
        />
        <Form.Switch
          name="loginFailExit"
          label={t("formatting.upper_first", { value: t("login_failed_exit_immediately") })}
        />
        <Form.List
          name="start"
          label={t("formatting.upper_first", { value: t("starting_proxies") })}
        />
        <Form.TextField
          name="udpPacketSize"
          label={t("formatting.upper_first", { value: t("max_udp_packet_size") })}
          type="number"
          min={0}
        />
        <Form.Entries
          name="metadatas"
          label={t("formatting.upper_first", { value: t("metadata") })}
          tooltip={t("help.metadata")}
        />
        <Form.List
          name="includes"
          label={t("formatting.upper_first", { value: t("extra_conf_dir") })}
        />
      </Flex>
    </div>

  );
}
