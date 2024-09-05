import { getPackageManager } from '@/src/utils/get-package-manager'
import { input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import { spawn } from 'child_process'
import fs from 'fs'
import fetch from 'node-fetch'
import ora from 'ora'
import path from 'path'
import { fileURLToPath } from 'url'
// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Adjust the path to reference the correct resource directory relative to the compiled output
const resourceDir = path.resolve(__dirname, '../src/resources')
const stubs = path.resolve(__dirname, '../src/resources/stubs')
const utilsFile = path.resolve(__dirname, '../src/resources/utils.ts')

export async function init() {
    const cssPath = {
        laravel: 'resources/css/app.css',
        vite: 'src/index.css',
        nextHasSrc: 'src/app/globals.css',
        nextNoSrc: 'app/globals.css',
        other: 'styles/app.css',
    }

    // Check if either tailwind.config.ts or tailwind.config.js exists
    const configJsExists = fs.existsSync('tailwind.config.js')
    const configTsExists = fs.existsSync('tailwind.config.ts')

    if (!configJsExists && !configTsExists) {
        console.error(
            'No Tailwind configuration file found. Please ensure tailwind.config.ts exists in the root directory.',
        )
        return
    }

    const projectType = await select({
        message: 'Select the project type:',
        choices: [
            { name: 'Next.js', value: 'Next.js' },
            { name: 'Laravel', value: 'Laravel' },
            { name: 'Vite', value: 'Vite' },
            { name: 'Other', value: 'Other' },
        ],
    })
    let componentsFolder, uiFolder, cssLocation, configSourcePath, themeProvider, providers, libFolder

    if (projectType === 'Laravel') {
        componentsFolder = 'resources/js/components'
        uiFolder = path.join(componentsFolder, 'ui')
        libFolder = 'resources/js/lib'
        cssLocation = cssPath.laravel
        configSourcePath = path.join(stubs, 'laravel/tailwind.config.laravel.stub')
        themeProvider = path.join(stubs, 'laravel/theme-provider.stub')
        providers = path.join(stubs, 'laravel/providers.stub')
    } else if (projectType === 'Vite') {
        componentsFolder = 'src/components'
        uiFolder = path.join(componentsFolder, 'ui')
        libFolder = 'src/lib'
        cssLocation = cssPath.vite
        configSourcePath = path.join(stubs, 'vite/tailwind.config.vite.stub')
        themeProvider = path.join(stubs, 'vite/theme-provider.stub')
    } else if (projectType === 'Next.js') {
        const projectTypeSrc = await select({
            message: 'Does this project have a src directory?',
            choices: [
                { name: 'Yes', value: true },
                { name: 'No', value: false },
            ],
            default: false,
        })
        const hasSrc = projectTypeSrc ? 'src' : ''
        componentsFolder = path.join(hasSrc, 'components')
        uiFolder = path.join(componentsFolder, 'ui')
        libFolder = path.join(hasSrc, 'lib')
        cssLocation = projectTypeSrc ? cssPath.nextHasSrc : cssPath.nextNoSrc
        configSourcePath = path.join(stubs, 'next/tailwind.config.next.stub')
        themeProvider = path.join(stubs, 'next/theme-provider.stub')
        providers = path.join(stubs, 'next/providers.stub')
    } else {
        componentsFolder = await input({
            message: 'Enter the path to your components folder:',
            default: 'components',
        })
        uiFolder = path.join(componentsFolder, 'ui')
        libFolder = await input({
            message: 'Enter the path to your lib folder:',
            default: 'lib',
        })
        cssLocation = await input({
            message: 'Where would you like to place the CSS file?',
            default: cssPath.other,
        })
        configSourcePath = path.join(stubs, 'next/tailwind.config.next.stub')
        themeProvider = path.join(stubs, 'next/theme-provider.stub')
        providers = path.join(stubs, 'next/providers.stub')
    }

    const spinner = ora(`Initializing Cleon...`).start()

    // Ensure the components and UI folders exist
    if (!fs.existsSync(uiFolder)) {
        fs.mkdirSync(uiFolder, { recursive: true })
        spinner.succeed(`Created UI folder at ${uiFolder}`)
    } else {
        spinner.succeed(`UI folder already exists at ${uiFolder}`)
    }

    // Handle CSS file placement (always overwrite)
    const cssSourcePath = path.join(resourceDir, 'tailwind-css/app.css')
    if (!fs.existsSync(path.dirname(cssLocation))) {
        fs.mkdirSync(path.dirname(cssLocation), { recursive: true })
        spinner.succeed(`Created directory for CSS at ${chalk.blue(path.dirname(cssLocation))}`)
    }
    if (fs.existsSync(cssSourcePath)) {
        try {
            const cssContent = fs.readFileSync(cssSourcePath, 'utf8')
            fs.writeFileSync(cssLocation, cssContent, { flag: 'w' })
            spinner.succeed(`CSS file copied to ${cssLocation}`)
        } catch (error) {
            // @ts-ignore
            spinner.fail(`Failed to write CSS file to ${cssLocation}: ${error.message}`)
        }
    } else {
        spinner.warn(`Source CSS file does not exist at ${cssSourcePath}`)
    }

    // Determine the target Tailwind config file based on existing files
    const tailwindConfigTarget = fs.existsSync('tailwind.config.js') ? 'tailwind.config.js' : 'tailwind.config.ts'

    // Check if the config source path exists
    if (!fs.existsSync(configSourcePath)) {
        spinner.warn(chalk.yellow(`Source Tailwind config file does not exist at ${configSourcePath}`))
        return
    }

    // Copy Tailwind configuration content (always overwrite)
    try {
        const tailwindConfigContent = fs.readFileSync(configSourcePath, 'utf8')
        fs.writeFileSync(tailwindConfigTarget, tailwindConfigContent, { flag: 'w' }) // Overwrite the existing Tailwind config
    } catch (error) {
        // @ts-ignore
        spinner.fail(`Failed to write Tailwind config to ${tailwindConfigTarget}: ${error.message}`)
    }

    const packageManager = await getPackageManager()
    const packages = [
        'react-aria-components',
        'tailwindcss-react-aria-components',
        'tailwind-variants',
        'tailwind-merge',
        'clsx',
        'cleon-icons',
        'tailwindcss-animate',
    ]
        .map((component) => component)
        .join(' ')

    const action = packageManager === 'npm' ? 'i ' : 'add '
    const installCommand = `${packageManager} ${action} ${packages}`

    spinner.info(`Installing dependencies...`)
    const child = spawn(installCommand, {
        stdio: 'inherit',
        shell: true,
    })
    await new Promise<void>((resolve) => {
        child.on('close', () => {
            resolve()
        })
    })
    const fileUrl = utilsFile
    const response = await fetch(fileUrl)
    const fileContent = await response.text()
    fs.writeFileSync(path.join(libFolder, 'utils.ts'), fileContent, { flag: 'w' })
    spinner.succeed(`utils file copied to ${libFolder}`)

    // Copy theme provider and providers files
    if (themeProvider) {
        const themeProviderContent = fs.readFileSync(themeProvider, 'utf8')
        fs.writeFileSync(path.join(componentsFolder, 'theme-provider.tsx'), themeProviderContent, { flag: 'w' })

        if (providers) {
            const providersContent = fs.readFileSync(providers, 'utf8')
            fs.writeFileSync(path.join(componentsFolder, 'providers.tsx'), providersContent, { flag: 'w' })
        }

        spinner.succeed(`Theme provider and providers files copied to ${componentsFolder}`)
    }

    // Save configuration to cleon.json with relative path
    if (fs.existsSync('cleon.json')) {
        fs.unlinkSync('cleon.json')
    }

    // Save configuration to 'cleon.json'
    const config = {
        $schema: 'https://cleon-ui.vercel.app',
        ui: uiFolder,
    }
    fs.writeFileSync('cleon.json', JSON.stringify(config, null, 2))
    spinner.succeed('Configuration saved to cleon.json')

    // Wait for the installation to complete before proceeding
    spinner.succeed('Installation complete.')

    const continuedToAddComponent = spawn('npx cleon@latest add', {
        stdio: 'inherit',
        shell: true,
    })
    await new Promise<void>((resolve) => {
        continuedToAddComponent.on('close', () => {
            resolve()
        })
    })

    console.log(chalk.blueBright('========================='))
    console.log('||   Happy coding! 🔥  ||')
    console.log(chalk.blueBright('========================='))

    spinner.stop()
}
