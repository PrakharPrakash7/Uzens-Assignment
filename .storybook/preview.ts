import type { Preview } from "@storybook/react";
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Disable unnecessary toolbar features
    toolbar: {
      zoom: { hidden: true },
      eject: { hidden: true },
      copy: { hidden: true },
      fullscreen: { hidden: true },
      remount: { hidden: true },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f4f4f5',
        },
        {
          name: 'dark',
          value: '#18181b',
        },
      ],
    },
  },
};

export default preview;
