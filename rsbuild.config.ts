import { GenerateSW } from '@aaroon/workbox-rspack-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { envConfig } from './src/helpers/constants/env-config';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
          generatedRouteTree: 'src/route-tree.gen.ts',
          routeFileIgnorePrefix: '___',
        }),
        envConfig.bunEnv === 'production' && new GenerateSW({}),
      ],
    },
  },
  html: {
    template: 'public/index.html',
    title: 'thinhphoenix/react',
  },
  server: {
    port: envConfig.port,
    base: envConfig.base,
    historyApiFallback: true,
  },
  dev: {
    progressBar: true,
  },
});
