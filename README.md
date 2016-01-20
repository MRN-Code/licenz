# licenz

_Make sure your NPM modules have licenses._

![licenz logo](img/licenz.svg)

### Installation

Make sure you have [Node.js](https://nodejs.org/) and NPM installed. Then, run the following to use licenz system-wide:

```shell
npm install -g licenz
```

Alternatively, install it as a development dependency in your current module:

```shell
npm install licenz --save-dev
```

## Use

### CLI

```shell
licenz ./path/to/module/
```

Run `licenz --help` for additional help.

#### White-listing Licenses

Does your project’s dependencies have licenses that you know are acceptable? Tell licenz they’re okay by using the `--licenses` flag:

```shell
licenz --licenses "Apache 2, WTFPL, Public Domain" ./path/to/module
```

#### White-listing Modules

A are dependencies licenses undetectable by licenz? No problem! Use the `--modules` flag to make them pass:

```shell
licenz --modules "module-1@1.0.0, module2@^2.1.0" ./path/to/module
```

## Programatically

Licenz exports a single function which you can `require`:

```js
var licenz = require('licenz');

licenz(options, function(err, res) {
  if (err) {
    console.error(err);
  }
  console.log(res);
});
```

It expects two optional arguments:

* **`options` (object):** Hash of configurations for licenz. The following keys are used:
  * **`path` (string):** Path to the directory to scan. Example:

    ```js
    var options = {
      path: './path/to/module'
    };
    ```

  * **`whitelistLicenses` (array)**: List of licenses to accept. Example:

    ```js
    var options = {
      whitelistLicenses: ['My Cool License', 'My Other License']
    };
    ```

  * **`whitelistModules` (object)**: List of modules to accept. Use module names as the keys and corresponding semver-compatible versions or ranges as the values:

    ```js
    var options = {
      whitelistModules: {
        'my-module': '^2.3.0',
        'my-other-module': '0.5.2',
        'my-best-module': '~8.0.0'
      }
    };
    ```

* **`callback` (function):** Node-style callback function. The “response” is an array of unlicensed module objects. A possible way of dealing with it:

  ```js
  licenz(options, function(err, res) {
    if (err) {
      return console.error(err);
    }
    if (res.length) {
      res.forEach(function(module) {
        console.log('Unlicensed: ' + module.name + '@' + module.version);
      });
    } else {
      console.log('All licensed!');
    }
  });
  ```

  In this example, `res` would be populated with these objects:

  ```js
  {
    licenses: 'UNKNOWN',
    licenseFile: undefined,
    name: 'unlicensed-module'
    repository: 'https://github.com/unlicensed-user/unlicensed-module',
    version: '1.0.0'
  }
  ```

licenz also supports a `Promise` interface:

```js
licenz(options).then(function(results) {
  console.log(results);
}).catch(function(error) {
  console.error(error);
});
```

## Integrating With Pre-Commit

Integrating licenz with git’s pre-commit hook is easy using [pre-commit](https://www.npmjs.com/package/pre-commit). Make sure both pre-commit and licenz are installed (`npm i pre-commit licenz --save-dev`). Then, add a `licenz` to a script in your _package.json_:

```js
//...
"scripts": {
  "validate": "licenz",
  //...
}
//...
```

Then, create a `precommit` key and add the script:

```js
//...
"precommit": [
  "validate",
  //...
]
//...
```
