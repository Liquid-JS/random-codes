import { randomBytes } from 'crypto'

export const DEFAULT_CHARSET = '0123456789ACDEFGHJKLMNPQRTUVWXYZ'

/**
 * Generate random codes
 *
 * @param args
 * @returns
 */
export function generator(args: {
    /**
     * Characters to use in generated codes
     */
    charset?: string
    /**
     * Length of each code
     */
    length: number
    /**
     * Number of codes
     */
    count: number
}) {
    const { charset = DEFAULT_CHARSET, length, count } = args
    const bits = Math.ceil(Math.log2(charset.length))

    const generated = new Set<string>()
    return new Array(count).fill(0).map(_el => {
        let code: string
        do {
            const buff = randomBytes(Math.ceil((length + 2) * bits / 8))
            code = encode(buff, charset, length + 2)
                .substring(1, length + 1) // First and last character might be biased
        } while (generated.has(code))
        generated.add(code)
        return code
    })
}

function encode(bytes: Buffer, allowedCharacters: string, length?: number) {
    let num = BigInt('0x' + bytes.toString('hex'))
    const len = BigInt(allowedCharacters.length)
    const chars = []
    const fullChars = length ?? Math.floor((bytes.length * 8 * Math.log(2)) / Math.log(allowedCharacters.length))
    while (chars.length < fullChars) {
        const r = Number(num % len)
        num = num / len
        chars.push(allowedCharacters.charAt(r))
    }
    return chars.join('')
}
