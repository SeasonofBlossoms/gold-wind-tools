import { promises as fs } from 'fs';
import { getProjectPath } from './utils/path.ts';

export async function clean () {
    try {
        const dirsToDelete = [
            getProjectPath('dist'),
            getProjectPath('types')
        ];

        // 循环删除每个目录
        for (const dir of dirsToDelete) {
            try {
                // 检查目录是否存在
                await fs.access(dir);
                // 目录存在，执行删除
                await fs.rm(dir, { recursive: true, force: true });

            } catch (error) {

            }
        }

    } catch (error) {
        console.error('❌ 删除文件夹失败:', error);
        throw error;
    }
}
