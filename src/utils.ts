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
    const { length, count } = args
    // Remove duplicates
    const charset = Array.from(new Set(args.charset || DEFAULT_CHARSET)).join('')

    const bits = Math.log2(charset.length) * length
    const bytes = Math.ceil(bits / 8)

    const possible = BigInt(charset.length) ** BigInt(length)

    const k = BigInt(30)
    if ((possible / BigInt(count)) < k) {
        const max = possible / k
        throw new Error(`For given charset and code lenght you can generate up to ${max.toString(10)} codes; to generate more codes, increase code length or include other characters in the charset.`)
    }

    /**
     * Upper limit, avoiding modulo bias:
     * 
     * - upper % possible === 0
     * - upper <= 2 ^ (bytes * 8)
     */
    const multiplier = Math.floor(2 ** (bytes * 8 - bits))
    const upper = possible * BigInt(multiplier)

    const generated = new Set<string>()
    return new Array(count).fill(0).map(_el => {
        let code: string | undefined
        do {
            const buff = randomBytes(bytes)
            const val = BigInt('0x' + buff.toString('hex'))
            if (val < upper)
                code = encode(buff, charset, length)
        } while (!code || generated.has(code))
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
