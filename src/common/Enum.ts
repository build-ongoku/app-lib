

export interface NewEnumInfoProps<EN> {
    name: string
    valuesInfo: EnumValueInfo<EN>[]
}

export class EnumInfo<EN> {
    readonly name: string
    readonly valuesInfo: EnumValueInfo<EN>[]

    // inferred props
    readonly valuesMap: { [key: number]: EN }

    constructor(props: NewEnumInfoProps<EN>) {
        this.name = props.name
        this.valuesInfo = props.valuesInfo

        this.valuesMap = {}
        this.valuesInfo.map((valueInfo) => {
            this.valuesMap[valueInfo.id] = valueInfo.value
        })
    }

    getValue(id: number) {
        return this.valuesMap[id]
    }

    getEnumValueInfo(value: EN) {
        return this.valuesInfo.find((enumValueInfo) => enumValueInfo.value === value)
    }
}

console.log('EnumInfo loaded')

export class EnumValueInfo<EN = any> {
    readonly id: number
    readonly value: EN
    readonly displayValue?: string

    constructor(props: { id: number; value: EN; displayValue?: string }) {
        this.id = props.id
        this.value = props.value
        this.displayValue = props.displayValue
    }
    getDisplayValue() {
        return this.displayValue ?? this.value
    }
}
