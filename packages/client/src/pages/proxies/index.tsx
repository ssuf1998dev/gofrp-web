import { useAsync, useMountEffect } from "@react-hookz/web";

import apis from "../../apis";

export default function Proxies() {
  const $list = useAsync(async () => {
    const status = await apis.getStatus();
    console.warn(status);
  });

  useMountEffect(() => {
    $list[1].execute();
  });

  return <div>proxies</div>;
}
