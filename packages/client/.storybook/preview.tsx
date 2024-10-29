import type { Preview } from "@storybook/react";

import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "uno.css";

import "../src/locales";

export default {
  decorators: [
    Story => (
      <Theme>
        <Story />
      </Theme>
    ),
  ],
} satisfies Preview;
