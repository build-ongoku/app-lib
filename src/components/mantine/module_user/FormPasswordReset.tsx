'use client'

import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'
import { Form } from '../Form'
import { WithRouter } from '../../../common/types'

interface PasswordResetForm {
    email: string
    password: string
    confirmPassword: string
    token: string // From URL parameter
}

interface PasswordResetRequest {
    token: string
    password: string
    email: string
}

interface PasswordResetResponse {
    message: string
}

interface Props extends WithRouter {
    email: string
    token: string
}

export const FormPasswordReset = (props: Props) => {
    const { email, token, router } = props

    const form = useForm<PasswordResetForm>({
        mode: 'uncontrolled',
        initialValues: {
            email: email,
            password: '',
            confirmPassword: '',
            token: token
        },
        validate: {
            password: (value: string) => (value.length >= 8 ? null : ('Password must be at least 8 characters' as React.ReactNode)),
            confirmPassword: (value: string, values) => 
                value === values.password ? null : ('Passwords do not match' as React.ReactNode),
        },
    })

    return (
        <Container className="w-96">
            <Form<PasswordResetForm, PasswordResetResponse, PasswordResetRequest>
                form={form}
                title="Reset password"
                submitButtonText="Reset Password"
                bottomExtra={
                    <div className="flex justify-between w-full">
                        <Anchor
                            className="text-sm font-light"
                            onClick={() => {
                                router.push('/login')
                            }}
                        >
                            Go to login
                        </Anchor>
                    </div>
                }
                postEndpoint="/v1/auth/reset_password"
                onSubmitTransformValues={(values) => (
                    {
                        token: values.token,
                        password: values.password,
                        email: values.email
                    }
                )}
                onSuccessMessage={(data) => data.message}
                redirectPath={undefined} // Stay on the same page to show the success message
                router={router}
            >
                <TextInput 
                    label="Email" 
                    key={form.key('email')} 
                    disabled={true}
                    {...form.getInputProps('email')} 
                />
                <PasswordInput 
                    label="New Password" 
                    placeholder="Enter new password" 
                    key={form.key('password')} 
                    {...form.getInputProps('password')} 
                />
                <PasswordInput 
                    label="Confirm Password" 
                    placeholder="Confirm new password" 
                    key={form.key('confirmPassword')} 
                    mt="md"
                    {...form.getInputProps('confirmPassword')} 
                />
            </Form>
        </Container>
    )
}
