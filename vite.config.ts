import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { VantResolve, createStyleImportPlugin } from 'vite-plugin-style-import';

import EslintPlugin from 'vite-plugin-eslint'
import DefineOptions from 'unplugin-vue-define-options/vite'

import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd())
    return {
        base: env.VITE_BASE_PATH,
        plugins: [
            vue(),
            Components({
                resolvers: [VantResolver()],
            }),
            createStyleImportPlugin({
                include: [ '.js', '.mjs', '.ts'],
                resolves: [VantResolve()],
            }),
            EslintPlugin({
                cache: false,
                include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
            }),
            DefineOptions()
        ],
        resolve: {
            alias: {
                "@": resolve(__dirname, 'src'), // 路径别名
            },
            extensions: ['.mjs', '.js',  '.json', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己 增减
        }
    }
})
