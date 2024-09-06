import { CenterScreen } from '@ongoku/app-lib/src/components/CenterScreen'
import { Loader as LoaderMantine } from '@mantine/core'

export const ScreenLoader = (props: {}) => {
    return (
        <CenterScreen>
            <LoaderMantine size="xl" type="bars" />
        </CenterScreen>
    )
}
