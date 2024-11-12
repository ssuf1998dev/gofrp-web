import { Callout, Spinner } from "@radix-ui/themes";
import { useMediaQuery } from "@react-hookz/web";
import IconTablerCircleCheck from "~icons/tabler/circle-check";
import IconTablerCircleX from "~icons/tabler/circle-x";
import IconTablerInfoCircle from "~icons/tabler/info-circle";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useToaster } from "react-hot-toast/headless";

const MontionCalloutRoot = motion.create(Callout.Root);

export default function Toast() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion)");

  return (
    <div
      className={clsx(
        ":uno: pos-fixed top-0 left-0 w-full p-6",
        ":uno: flex flex-col pointer-events-none justify-center items-center gap-4",
      )}
    >
      <LayoutGroup>
        {toasts.slice(0, 5)
          .map((toast) => {
            const message = typeof toast.message === "function" ? toast.message(toast) : toast.message;
            if (!message) {
              return null;
            }

            return (
              <AnimatePresence key={toast.id}>
                {toast.visible
                  ? (
                      <MontionCalloutRoot
                        {...toast.ariaProps}
                        className=":uno: bg-[--accent-2] shadow-[--shadow-3] pointer-events-auto w-fit"
                        size="1"
                        color={{ success: "green", error: "red", loading: "yellow", blank: "blue", custom: "blue" }[toast.type] as any}
                        initial={{ opacity: 0, translateY: -2, scale: 0.98 }}
                        animate={{ opacity: 1, translateY: 0, scale: 1 }}
                        exit={{ opacity: 0, translateY: -2, scale: 0.98 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.1 }}
                        layout={!prefersReducedMotion}
                        onMouseEnter={startPause}
                        onMouseLeave={endPause}
                      >
                        <Callout.Icon>
                          {{
                            success: <IconTablerCircleCheck />,
                            error: <IconTablerCircleX />,
                            loading: <Spinner />,
                            blank: <IconTablerInfoCircle />,
                            custom: null,
                          }[toast.type]}
                        </Callout.Icon>
                        <Callout.Text>{message}</Callout.Text>
                      </MontionCalloutRoot>
                    )
                  : null}
              </AnimatePresence>
            );
          })}
      </LayoutGroup>
    </div>
  );
}
