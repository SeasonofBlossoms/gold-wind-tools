import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

import { getProjectPath } from './utils/path.ts';

const TSCONFIG_PATH = getProjectPath('tsconfig.json');
const outDir = getProjectPath('types');

export const buildTypes = async () => {
    try {
        // 确保输出目录存在
        const fs = await import('fs');
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const command = `tsc --project ${TSCONFIG_PATH} --declaration --emitDeclarationOnly --skipLibCheck --outDir ${outDir}`;

        console.log(`📦 正在生成类型声明文件...`);
        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
            console.warn('⚠️  警告信息:', stderr);
        }
    } catch (error) {
        console.error('❌ 生成类型定义文件时出错:', error.message);
        throw new Error('生成类型定义文件失败');
    }
};

// 如果直接运行此文件
if (require.main === module) {
    buildTypes();
}