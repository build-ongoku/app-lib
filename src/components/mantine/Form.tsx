'use client'

import { Alert, Box, Button, Paper, Stack } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { useMakeRequest } from '../../providers/provider'

export const Form = <FormT extends Record<string, any>, RequestT = FormT, ResponseT = any>(props: {
    form: UseFormReturnType<FormT>
    children: React.ReactNode
    submitButtonText?: string
    bottomExtra?: React.ReactNode
    onSubmitTransformValues?: (values: FormT) => RequestT
    postEndpoint: string
    redirectPath?: string
    onSuccess?: (data: ResponseT) => void
    onError?: (error: string) => void
}) => {
    // Todo: remove dependency on next/navigation
    const router = useRouter()

    const [processing, setProcessing] = useState(false)
    const [errMessage, setErrMessage] = useState<string>()

    const [resp, fetch] = useMakeRequest<ResponseT, RequestT>({
        method: 'POST',
        path: props.postEndpoint,
    })

    console.log('[Form] Rendering...', 'response?', resp)

    // Default transform function for type assertion
    const dummyTransform = (values: FormT): RequestT => {
        return values as unknown as RequestT
    }

    const handleSubmit = (values: FormT) => {
        console.log('[Form] [HandleSubmit]', 'values', values)
        setProcessing(true)
        let data: RequestT
        if (props.onSubmitTransformValues) {
            data = props.onSubmitTransformValues(values)
        } else {
            data = dummyTransform(values)
        }
        fetch({ data: data })
    }

    // Handle the fetch response
    useEffect(() => {
        // if haven't finished fetching,
        if (!resp.finished || resp.loading) {
            return
        }

        if (!processing) {
            setProcessing(true)
        }

        // Error
        if (resp.error) {
            console.log('[Form] [useEffect] Form submission returned error', resp.error)
            console.error('Error:', resp.error)
            if (props.onError) {
                props.onError(resp.error)
            }
            setErrMessage(resp.error)
            setProcessing(false)
        } else if (!resp.error && !resp.loading && resp.data) {
            // Successful
            if (props.onSuccess) {
                props.onSuccess(resp.data)
            }
            if (props.redirectPath) {
                console.log('[Form] [useEffect] props.redirectPath detected: Redirecting to', props.redirectPath)
                router.push(props.redirectPath)
            } else {
                setProcessing(false)
            }
        }
    }, [resp])

    return (
        <Box>
            <Paper p={30} radius="md">
                <form onSubmit={props.form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        {/* Error Message */}
                        {resp.error && <Alert icon={<FiAlertCircle />}>{errMessage ?? `Our apologies. We could not complete the request. We're looking into it.`}</Alert>}
                        {/* Actual Form Fields: Passed on as children */}
                        {props.children}
                        <Button type="submit" loading={resp.loading || processing}>
                            {props.submitButtonText ?? 'Submit'}
                        </Button>
                        {props.bottomExtra}
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}
