import { execa } from 'execa'
import { glob } from 'glob'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import * as prettier from 'prettier'

const require = createRequire(import.meta.url)
const TEXT_TO_REPLACE: string = '// COMMENT-TO-REPLACE'
async function removeComments(filePaths: any[]): Promise<void[]> {
    return Promise.all(
        filePaths.map(async (file: fs.PathLike | fsPromises.FileHandle) => {
            try {
                let content = await fsPromises.readFile(file, 'utf8')
                content = content
                    .split('\n')
                    .map((line) => (line.trim() === TEXT_TO_REPLACE ? '' : line))
                    .join('\n')
                await fsPromises.writeFile(file, content)
            } catch (error: any) {
                console.error(`${error.message}`)
            }
        }),
    )
}

async function addComments(filePaths: any[]): Promise<void[]> {
    return Promise.all(
        filePaths.map(async (file) => {
            let content = await fsPromises.readFile(file, 'utf8')
            content = content
                .split('\n')
                .map((line) => (line.trim() === '' ? TEXT_TO_REPLACE : line))
                .join('\n')
            await fsPromises.writeFile(file, content)
        }),
    )
}

async function getFilePaths(srcDir: string, pattern: string): Promise<string[]> {
    return glob(path.join(srcDir, pattern), {
        ignore: path.join(srcDir, `/node_modules/**`),
    })
}

async function preetify(filePaths: string[]) {
    try {
        const promises = filePaths.map(async (filePath) => {
            const text = await fsPromises.readFile(filePath, 'utf8')
            const options = await prettier.resolveConfig(filePath)
            const formatted = await prettier.format(text, options ?? { parser: 'babel' })
            await fsPromises.writeFile(filePath, formatted)
        })
        await Promise.all(promises)
    } catch (err) {}
}

export async function convertTsxToJsx(srcDir: string, dstDir: string): Promise<void> {
    try {
        if (!fs.existsSync(srcDir)) throw new Error('Source directory does not exist.')
        const tsxFiles = await getFilePaths(srcDir, `/**/*.{ts,tsx}`)
        await addComments(tsxFiles)
        const srcFiles = await glob(path.join(srcDir, '/**/*.{ts,tsx}'))
        try {
            if (srcFiles.length > 0) {
                const tscPath = require.resolve('typescript/lib/tsc')
                const command = [
                    'node',
                    tscPath,
                    '--jsx',
                    'preserve',
                    '-t',
                    'esnext',
                    '--outDir',
                    dstDir,
                    '--noEmit',
                    'false',
                    ...srcFiles,
                ]
                await execa(command[0], command.slice(1), { stdout: 'ignore', stderr: 'ignore' })
            }
        } catch (error) {
            // console.error(error)
        }
        const jsxFiles = await getFilePaths(dstDir, `/**/*.{js,jsx}`)
        await removeComments([...tsxFiles, ...jsxFiles])
        // Run prettier on javascript files
        await preetify(jsxFiles)
    } catch (error: any) {
        console.error(`${error.message}`)
    }
}
