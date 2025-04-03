'use client'

import { Anchor, Container, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import React from 'react'
import { Form } from '../Form'
import { Router } from '../../../common/types'
import { joinURLNoPrefixSlash } from '../../../providers/provider'

interface PasswordForgotForm {
    email: string
    hostURL: string
}

interface PasswordForgotResponse {
    message: string
}

export const FormPasswordForgot = (props: { router: Router }) => {
    const { router } = props

    const form = useForm<PasswordForgotForm>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            hostURL: joinURLNoPrefixSlash(window.location.origin, "password", "reset"),
        },
        validate: {
            email: (value: string) => (isEmail(value) ? null : ('Invalid email' as React.ReactNode)),
        },
    })

    return (
        <Container className="w-96">
            <Form<PasswordForgotForm, PasswordForgotResponse>
                title="Forgot password?"
                form={form}
                submitButtonText="Reset Password"
                bottomExtra={
                    <div className="flex justify-between w-full">
                        <Anchor
                            className="text-sm font-light"
                            onClick={() => {
                                router.push('/login')
                            }}
                        >
                            Back to login
                        </Anchor>
                        <Anchor
                            className="text-sm font-light"
                            onClick={() => {
                                router.push('/register')
                            }}
                        >
                            Create an account
                        </Anchor>
                    </div>
                }
                postEndpoint="/v1/auth/password_reset_token"
                onSuccessMessage={(data) => data.message}
                redirectPath={undefined} // Stay on the same page to show the success message
                router={router}
            >
                <TextInput label="Email" placeholder="you@email.com" key={form.key('email')} {...form.getInputProps('email')} />
            </Form>
        </Container>
    )
}
