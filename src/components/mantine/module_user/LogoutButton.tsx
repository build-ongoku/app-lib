'use client'

import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const LogoutButton = () => {
    const [loading, setLoading] = useState(false)
    const { endSession } = useAuth()
    const router = useRouter()

    return (
        <Button
            loading={loading}
            className="w-100"
            variant="outline"
            size="sm"
            onClick={() => {
                console.log('Logout')
                setLoading(true)
                endSession()
                router.push('/')
            }}
        >
            Log out
        </Button>
    )
}
