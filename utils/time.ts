import { Duration } from 'luxon'

export const converISO8602 = (str:string) => {
    const result = Duration.fromISO(str);
    return result.as('seconds');
}