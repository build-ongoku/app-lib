import { AuthenticateResponse, LoginRequest } from 'goku.generated/types/user/types.generated'
import { Button, Card, Form, Input, Layout, Spin } from 'antd'
import { Navigate } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/common/AuthContext'
import { useMakeRequest } from '@/providers/provider'

// interface AuthenticateRequest {
//     email: string
//     password: string
// }

// interface AuthenticateResponse {
//     token: string
// }

export const LoginForm = (props: {}) => {
    const { session, loading: authLoading, authenticate } = useAuth()
    const [formSubmitted, setFormSubmitted] = useState(false)

    const [{ data, error, loading }, fetch] = useMakeRequest<AuthenticateResponse, LoginRequest>({
        method: 'POST',
        path: 'users/login',
        notifyOnError: true,
    })

    useEffect(() => {
        if (formSubmitted && data?.token) {
            authenticate(data.token)
        }
    }, [data?.token])

    if (authLoading || loading) {
        return <Spin size="large" />
    }

    if (session) {
        console.log('User is already logged in. Redirecting...')
        return <Navigate to="/" />
    }

    const onFinish = (values: any) => {
        console.log('Login Form: Submission', values)
        if (!formSubmitted) {
            setFormSubmitted(true)
        }
        fetch({
            data: values,
        })

        console.log('Fetching/fetched:', loading, error, data)
    }

    const inputStyles = {
        minWidth: 300,
        maxWidth: 600,
    }

    return (
        <Card title="Login">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Form name="normal_login" style={{ maxWidth: 400 }} initialValues={{ remember: true }} onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ required: true, type: 'email' }]} style={inputStyles}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true }]} style={inputStyles}>
                        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Log in
                        </Button>
                        Or <a href="/register">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </Card>
    )
}

export const LoginPage = (props: {}) => {
    return (
        <Layout>
            <Layout>
                <Layout.Header />
                <Layout.Content>
                    <LoginForm />
                </Layout.Content>
            </Layout>
        </Layout>
    )
}
