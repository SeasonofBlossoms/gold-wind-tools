import { parallel, series } from "gulp"
import { buildFullEntry, } from "./full-bundle.ts"
import { buildModules } from './modules.ts'
import { buildTypes } from './build-types.ts'
import { copyTypes } from './copy-types.ts'
import { clean } from './clean.ts'
import { copyFiles } from './copy-files.ts'
const buildTask = series(clean, parallel(buildFullEntry, buildModules, buildTypes), copyTypes, copyFiles)
// 导出两种接口
export const buildAsync = () => new Promise<void>((resolve, reject) => {
    buildTask((err) => err ? reject(err) : resolve())
})

export default buildAsync