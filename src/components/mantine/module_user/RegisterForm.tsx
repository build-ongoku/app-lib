'use client'

import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '../../../common/AuthContext'
import { Form } from '../Form'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ITypeMinimal } from '../../../common/app_v3'

type BareMinimumRegisterForm = ITypeMinimal & {
    email: string
}

/*
interface IRegisterForm {
    email: string
    password: string
    name: {
        firstName: string
        lastName: string
    }
}*/

export const RegisterForm = <RequestT extends BareMinimumRegisterForm>(props: {}) => {
    const router = useRouter()
    const { authenticate } = useAuth()

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: undefined,
            password: undefined,
            name: {
                firstName: undefined,
                lastName: undefined,
            },
        },
        // skip type check for now
        validate: {
            // Commented out for DEV purposes
            email: (value?: string) => (value && /^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    })

    return (
        <Container className="w-96">
            <Form
                form={form}
                postEndpoint="/v1/auth/register"
                submitButtonText="Create Account"
                bottomExtra={
                    <Anchor
                        className="text-sm font-light"
                        onClick={() => {
                            router.push('/login')
                        }}
                    >
                        Existing account?
                    </Anchor>
                }
                onSuccess={(data) => {
                    if (data.token) {
                        authenticate(data.token)
                        return
                    }
                    throw new Error('Login call succeeded but no token was returned.')
                }}
                redirectPath="/home"
            >
                <TextInput label="Email" placeholder="you@email.com" key={form.key('email')} {...form.getInputProps('email')} />
                <PasswordInput className="" label="Password" placeholder="super-secret-password" key={form.key('password')} mt="md" {...form.getInputProps('password')} />
                <TextInput label="First Name" placeholder="John" key={form.key('name.firstName')} {...form.getInputProps('name.firstName')} />
                <TextInput label="Last Name" placeholder="Doe" key={form.key('name.lastName')} {...form.getInputProps('name.lastName')} />
            </Form>
        </Container>
    )
}
