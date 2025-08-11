import buildAsync from '../src/gulpfile.ts'

async function executeBuild () {
    console.time('构建耗时')
    try {
        await buildAsync()
        console.log('🎉 构建成功!')
    } catch (error) {
        console.error('🔥 构建失败:', error)
    } finally {
        console.timeEnd('构建耗时')
    }
}

// 执行构建
executeBuild()
const argv = process.argv.slice(2)
console.log('argv', argv,)
/* function runTask (toRun: string): void {

}

runTask(argv._[1]); */