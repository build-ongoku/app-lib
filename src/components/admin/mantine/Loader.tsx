import { Loader as LoaderMantine } from '@mantine/core'
import { CenterScreen } from '@ongoku/app-lib/src/components/CenterScreen'
import React from 'react'

export const ScreenLoader = (props: {}) => {
    return (
        <CenterScreen>
            <LoaderMantine size="xl" type="bars" />
        </CenterScreen>
    )
}
