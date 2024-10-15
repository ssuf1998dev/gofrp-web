import { Button, Layout, Space, Tabs, Typography } from "antd";
import { upperFirst } from "lodash-es";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useMatches, useNavigate } from "react-router-dom";

export default function App() {
  const { t } = useTranslation();
  const matches = useMatches();
  const currentMatch = useMemo(() => matches.at(-1), [matches]);
  const nav = useNavigate();

  useEffect(() => {
    ["/"].includes(currentMatch?.pathname ?? "/") && nav("proxies", { replace: true });
  }, [currentMatch?.pathname, nav]);

  return (
    <Layout>
      <Layout.Header className=":uno: pos-sticky top-0 z-1 h-fit justify-between px-4 pt-4 pb-0 flex flex-col items-center line-height-none">
        <div className=":uno: flex justify-between w-full max-w-4xl mb-4 [&>*]:flex-shrink-0">
          <Space>
            <Typography.Text className=":uno: font-bold text-lg">
              {t("title")}
            </Typography.Text>
          </Space>
          <Space>
            <Button
              type="text"
              onClick={() => {
                window.open(t("documentation_url"), "_blank", "noopener,noreferrer");
              }}
            >
              {upperFirst(t("documentation"))}
            </Button>
          </Space>
        </div>

        <Tabs
          defaultActiveKey="proxies"
          items={[
            { key: "proxies", label: upperFirst(t("proxy", { count: 2 })) },
            { key: "configurations", label: upperFirst(t("configuration", { count: 2 })) },
          ]}
          className="max-w-4xl w-full [&_.ant-tabs-nav]:mb-0"
          onChange={(key) => {
            nav(key);
          }}
        >
        </Tabs>
      </Layout.Header>

      <Layout.Content className="max-w-4xl w-full mx-auto py-4 max-[56rem]:px-4">
        <Outlet></Outlet>
      </Layout.Content>
    </Layout>
  );
}
