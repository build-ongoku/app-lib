'use client'

import { Button } from '@mantine/core'
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

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
