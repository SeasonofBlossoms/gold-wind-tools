import path from 'path';
const cwd: string = process.cwd();
const isDependence = process.argv[1] == __filename//是独立运行还是作为项目依赖运行 
export const packageName = "gold-wind";
export const rootDir = cwd
export function getProjectPath (...filePath: string[]): string {
    return path.join(cwd, ...filePath);
} 