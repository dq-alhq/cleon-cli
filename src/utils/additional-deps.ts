import { spawn } from 'child_process'
import ora from 'ora'

export const additionalDeps = async (componentName: string, packageManager: string, action: string) => {
    const dependencies: Record<string, string> = {
        toaster: 'sonner',
        drawer: 'framer-motion',
        accordion: 'framer-motion',
        tabs: 'framer-motion',
        'progress-bar': 'framer-motion',
        meter: 'framer-motion',
        form: 'react-hook-form @hookform/resolvers zod',
        'input-otp': 'input-otp',
        carousel: 'embla-carousel-react embla-carousel-autoplay',
        command: 'cmdk',
        'multi-select': 'react-aria react-stately',
    }

    const dependency = dependencies[componentName]

    if (dependency) {
        const spinner = ora(`Creating...`).start()
        const installCommand = `${packageManager} ${action} ${dependency}`
        const child = spawn(installCommand, {
            stdio: 'ignore',
            shell: true,
        })

        await new Promise<void>((resolve) => {
            child.on('close', () => {
                spinner.stop()
                resolve()
            })
        })
    }
}
