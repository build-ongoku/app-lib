'use client'

import { Anchor, Container, Loader, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import React, { useEffect, useState } from 'react'
import { Form } from '../Form'
import { WithRouter } from '../../../common/types'
import { joinURLNoPrefixSlash } from '../../../providers/provider'
import { ScreenLoader } from '../../admin/mantine/Loader'

interface PasswordForgotForm {
    email: string
    hostURL: string
}

interface PasswordForgotResponse {
    message: string
}

export const FormPasswordForgot = (props: WithRouter) => {
    const { router } = props

    const form = useForm<PasswordForgotForm>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            hostURL: '',
        },
        validate: {
            email: (value: string) => (isEmail(value) ? null : ('Invalid email' as React.ReactNode)),
        },
    })

    // We are getting the origin from the window location inside a useEffect to avoid a hydration mismatch
    // Next build fails otherwise saying "window is undefined" (since next tries to build the component on the server first, even though we are using 'use client')
    const [origin, setOrigin] = useState<string | undefined>(undefined)
    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])
    useEffect(() => {
        if (origin) {
            form.setFieldValue('hostURL', joinURLNoPrefixSlash(origin, "password", "reset"))
        }
    }, [origin])

    if (!origin) {
        return <ScreenLoader />;
    }

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
