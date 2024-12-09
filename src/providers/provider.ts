// getBaseURL returns the base URL for the backend API
// It does not add the version number.
// e.g. for DEV, it may return http://localhost:80/api/
const getBaseURL = (): string => {
    console.log('[Provider] [getBaseURL]', 'envVariables', process.env)
    let host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST
    let port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT
    let protocol = process.env.NEXT_PUBLIC_GOKU_BACKEND_PROTOCOL
    if (!protocol) {
        // use the same protocol as the frontend
        if (typeof window === 'undefined') {
            console.warn('[Provider] [getBaseURL] Protocol not set. Defaulting to https:')
            protocol = 'https:'
        } else {
            protocol = window?.location?.protocol ?? 'https:'
            console.warn(`[Provider] [getBaseURL] Protocol not set. Defaulting to window's protocol [${protocol}]`)
        }
    }
    if (protocol !== 'http:' && protocol !== 'https:') {
        console.warn(`[Provider] [getBaseURL] Invalid protocol [${protocol}] (not "http:" or "https:"). Setting to window's protocol [${window.location.protocol}]`)
        protocol = window.location.protocol
    }
    if (!host) {
        console.warn('[Provider] [getBaseURL] Host not set. Defaulting to localhost')
        host = 'localhost'
    }
    if (!port) {
        port = protocol === 'https:' ? '443' : '80'
        console.warn(`[Provider] [getBaseURL] Port not set. Defaulting to [${port}]`)
    }

    const url = `${protocol}//${host}:${port}/api`
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
