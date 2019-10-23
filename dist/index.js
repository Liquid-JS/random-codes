#!node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base32_js_1 = require("base32.js");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const util_1 = require("util");
const yargs = __importStar(require("yargs"));
const v = yargs.command('generate [length] [count]', 'generate codes', (args) => args
    .positional('length', { description: 'length of each code', default: 5, type: 'number' })
    .positional('count', { description: 'number of codes', default: 50, type: 'number' }), (args) => {
    const CHARS = '0123456789ACDEFGHJKLMNPQRTUVWXYZ';
    const BITS = 6;
    const N = args.count;
    const CODE_LENGTH = args.length;
    const randomBytesP = util_1.promisify(crypto_1.randomBytes);
    const writeFileP = util_1.promisify(fs_1.writeFile);
    async function main() {
        const e = new Set();
        const p = new Array(N).fill(0).map(async (_el) => {
            let code;
            do {
                const buff = await randomBytesP(Math.ceil(CODE_LENGTH * BITS / 8));
                const c = new base32_js_1.Encoder({
                    type: 'rfc4648',
                    alphabet: CHARS
                }).finalize(buff);
                code = c.substr(0, CODE_LENGTH);
            } while (e.has(code));
            e.add(code);
            return code;
        });
        const codes = await Promise.all(p);
        const buff = Buffer.from(codes.join('\n'));
        await writeFileP('codes.csv', buff);
    }
    main();
})
    .demandCommand()
    .help()
    .argv;
console.log(v);
//# sourceMappingURL=index.js.map