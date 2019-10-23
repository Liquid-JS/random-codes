#!node
import { Encoder } from 'base32.js'
import { randomBytes } from 'crypto'
import { writeFile } from 'fs'
import { promisify } from 'util'
import yargs from 'yargs'

yargs
    .usage('Usage: ')
    .command(
        'generate [length] [count]',
        'generate codes',
        (args) => args
            .option('charset', { description: 'characters to use', default: '0123456789ACDEFGHJKLMNPQRTUVWXYZ', type: 'string' })
            .positional('length', { description: 'length of each code', default: 5, type: 'number' })
            .positional('count', { description: 'number of codes', default: 50, type: 'number' })
            .help(),
        (args) => {

            const CHARS = args.charset
            const BITS = Math.ceil(Math.log2(CHARS.length))
            const N = args.count
            const CODE_LENGTH = args.length

            const randomBytesP = promisify(randomBytes)
            const writeFileP = promisify(writeFile)

            async function main() {
                const e = new Set<string>()
                const p = new Array(N).fill(0).map(async _el => {
                    let code: string
                    do {
                        const buff = await randomBytesP(Math.ceil(CODE_LENGTH * BITS / 8))
                        const c = new Encoder({
                            type: 'rfc4648',
                            alphabet: CHARS
                        }).finalize(buff)
                        code = c.substr(0, CODE_LENGTH)
                    } while (e.has(code))
                    e.add(code)
                    return code
                })
                const codes = await Promise.all(p)
                const buff = Buffer.from(codes.join('\n'))
                await writeFileP('codes.csv', buff)
            }
            main()
        })
    .demandCommand()
    .help()
    .argv
