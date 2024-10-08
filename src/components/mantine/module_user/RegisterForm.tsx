'use client'

import { TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/common/Type'
import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { Form } from '@ongoku/app-lib/src/components/mantine/Form'
import { useRouter } from 'next/navigation'

type BareMinimumRegisterForm = TypeMinimal & {
    email: string
}

export const RegisterForm = <RequestT extends BareMinimumRegisterForm>(props: { typeInfo: TypeInfo<RequestT> }) => {
    const router = useRouter()
    const { authenticate } = useAuth()

    const form = useForm({
        mode: 'uncontrolled',
        // initialValues: props.typeInfo.getEmptyInstance(),
        validate: {
            // Commented out for DEV purposes
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : ('Invalid email' as React.ReactNode)),
        },
    })

    return (
        <Container className="w-96">
            <Form
                form={form}
                postEndpoint="/v1/register"
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
                redirectPath="/dashboard"
            >
                <TextInput label="Email" placeholder="you@email.com" key={form.key('email')} {...form.getInputProps('email')} />
                <PasswordInput className="" label="Password" placeholder="super-secret-password" key={form.key('password')} mt="md" {...form.getInputProps('password')} />
                <TextInput label="First Name" placeholder="John" key={form.key('name.first_name')} {...form.getInputProps('name.first_name')} />
                <TextInput label="Last Name" placeholder="Doe" key={form.key('name.last_name')} {...form.getInputProps('name.last_name')} />
            </Form>
        </Container>
    )
}
