'use client'

import { Button } from '@mantine/core'
import { useAuth } from '../../../common/AuthContext'
import React, { useState } from 'react'
import { Router } from '../../../common/types'

export const LogoutButton = (props: { router: Router }) => {
    const { router } = props
    
    const [loading, setLoading] = useState(false)
    const { endSession } = useAuth()

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
