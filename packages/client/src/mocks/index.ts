export default async () => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { default: worker } = await import("./worker");
  return worker.start({ quiet: true, onUnhandledRequest: "bypass" });
};
