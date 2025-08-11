import { rollup } from 'rollup';
import type { RollupOptions } from 'rollup';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { getProjectPath, } from './utils/path.ts'
const inputOptions: RollupOptions = {
    // 修正：排除所有 node_modules 和虚拟模块
    external: (id) =>
        /node_modules/.test(id) ||
        id.includes('virtual:'),

    input: getProjectPath('components/index.ts'),
    plugins: [
        resolve({
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'], // 增加 .json 扩展名
            mainFields: ['module', 'main', 'browser'],
        }),
        commonjs({
            include: /node_modules/,
            requireReturnsDefault: 'auto',
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'runtime', // 改为 runtime 模式
            presets: [
                '@babel/preset-typescript',
                [
                    '@babel/preset-react',
                    {
                        runtime: 'automatic', // 确保 JSX 自动转换
                        importSource: 'react', // 明确指定导入源 (可选但推荐)
                    },
                ],
            ],
            plugins: [['@babel/plugin-transform-runtime']], // 新增插件
            extensions: ['.ts', '.tsx'],
        }),
    ],
};

// 构建函数优化
export async function buildModules () {
    let bundle;
    try {
        console.log(`📦 正在打包es/lib模块...`);
        bundle = await rollup(inputOptions);
        await bundle.write({
            preserveModulesRoot: getProjectPath('components'),
            exports: "named",
            format: "esm",
            dir: getProjectPath('dist/es'),
            preserveModules: true,
            entryFileNames: `[name].mjs`,
        });
        await bundle.write({
            preserveModulesRoot: getProjectPath('components'),
            exports: "named",
            format: "cjs",
            dir: getProjectPath('dist/lib'),
            preserveModules: true,
            entryFileNames: `[name].js`,
        });
        return; // 明确返回（可选）
    } catch (error) {
        console.error('❌ 打包es/lib模块失败:', error);
        throw error; // 抛出错误让 Gulp 捕获
    } finally {
        if (bundle) {
            await bundle.close();
        }
    }
}
