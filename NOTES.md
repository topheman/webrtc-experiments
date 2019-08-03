# Notes

## Jest unit test setup

In the last few years, you must have been using ES6+ features of the JavaScript language on your projects. Tools like Babel and Webpack have made this possible and are now mainstream thanks to toolkits like Create React App.

This project doesn't rely on transpilation or bundler (no Babel, no Webpack), it uses directly the latest APIs of the browsers.

### BUT ...

When I setup Jest (which is one of those great zero config tools), it didn't understand the `import` statements (logic, it doesn't exist yet in Node).

So, I installed the great [esm](https://www.npmjs.com/package/esm) package from [@jdalton](https://github.com/jdalton). It enables the support for ECMAScript modules in Node - that way, `import` and `export` statements you wrote will be understood by Node.

My `jest.config.js` would look like this:

```js
module.exports = {
  transform: {
    "\\.m?jsx?$": "esm"
  },
  transformIgnorePatterns: []
};
```

And I would get the following error:

- Always on [Travis](https://travis-ci.org/topheman/webrtc-experiments/jobs/567117412#L474)
- In local (only if I added a 4th test file)

```
TypeError: Cannot read property 'next' of undefined
```

After some debugging, I think the problem is with the esm loader. The `src/js/common.js` file being imported:

- directly in one of the tests
- indirectly by the components I'm testing in the 2 other tests

### The Fix

I installed [babel-jest](https://github.com/facebook/jest#using-babel)

```shell
yarn add --dev babel-jest @babel/core @babel/preset-env
```

Added a `babel.config.js` (only to be used for unit tests):

```js
module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]]
};
```

And finally, you can choose to test relying on:

- babel (works for the moment): `npm test` - calls `npm run test:babel`
- esm (for investigation): `npm run test:esm`
