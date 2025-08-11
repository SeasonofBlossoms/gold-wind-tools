import { copyFile } from "fs/promises";
import { getProjectPath } from './utils/path.ts';

export const copyFiles = () =>
    copyFile(getProjectPath("package.json"), getProjectPath("dist/package.json")); 
