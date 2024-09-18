import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { convertTsxToJsx } from './transform-js'

export function getWriteComponentPath(componentName: string) {
    const uiFolder = getUIFolderPath()
    return path.join(uiFolder, `${componentName}.tsx`)
}

export function getUIFolderPath() {
    const configFile = 'cleon.json'
    if (fs.existsSync(configFile)) {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
        return config.ui
    } else {
        throw new Error('Configuration file cleon.json not found. Please run the init command first.')
    }
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
        const component = getProjectType() === 'Next.js' ? content : content.replace("'use client'\n\n", '')
        if (isTsx()) {
            fs.writeFileSync(writePath, component)
        } else {
            fs.writeFileSync(writePath, component, 'utf8')
        }
    } catch (error: any) {
        console.error(chalk.red(`Error writing component to ${writePath}: ${error.message}`))
    }
}

export function WriteExports() {
    const UIFolder = getUIFolderPath()
    const allComponentsInUIFolder = fs.readdirSync(UIFolder)
    const exports = allComponentsInUIFolder
        .filter((componentName) => !componentName.endsWith('.ts'))
        .map((componentName) => `export * from './${componentName.replace('.tsx', '')}';`)
        .join('\n')
    const indexFilePath = path.join(UIFolder, 'index.ts')
    fs.writeFileSync(indexFilePath, exports)
    console.log(chalk.green(`✔ ${allComponentsInUIFolder.length - 1} components added to index.ts`))
}

export async function transformTsxToJsx() {
    const UIFolder = getUIFolderPath()
    const ComponentsFolder = path.join('..', UIFolder)
    if (!fs.existsSync(UIFolder)) {
        throw new Error('Folder does not exist')
    }
    console.log(chalk.gray('Converting tsx files to jsx...'))
    await convertTsxToJsx(ComponentsFolder, ComponentsFolder)
    await convertTsxToJsx(UIFolder, UIFolder)
        .then(() => {
            console.log(chalk.green('✔ Tsx files converted to Jsx'))
        })
        .finally(() => {
            fs.readdir(ComponentsFolder, (err, files) => {
                if (err) throw err
                for (const file of files) {
                    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                        fs.unlink(path.join(ComponentsFolder, file), (err) => {
                            if (err) throw err
                        })
                    }
                }
            })
            fs.readdir(UIFolder, (err, files) => {
                if (err) throw err
                for (const file of files) {
                    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                        fs.unlink(path.join(UIFolder, file), (err) => {
                            if (err) throw err
                        })
                    }
                }
            })
        })
        .catch((error) => {
            console.error(chalk.red(error.message))
        })
}
