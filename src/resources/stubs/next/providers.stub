'use client'

import * as React from 'react'

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { useRouter } from 'next/navigation'
import { RouterProvider } from 'react-aria-components'
import { Toaster } from 'ui'

declare module 'react-aria-components' {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>
    }
}

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()

    return (
        <RouterProvider navigate={router.push}>
            <ThemeProvider attribute="class">
                <Toaster />
                {children}
            </ThemeProvider>
        </RouterProvider>
    )
}

export { Providers, useTheme }
