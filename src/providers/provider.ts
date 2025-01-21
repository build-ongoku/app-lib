// getBaseURL returns the base URL for the backend API
// It does not add the version number.
// e.g. for DEV, it may return http://localhost:80/api/
const getBaseURL = (): string => {
    console.log('[Provider] [getBaseURL]', 'envVariables', process.env)

    // Host
    let host = process.env.GOKU_BACKEND_HOST
    if (!host) {
        host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST
        console.debug('[Provider] [getBaseURL]', 'NEXT_PUBLIC_GOKU_BACKEND_HOST', host)
    }
    if (!host) {
        host = process.env.EXPO_PUBLIC_GOKU_BACKEND_HOST
        console.debug('[Provider] [getBaseURL]', 'EXPO_PUBLIC_GOKU_BACKEND_HOST', host)
    }
    // Note: add any other specific environment variables name for the host here
    if (!host) {
        console.warn('[Provider] [getBaseURL] Host not set. Defaulting to localhost')
        host = 'localhost'
    }
    console.log('[Provider] [getBaseURL]', 'Host: ', host)

    // Protocol
    let protocol = process.env.GOKU_BACKEND_PROTOCOL
    if (!protocol) {
        protocol = process.env.NEXT_PUBLIC_GOKU_BACKEND_PROTOCOL
        console.debug('[Provider] [getBaseURL]', 'NEXT_PUBLIC_GOKU_BACKEND_PROTOCOL', protocol)
    }
    if (!protocol) {
        protocol = process.env.EXPO_PUBLIC_GOKU_BACKEND_PROTOCOL
        console.debug('[Provider] [getBaseURL]', 'EXPO_PUBLIC_GOKU_BACKEND_PROTOCOL', protocol)
    }
    if (!protocol) {
        protocol = window?.location?.protocol
        console.debug('[Provider] [getBaseURL]', 'window.location.protocol', protocol)
        if (protocol) {
            console.log('[Provider] [getBaseURL] Setting protocol to window.location.protocol', protocol)
        }
    }
    if (!protocol) {
        protocol = 'https:'
        console.warn('[Provider] [getBaseURL] Protocol not set. Defaulting to https.')
    }
    // Todo: ensure protocol is valid
    if (protocol === 'http' || protocol === 'https') {
        protocol = protocol + ':'
    }

    if (protocol && protocol !== 'http:' && protocol !== 'https:') {
        console.warn('[Provider] [getBaseURL] Protocol is not `http:` or `https:`. Defaulting to https.')
        protocol = 'https:'
    }

    // Port
    let port = process.env.GOKU_BACKEND_PORT
    if (!port) {
        port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT
        console.debug('[Provider] [getBaseURL]', 'NEXT_PUBLIC_GOKU_BACKEND_PORT', port)
    }
    if (!port) {
        port = process.env.EXPO_PUBLIC_GOKU_BACKEND_PORT
        console.debug('[Provider] [getBaseURL]', 'EXPO_PUBLIC_GOKU_BACKEND_PORT', port)
    }
    if (!port) {
        console.warn('[Provider] [getBaseURL] Port not set. Leaving empty.')
    }

    const url = `${protocol}//${host}` + (port ? `:${port}` : '') + '/api'
    console.log('[Provider] [getBaseURL]', 'url: ', url)

    return url
}

// addBaseURL adds the base URL to the path
export const addBaseURL = (path: string): string => {
    // remove any leading or trailing slashes
    if (path.startsWith('/')) {
        path = path.slice(1)
    }
    if (path.endsWith('/')) {
        path = path.slice(0, -1)
    }
    return getBaseURL() + '/' + path
}

// joinURL takes a list of strings and joins them with a slash
export const joinURL = (...parts: string[]): string => {
    // Remove any leading or trailing slashes from each part
    parts = parts.map((p) => p.replace(/^\/|\/$/g, ''))
    return '/' + parts.join('/')
}

export interface GokuHTTPResponse<T = any> {
    data?: T
    error?: string
    statusCode: number
}
