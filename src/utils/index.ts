import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

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

export async function writeFile(description: string, url: string, writePath: string) {
    try {
        const response = await fetch(url)
        const content = await response.text()
        fs.writeFileSync(writePath, content)
    } catch (error: any) {
        console.error(chalk.red(`Error writing component to ${writePath}: ${error.message}`))
    }
}
