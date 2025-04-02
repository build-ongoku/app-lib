'use client'

import { Alert, Box, Button, Paper, Stack } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import React, { useEffect, useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { useMakeRequest } from '../../providers/httpV2'
import { Router } from '../../common/types'

export const discardableInputKey = '__og_discardable'

export const Form = <FormT extends Record<string, any>, RequestT = FormT, ResponseT = any>(props: {
    form: UseFormReturnType<FormT>
    children: React.ReactNode
    submitButtonText?: string
    bottomExtra?: React.ReactNode
    onSubmitTransformValues?: (values: FormT) => RequestT
    postEndpoint: string
    method?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
    redirectPath?: string
    onSuccess?: (data: ResponseT) => void
    onError?: (error: string) => void
    router: Router
}) => {
    const { router } = props

    const [processing, setProcessing] = useState(false)
    const [errMessage, setErrMessage] = useState<string>()

    const makeResp = useMakeRequest<ResponseT, RequestT>({
        method: props.method ?? 'POST',
        relativePath: props.postEndpoint,
        skipFetchAtInit: true,
    })

    console.log('[Form] Rendering...', 'response?', makeResp)

    // dummyAssert only changes the type
    const dummyAssert = (values: FormT): RequestT => {
        return values as unknown as RequestT
    }

    // standard transform that changes the FormT before processing
    const standardTransform = (values: FormT): FormT => {
        // if the outside more key in the values is "discardableInputKey", simply return the value of it
        if (values[discardableInputKey]) {
            return values[discardableInputKey]
        }
        return values
    }

    const handleSubmit = (values: FormT) => {
        console.log('[Form] [HandleSubmit]', 'values', values)
        setProcessing(true)
        let data: RequestT
        if (props.onSubmitTransformValues) {
            data = props.onSubmitTransformValues(values)
        } else {
            values = standardTransform(values)
            data = dummyAssert(values)
        }
        makeResp.fetch(data)
    }

    // Handle the fetch response
    useEffect(() => {
        // if haven't finished fetching,
        if (!makeResp.fetchDone || makeResp.loading) {
            return
        }

        if (!processing) {
            setProcessing(true)
        }

        // Error (making the request)
        const err = makeResp.error ?? makeResp.resp?.error
        if (err) {
            console.log('[Form] [useEffect] Form submission returned error', err)
            console.error('Error:', err)
            if (props.onError) {
                props.onError(err)
            }
            setErrMessage(err)
            setProcessing(false)
        } else if (makeResp.resp?.data) {
            // Successful
            if (props.onSuccess) {
                props.onSuccess(makeResp.resp.data)
            }
            if (props.redirectPath) {
                console.log('[Form] [useEffect] props.redirectPath detected: Redirecting to', props.redirectPath)
                router.push(props.redirectPath)
            } else {
                setProcessing(false)
            }
        }
    }, [makeResp.resp])

    return (
        <Box>
            <Paper p={30} radius="md">
                <form onSubmit={props.form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        {/* Error Message */}
                        {errMessage && <Alert icon={<FiAlertCircle />}>{errMessage ?? `Our apologies. We could not complete the request. We're looking into it.`}</Alert>}
                        {/* Actual Form Fields: Passed on as children */}
                        {props.children}
                        <Button type="submit" loading={makeResp.loading || processing}>
                            {props.submitButtonText ?? 'Submit'}
                        </Button>
                        {props.bottomExtra}
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}
