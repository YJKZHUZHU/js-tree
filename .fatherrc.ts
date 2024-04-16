import { defineConfig } from 'father';

// more father config: https://github.com/umijs/father/blob/master/docs/config.md
export default defineConfig({
  esm: { output: 'dist', ignores: ['src/Tree/test.json'] },
  // plugins: ['transform-remove-console'],
});
