import type { FieldMetaProps } from "formik";

import { Text } from "@radix-ui/themes";

export default function FormErrors(props: FieldMetaProps<unknown>) {
  const { error, touched } = props;
  const gotError = error?.length && touched;

  return gotError
    ? (
        <div>
          {([error].flat().filter(Boolean) as string[]).map(
            item => <Text key={item} size="1" color="red">{item}</Text>,
          )}
        </div>
      )
    : null;
}
