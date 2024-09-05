import { getRepoUrlForComponent } from '@/src/utils/repo'
import { checkbox } from '@inquirer/prompts'
import chalk from 'chalk'
import fs from 'fs'
import ora from 'ora'
import path from 'path'
import { components, namespaces } from '../resources/components'
import { getWriteComponentPath, writeFile } from '../utils'
import { additionalDeps } from '../utils/additional-deps'
import { getPackageManager } from '../utils/get-package-manager'

async function createComponent(componentName: string) {
    const writePath = getWriteComponentPath(componentName)

    const dir = path.dirname(writePath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    const spinner = ora(`Creating ${componentName}...`).start()

    const url = getRepoUrlForComponent(componentName)
    try {
        await writeFile(`${componentName} created`, url, writePath)
        spinner.succeed(`${componentName} created`)
    } catch (error) {
        // @ts-ignore
        spinner.fail(`Error writing component to ${writePath}: ${error.message}`)
    }
}

async function processComponent(
    componentName: string,
    packageManager: string,
    action: string,
    processed: Set<string>,
    allComponents: any[],
    override: boolean,
) {
    const componentPath = getWriteComponentPath(componentName)
    if (fs.existsSync(componentPath)) {
        if (override) {
            console.log(`${chalk.yellow('Replacing')} ${componentName}...`)
            fs.rmSync(componentPath, { recursive: true, force: true })
        } else {
            console.warn(`${chalk.blue('ℹ')} ${componentName} already exists. Use the -o flag to override.`)
            return
        }
    }

    processed.add(componentName)

    if (!fs.existsSync(componentPath)) {
        await additionalDeps(componentName, packageManager, action)
        await createComponent(componentName)
    }

    const component = allComponents.find((c) => c.name === componentName)
    if (component && component.children) {
        for (const child of component.children) {
            await processComponent(child.name, packageManager, action, processed, allComponents, override)
        }
    }
}

export async function add(options: any) {
    const { component, skip, override } = options
    const configFilePath = path.join(process.cwd(), 'cleon.json')
    if (!fs.existsSync(configFilePath)) {
        console.error(
            `${chalk.red('cleon.json not found')}. ${chalk.gray(`Please run ${chalk.blue('npx cleon@latest init')} to initialize the project.`)}`,
        )
        return
    }

    const exclude = ['emoji-picker']
    let selectedComponents = component ? component.split(' ') : []
    if (selectedComponents.length === 0) {
        const choices = components
            .filter((comp) => !exclude.includes(comp.name))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((comp) => ({ name: comp.name, value: comp.name }))
        selectedComponents = await checkbox({
            required: true,
            message: 'Select components to add:',
            choices: choices,
            pageSize: 17,
            loop: false,
        })
    }

    const packageManager = await getPackageManager()
    const action = packageManager === 'npm' ? 'i ' : 'add '
    const targetComponent = components.find((comp) => comp.name === options.component)

    // Initialize a new set for each session
    const processed = new Set<string>()
    for (const componentName of selectedComponents) {
        const targetComponent = components.find((comp) => comp.name === componentName)
        if (!targetComponent) {
            console.log(chalk.yellow('No component found'))
            return
        }
        console.log(`Starting to add ${componentName}...`)

        if (namespaces.includes(componentName) && targetComponent.children) {
            // Only process the children of the component
            for (const child of targetComponent.children) {
                await processComponent(child.name, packageManager, action, processed, components, override)
            }
        } else {
            // Process the component and all its children
            await processComponent(componentName, packageManager, action, processed, components, override)
        }
    }
    console.log(chalk.green(`✔ All the components in ${options.component} have been added.`))
}
