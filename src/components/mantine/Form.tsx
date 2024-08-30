import { useMakeRequest } from '@/providers/provider'
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

    const [submitted, setSubmitted] = useState(false)

    const [{ loading, error, data }, fetch] = useMakeRequest<ResponseT, FormT>({
        method: 'POST',
        path: props.postEndpoint,
    })

    console.log('Form:', loading, error, data)

    useEffect(() => {
        if (!submitted) {
            return
        }
        // Error
        if (error) {
            if (props.onError) {
                props.onError(error)
            }
        }
        // Successful
        if (!error && !loading && data) {
            if (props.onSuccess) {
                props.onSuccess(data)
            }
            if (props.redirectPath) {
                router.push(props.redirectPath)
            }
        }
    }, [submitted, error, data])

    const handleSubmit = (values: FormT) => {
        console.log('Form Values:', values)
        fetch({ data: values })
        setSubmitted(true)
    }

    return (
        <Box>
            <Paper p={30} radius="md">
                <form onSubmit={props.form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        {/* Error Message */}
                        {error && <Alert icon={<FiAlertCircle />}>{`Our apologies. We could not complete the request. We're looking into it.`}</Alert>}
                        {/* Actual Form Fields: Passed on as children */}
                        {props.children}
                        <Button type="submit" loading={loading}>
                            {props.submitButtonText ?? 'Submit'}
                        </Button>
                        {props.bottomExtra}
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}
