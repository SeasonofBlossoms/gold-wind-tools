import { promises as fs } from 'fs';
import path from 'path';
import { getProjectPath } from './utils/path.ts';

export async function copyTypes () {
    const typesDir = getProjectPath('types/components');
    const distDirs = ['dist/es', 'dist/lib'];
    let totalFiles = 0;
    let copiedFiles = 0;

    // 改进的递归复制函数
    const copyDir = async (src: string, dest: string) => {
        await fs.mkdir(dest, { recursive: true });
        const files = await fs.readdir(src);

        for (const file of files) {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            const stats = await fs.stat(srcPath);

            if (stats.isDirectory()) {
                await copyDir(srcPath, destPath);
            } else {
                // 只复制类型声明文件
                if (path.extname(file) === '.ts') {
                    totalFiles++;
                    // 检查文件是否需要更新
                    try {
                        const destStats = await fs.stat(destPath);
                        if (destStats.mtimeMs >= stats.mtimeMs) {
                            continue; // 跳过未修改的文件
                        }
                    } catch {
                        // 目标文件不存在，需要复制
                    }

                    await fs.copyFile(srcPath, destPath);
                    copiedFiles++;
                }
            }
        }
    };

    try {
        console.log('📁 开始复制类型文件...');
        for (const dir of distDirs) {
            await copyDir(typesDir, getProjectPath(dir));
        }
        await fs.access(typesDir);
        await fs.rm(typesDir, { recursive: true, force: true });
    } catch (error) {
        console.error('❌ 复制类型文件失败:', error);
        throw error;
    }
}