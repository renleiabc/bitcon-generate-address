import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteEslint from 'vite-plugin-eslint';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { vitePluginForArco } from '@arco-plugins/vite-react';
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  console.log('🚀 ~ file: vite.config.ts:6 ~ command:', command);
  console.log('🚀 ~ file: vite.config.ts:6 ~ mode:', mode);
  const boo = mode === 'development';
  console.log('🚀 ~ file: vite.config.ts:11 ~ defineConfig ~ boo:', boo);
  const alias = {
    '@': resolve(__dirname, './src')
  };
  return {
    plugins: [
      react(),
      wasm(),
      topLevelAwait(),
      viteEslint({
        //  failOnError: false
        include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.jsx', 'src/**/*.ts'],
        //  exclue: ['./node_modules/**'],
        cache: false
      }),
      vitePluginForArco()
    ],
    resolve: {
      alias
    },
    css: {
      devSourcemap: boo
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      open: true
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true
          }),
          NodeModulesPolyfillPlugin()
        ]
      }
    }
  };
});
