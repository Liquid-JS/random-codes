#!node
import { Encoder } from 'base32.js'
import { randomBytes } from 'crypto'
import { writeFile } from 'fs'
import { promisify } from 'util'
import * as yargs from 'yargs'

const v = yargs.command(
    'generate [length] [count]',
    'generate codes',
    (args) => args
        .positional('length', { description: 'length of each code', default: 5, type: 'number' })
        .positional('count', { description: 'number of codes', default: 50, type: 'number' }),
    (args) => {

        const CHARS = '0123456789ACDEFGHJKLMNPQRTUVWXYZ'
        const BITS = 6
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

console.log(v)
