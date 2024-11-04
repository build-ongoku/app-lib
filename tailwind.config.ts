import path from 'path'
import type { Config } from 'tailwindcss'

// Any package importing this package will not probably depend on this file. It will probably use it's own
// tailwind.config.js file. Leaving this file here for completion sake.
const config: Config = {
    purge: {},
    content: [
        path.resolve(__dirname, './src/**/*.{js,ts,jsx,tsx,mdx}'), // Use absolute path
    ],
    theme: {},
    plugins: [],
    corePlugins: {
        preflight: false,
    },
}
export default config
