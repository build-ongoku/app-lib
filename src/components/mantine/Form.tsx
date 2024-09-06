import { useMakeRequest } from '../../providers/provider'
import { Alert, Box, Button, Paper, Stack } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'

export const Form = <FormT extends Record<string, any>, ResponseT = any>(props: {
    form: UseFormReturnType<FormT>
    children: React.ReactNode
    submitButtonText?: string
    bottomExtra?: React.ReactNode
    postEndpoint: string
    redirectPath?: string
    onSuccess?: (data: ResponseT) => void
    onError?: (error: string) => void
}) => {
    // Todo: remove dependency on next/navigation
    const router = useRouter()

    const [processing, setProcessing] = useState(false)
    const [errMessage, setErrMessage] = useState<string>()

    const [resp, fetch] = useMakeRequest<ResponseT, FormT>({
        method: 'POST',
        path: props.postEndpoint,
    })

    console.log('Form:', resp)

    const handleSubmit = (values: FormT) => {
        console.log('Form Values:', values)
        setProcessing(true)
        fetch({ data: values })
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
