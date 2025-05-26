export type ID = string
export type Email = string
export type Money = number
export type Link = string


// Convert string YYYY-MM-DD to Date
export const NewDateFromYYYYMMDD = (str: string) => {
    const [year, month, day] = str.split('-').map(Number)
    return new Date(year, month - 1, day)
}