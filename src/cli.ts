#!/usr/bin/env node
import { mkdir, writeFile } from 'fs/promises'
import { dirname } from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { DEFAULT_CHARSET, generator } from './utils.js'

await Promise.resolve(
    yargs(hideBin(process.argv))
        .command(
            'generate [length] [count]',
            'generate codes',
            (builder) =>
                builder
                    .option('charset', {
                        describe: 'characters to use',
                        default: DEFAULT_CHARSET,
                        type: 'string'
                    })
                    .option('output', {
                        alias: 'o',
                        describe: 'output file',
                        type: 'string'
                    })
                    .positional('length', {
                        alias: 'l',
                        describe: 'length of each code',
                        default: 5,
                        type: 'number'
                    })
                    .positional('count', {
                        alias: 'c',
                        describe: 'number of codes',
                        default: 50,
                        type: 'number'
                    }),
            async (args) => {
                const codes = generator(args).join('\n')

                if (args.output) {
                    await mkdir(dirname(args.output), { recursive: true })
                    const buff = Buffer.from(codes, 'utf8')
                    await writeFile(args.output, buff)
                } else {
                    console.log(codes)
                }
            }
        )
        .demandCommand()
        .showHelpOnFail(false)
        .strict()
        .help()
        .wrap(120).argv
).catch(console.error)
