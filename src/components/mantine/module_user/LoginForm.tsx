'use client'

import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useAuth } from '../../../common/AuthContext'
import { Form } from '../Form'

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthenticateResponse {
    token: string
}

export const LoginForm = () => {
    const router = useRouter()
    const { authenticate } = useAuth()
    const form = useForm<LoginRequest>({
        mode: 'uncontrolled',
        validate: {
            // Commented out for DEV purposes
            email: (value: string) => (isEmail(value) ? null : ('Invalid email' as React.ReactNode)),
        },
    })

    return (
        <Container className="w-96">
            <Form<LoginRequest, AuthenticateResponse>
                form={form}
                submitButtonText="Continue"
                bottomExtra={
                    <Anchor
                        className="text-sm font-light"
                        onClick={() => {
                            router.push('/register')
                        }}
                    >
                        Create an account.
                    </Anchor>
                }
                postEndpoint="/v1/auth/login"
                onSuccess={async (data) => {
                    if (data.token) {
                        await authenticate(data.token)
                        return
                    }
                    throw new Error('Login call succeeded but no token was returned.')
                }}
                redirectPath="/home"
            >
                <TextInput label="Email" placeholder="you@email.com" key={form.key('email')} {...form.getInputProps('email')} />
                <PasswordInput className="" label="Password" placeholder="super-secret-password" key={form.key('password')} mt="md" {...form.getInputProps('password')} />
            </Form>
        </Container>
    )
}
