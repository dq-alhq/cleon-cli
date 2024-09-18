import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { transformTsxToJsx } from './transform-jsx'

export function getUIFolderPath() {
    const configFile = 'cleon.json'
    if (fs.existsSync(configFile)) {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
        return config.ui
    } else {
        throw new Error('Configuration file cleon.json not found. Please run the init command first.')
    }
}

export function getWriteComponentPath(componentName: string) {
    const uiFolder = getUIFolderPath()
    return path.join(uiFolder, `${componentName}.tsx`)
}

export function getProjectType() {
    const configFile = 'cleon.json'
    if (fs.existsSync(configFile)) {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
        return config.project
    } else {
        throw new Error('Configuration file cleon.json not found. Please run the init command first.')
    }
}

export function isTsx() {
    const configFile = 'cleon.json'
    if (fs.existsSync(configFile)) {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
        return config.tsx
    } else {
        throw new Error('Configuration file cleon.json not found. Please run the init command first.')
    }
}

export async function writeFile(description: string, url: string, writePath: string) {
    try {
        const response = await fetch(url)
        const content = await response.text()

        const component = isTsx() ? content : await transformTsxToJsx({ content, writePath })

        const result = getProjectType() === 'Next.js' ? component : component.replace("'use client'\n\n", '')

        if (!isTsx()) {
            writePath = writePath.replace(/\.tsx$/, '.jsx')
            writePath = writePath.replace(/\.ts$/, '.js')
        }

        fs.writeFileSync(writePath, result)
    } catch (error: any) {
        console.error(chalk.red(`Error writing component to ${writePath}: ${error.message}`))
    }
}

export function WriteExports() {
    const UIFolder = getUIFolderPath()
    const allComponentsInUIFolder = fs.readdirSync(UIFolder)
    const exports = allComponentsInUIFolder
        .filter((componentName) => !componentName.endsWith('.ts'))
        .map((componentName) => `export * from './${componentName.replace('.tsx', '').replace('.jsx', '')}';`)
        .join('\n')
    const indexFilePath = isTsx() ? path.join(UIFolder, 'index.ts') : path.join(UIFolder, 'index.js')
    fs.writeFileSync(indexFilePath, exports)
    console.log(chalk.green(`✔ ${allComponentsInUIFolder.length - 1} components added to index`))
}
