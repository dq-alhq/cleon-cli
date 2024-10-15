import { spawn } from 'child_process'
import ora from 'ora'

export const additionalDeps = async (componentName: string, packageManager: string, action: string) => {
    const dependencies: Record<string, string> = {
        toaster: 'sonner',
        drawer: 'framer-motion',
        accordion: 'framer-motion',
        tabs: 'framer-motion',
        progress: 'framer-motion',
        meter: 'framer-motion',
        'input-otp': 'input-otp',
        charts: 'recharts recharts@alpha',
        carousel: 'embla-carousel-react embla-carousel-autoplay',
        command: 'cmdk',
        'multi-select': 'react-aria react-stately',
        'rich-text-field':
            '@tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-subscript @tiptap/extension-superscript @tiptap/extension-task-item @tiptap/extension-task-list @tiptap/extension-text-align @tiptap/extension-text-style @tiptap/extension-typography @tiptap/extension-underline',
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
