# Random codes

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/random-codes.svg)](https://github.com/Liquid-JS/random-codes/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dm/@liquid-js/random-codes.svg)](https://www.npmjs.com/package/@liquid-js/random-codes)
[![scope](https://img.shields.io/npm/v/@liquid-js/random-codes.svg)](https://www.npmjs.com/package/@liquid-js/random-codes)

Generate random codes using Node's crypto library.

## Installation

    npm install @liquid-js/random-codes

## API Documentation

<https://liquid-js.github.io/random-codes/>

## Usage

```sh
random-codes generate [length] [count]
```

### Programmatic usage

```js
import { generator } from '@liquid-js/random-codes'

const codes = generator({
    count: 50,
    length: 7
})
```

## License

[GPL-3.0 license](https://github.com/Liquid-JS/random-codes/blob/master/LICENSE)
