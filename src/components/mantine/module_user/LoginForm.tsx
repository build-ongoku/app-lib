'use client'

import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { useAuth } from '../../../common/AuthContext'
import { Form } from '../Form'
import { useRouter } from 'next/navigation'

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
            email: isEmail('Please enter a valid email'),
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
                postEndpoint="/v1/login"
                onSuccess={(data) => {
                    if (data.token) {
                        authenticate(data.token)
                        return
                    }
                    throw new Error('Login call succeeded but no token was returned.')
                }}
                redirectPath="/dashboard"
            >
                <TextInput label="Email" placeholder="you@email.com" key={form.key('email')} {...form.getInputProps('email')} />
                <PasswordInput className="" label="Password" placeholder="super-secret-password" key={form.key('password')} mt="md" {...form.getInputProps('password')} />
            </Form>
        </Container>
    )
}
