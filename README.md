# tw-xauth

[![npm version](https://img.shields.io/npm/v/@dqn/tw-xauth.svg)](https://www.npmjs.com/package/@dqn/tw-xauth)

Authenticate Twitter account using XAuth.

## Installation

```
$ npm install @dqn/tw-xauth
```

## Usage

```js
const { xauth } = require('@dqn/tw-xauth');

xauth({
  screenName: 'SCREEN_NAME',
  password: 'PASSWORD',
  consumerKey: 'CjulERsDeqhhjSme66ECg',
  consumerSecret: 'IQWdVyqFxghAtURHGeGiWAsmCAGmdW3WmbEx6Hck',
}).then((res) => {
  console.log(res.oauth_token);
  console.log(res.oauth_token_secret);
});
```

## License

MIT
