import { rollup } from 'rollup';
import type { RollupOptions, OutputOptions } from 'rollup';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { getProjectPath, packageName } from './utils/path.ts'
const inputOptions: RollupOptions = {
    external: ['react', 'react-dom'], // 正确排除 React
    input: getProjectPath('components/index.ts'),
    plugins: [
        resolve({
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'], // 增加 .json 扩展名
            mainFields: ['module', 'main', 'browser'],
        }),
        commonjs({
            include: /node_modules/, // 明确处理 node_modules 中的 CJS
            requireReturnsDefault: 'auto', // 新增关键配置
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
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
            extensions: ['.ts', '.tsx'],
        }),
    ],
};

const outputOptions: OutputOptions = {
    file: getProjectPath('dist/index.full.js'),
    format: 'umd',
    globals: { react: 'React' }, // 全局变量名必须与 React 的 UMD 导出名一致
    name: packageName,
    exports: 'named',
};

// 构建函数优化
export async function buildFullEntry () {
    let bundle;
    try {
        console.log(`📦 正在打包umd...`);
        bundle = await rollup(inputOptions);
        await generateOutputs(bundle);
        return; // 明确返回（可选）
    } catch (error) {
        console.error('❌ 打包全量失败:', error);
        throw error; // 抛出错误让 Gulp 捕获
    } finally {
        if (bundle) {
            await bundle.close();
        }
    }
}

async function generateOutputs (bundle: any) {
    // 直接写入文件，无需单独调用 generate
    await bundle.write(outputOptions);
}