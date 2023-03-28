import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { babel } from '@rollup/plugin-babel';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const pathResolve = (dir: string) => resolve(__dirname, dir);

export default ({ command, mode }) => {
  // 获取环境变量
  const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd());

  return defineConfig({
    define: {
      'process.env': env,
    },
    resolve: {
      // 这里的alias是路径别名，是运行阶段的替换路径，而tsconfig.json中的paths是编码阶段的提示，
      alias: {
        '@': pathResolve('src'), // path.resolve中，'./src' 等于 'src'
        '@antv/x6': '@antv/x6/lib',
        '@antv/x6-vue-shape': '@antv/x6-vue-shape/lib',
      },
    },
    plugins: [
      vue(),
      // 默认会向 index.html 注入 .env 文件的内容，类似 vite 的 loadEnv函数
      // 还可配置entry入口文件， inject自定义注入数据等
      createHtmlPlugin(),
      // 自动导入src/compoents下的组件和配置的ui库组件
      // 只能在template中使用，js中需要手动导入
      // importStyle: false，关闭自动导入样式
      // 目前无法指定"src/compoents"下部分组件生产类型声明，可能需要自己实现一个resolvers

      // 自动导入api
      AutoImport({
        imports: ['vue', 'vue-router'],
        // 设置为在'src/'目录下生成解决ts报错，默认是当前目录('./'，即根目录)
        dts: 'src/auto-import.d.ts',
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true,
        },
      }),

      Components({
        resolvers: [ElementPlusResolver()],
      }),

      // 在 serve 环境时，如果需要解决低版本chrome可选链报错问题，就打开 babel 配置；如果需要 debug ，则注释掉 babel 配置
      // build 时 vite 会对文件进行转译以支持低版本浏览器，不影响
      /* babel({
              babelHelpers: 'bundled',
              plugins: ['@babel/plugin-proposal-optional-chaining'],
              include: [/\.vue$/, /\.ts$/],
              extensions: ['.vue', '.ts'],
            }), */
    ],
    server: {
      // port: 3000, // 默认 // vite3已改为默认5173
      host: true, // 支持从ip启动
      /* open: true,
            proxy: {
              '/api': {
                target: 'http://127.0.0.1:8000', // 后台服务地址
                changeOrigin: true, // 是否允许不同源
                secure: false, // 支持https
                rewrite: path => path.replace(/^\/api/, ''),
              },
            }, */
    },
    build: {
      outDir: 'dist', // 指定打包路径，默认为项目根目录下的 dist 目录
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
      // minify默认esbuild，esbuild模式下terserOptions将失效
      // vite3变化：Terser 现在是一个可选依赖，如果你使用的是 build.minify: 'terser'，你需要手动安装它 `npm add -D terser`
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: env.VITE_BUILD_DROP_CONSOLE === 'true', // 去除 console
          drop_debugger: true, // 去除 debugger
        },
      },
      chunkSizeWarningLimit: 1500, // chunk 大小警告的限制（以 kbs 为单位）
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${pathResolve('src/styles/index.less')}";`,
        },
      },
    },
  });
};
