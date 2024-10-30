import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import multiInput from 'rollup-plugin-multi-input'
import fg from 'fast-glob'

export default {
    input: fg.sync(['src/**/*.ts', 'src/**/*.tsx']), // Use fast-glob to handle glob patterns
    output: {
        dir: 'dist',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src', // Preserves the src directory structure
    },
    plugins: [
        multiInput(), // Handles multiple input files
        resolve(),
        commonjs(),
        json(),
        postcss(),
        typescript({
            tsconfig: './tsconfig.json',
            useTsconfigDeclarationDir: true,
            clean: true,
            tsconfigOverride: {
                compilerOptions: {
                    declaration: true,
                    declarationDir: './dist',
                    outDir: './dist',
                },
            },
        }),
    ],
    external: ['react', 'react-dom'],
    onwarn: (warning, warn) => {
        // Suppress specific warnings if necessary
        if (warning.message.includes('"use client"')) return
        warn(warning)
    },
}
