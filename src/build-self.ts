import { rollup } from 'rollup';
import babel from '@rollup/plugin-babel';
import path from 'path';
import copy from 'rollup-plugin-copy';
import { builtinModules } from 'module';
import fs from 'fs';
import { promisify } from 'util';

const rm = promisify(fs.rm);

async function build () {
    const distPath = path.resolve(__dirname, '../dist');

    // 判断 dist 目录是否存在，如果存在则删除
    if (fs.existsSync(distPath)) {
        try {
            await rm(distPath, { recursive: true, force: true });
        } catch (error) {
            console.error('❌ 删除失败:', error);
        }
    }
    let bundle
    try {
        bundle = await rollup({
            // 自动包含所有 Node.js 内置模块
            external: [
                ...builtinModules,
                // 添加其他第三方依赖
                'gulp', 'rollup', '@rollup/plugin-babel',
                '@rollup/plugin-node-resolve', '@rollup/plugin-commonjs',
                'rollup-plugin-dts'
            ],
            input: path.resolve(__dirname, '../cli/index.ts'),
            plugins: [
                babel({
                    exclude: 'node_modules/**',
                    babelHelpers: 'bundled',
                    presets: ['@babel/preset-typescript'],
                    extensions: ['.ts'],
                }),
                copy({
                    targets: [
                        { src: 'bin/**', dest: 'dist/bin' },
                        // { src: 'package.json', dest: 'dist' }
                    ]
                })
            ],
        });
        await bundle.write({
            preserveModulesRoot: path.resolve(__dirname, './'),
            dir: path.resolve(__dirname, '../dist/lib'),
            exports: 'named',
            format: 'cjs',
            preserveModules: true,
            entryFileNames: '[name].js',
        });
        console.log('✅ tools打包成功');
        return
    } catch (error) {
        console.log('✅ tools打包失败', error);
        throw error;
    } finally {
        if (bundle) {
            await bundle.close();
        }
    }
}

build();
