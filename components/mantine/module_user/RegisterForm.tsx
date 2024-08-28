'use client'

import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { RegisterUserRequest } from 'goku.generated/types/user/types.generated'
import { useAuth } from 'goku.static/common/AuthContext'
import { Form } from 'goku.static/components/mantine/Form'
import { useRouter } from 'next/navigation'

export const RegisterForm = () => {
    const router = useRouter()
    const { authenticate } = useAuth()

    const form = useForm<RegisterUserRequest>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
            name: {
                first_name: '',
                middle_initial: null,
                last_name: '',
            },
        },
        validate: {
            // Commented out for DEV purposes
            email: isEmail('Please enter a valid email'),
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
