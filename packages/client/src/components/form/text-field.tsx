import { Text, TextField } from "@radix-ui/themes";
import clsx from "clsx";
import { useField } from "formik";

export default function FormTextField(props: TextField.RootProps & { name: string; label?: string }) {
  const { name, label, color, required } = props;
  const [field, meta] = useField(name);

  const gotError = meta.error?.length && meta.touched;

  return (
    <label className=":uno: flex flex-col gap-1">
      <Text
        size="2"
        className={clsx(
          ":uno: font-bold",
          { ":uno: before:content-[--form-required-indicator] before:mr-0.5 before-color-[--red-11]": required },
        )}
      >
        {label || name}
      </Text>
      <TextField.Root {...field} {...props} color={gotError ? "red" : color} required={false} />
      {gotError
        ? (
            <div>
              {([meta.error].flat().filter(Boolean) as string[]).map(
                error => <Text key={error} size="1" color="red">{error}</Text>,
              )}
            </div>
          )
        : null}
    </label>
  );
}
