import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',

  // publicPath: '/v1/AUTH_channel-SCS-CCS-CORE/sf-js-tree/',
  themeConfig: {
    name: 'js-tree',
  },
  jsMinifier: 'esbuild',
  jsMinifierOptions: {
    drop: ['console', 'debugger'],
  },
  // extraBabelPlugins: ['transform-remove-console'],
});
