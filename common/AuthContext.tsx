'use client'

import { AuthenticateResponse, AuthenticateTokenRequest } from 'goku.generated/types/user/types.generated'
import React, { useEffect, useState, useContext } from 'react'

import { makeRequest } from 'goku.static/providers/provider'

export interface Session {
    token: string
}

const _cookieKey = 'session'

export const getSessionCookie = (): Session | undefined => {
    const sessionStr = localStorage.getItem(_cookieKey)
    if (!sessionStr) {
        return undefined
    }
    return JSON.parse(sessionStr) as Session
}

export const setSessionCookie = (session: Session) => {
    const sessionStr = JSON.stringify(session)
    localStorage.setItem(_cookieKey, sessionStr)
}

export const deleteSessionCookie = () => {
    localStorage.removeItem(_cookieKey)
}

export const verifySessionCookie = async (): Promise<boolean> => {
    const session = getSessionCookie()

    if (session?.token) {
        const ok = await verifyToken({ token: session.token })
        if (!ok) {
            deleteSessionCookie()
        }
        return ok
    }
    return false
}

export const verifyToken = async (props: { token: string }): Promise<boolean> => {
    const response = await makeRequest<AuthenticateResponse, AuthenticateTokenRequest>({
        path: 'v1/authenticate_token',
        method: 'POST',
        data: {
            token: props.token,
        },
    })

    if (response.data?.token) {
        // Token is valid
        return true
    } else {
        return false
    }
}

export interface AuthContextData {
    session?: Session
    authenticate: (token: string) => void
    endSession: () => void
    loading?: boolean
}

export const AuthContext = React.createContext<AuthContextData | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

export const AuthProvider = (props: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session>()
    const [loading, setLoading] = useState<boolean>(true)

    const stable = 1
    // Load from cookie
    useEffect(() => {
        console.log('Loading cookie from session...')
        setLoading(true)
        const sessionCookie = getSessionCookie()
        if (sessionCookie) {
            console.log('Loaded cookie from session', sessionCookie)
            setSession(sessionCookie)
        }
        setLoading(false)
    }, [stable])

    // Verify token
    useEffect(() => {
        if (session?.token) {
            setLoading(true)
            console.log('Verifying Session...', session)
            verifyToken({ token: session.token }).then((ok) => {
                if (!ok) {
                    setSession(undefined)
                    deleteSessionCookie()
                }
            })
            setLoading(false)
        }
    }, [session])

    const authenticate = async (token: string) => {
        console.log('authenticate()')
        const ok = await verifyToken({ token })
        if (ok) {
            setSessionCookie({ token })
            setSession({ token })
        }
    }

    const endSession = () => {
        setSession(undefined)
        deleteSessionCookie()
    }

    return <AuthContext.Provider value={{ session: session, authenticate: authenticate, endSession: endSession, loading }}>{props.children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
