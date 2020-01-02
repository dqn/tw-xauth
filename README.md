# tw-xauth

Authenticate using XAuth

# Installation

```
$ npm install dqn/tw-xauth
```

# Usage

```js
const { xauth } = require('tw-xauth');

xauth({
  screenName: 'dqned',
  password: 'XXXXXXXXXXXXXXX',
  consumerKey: 'CjulERsDeqhhjSme66ECg',
  consumerSecret: 'IQWdVyqFxghAtURHGeGiWAsmCAGmdW3WmbEx6Hck',
})
  .then((res) => {
    console.log(res.oauth_token);
    console.log(res.oauth_token_secret);
  });
```
