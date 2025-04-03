'use client'

import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import React from 'react'
import { useAuth } from '../../../common/AuthContext'
import { Form } from '../Form'
import { Router } from '../../../common/types'

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthenticateResponse {
    token: string
}

export const LoginForm = (props: { router: Router }) => {
    const { router } = props

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
                title="Login"
                form={form}
                submitButtonText="Continue"
                bottomExtra={
                    <div className="flex justify-between w-full">
                        <Anchor
                            className="text-sm font-light"
                            onClick={() => {
                                router.push('/register')
                            }}
                        >
                            Create an account
                        </Anchor>
                        <Anchor
                            className="text-sm font-light"
                            onClick={() => {
                                router.push('/password/forgot')
                            }}
                        >
                            Forgot password
                        </Anchor>
                    </div>
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
                router={router}
            >
                <TextInput label="Email" placeholder="you@email.com" key={form.key('email')} {...form.getInputProps('email')} />
                <PasswordInput className="" label="Password" placeholder="super-secret-password" key={form.key('password')} mt="md" {...form.getInputProps('password')} />
            </Form>
        </Container>
    )
}
