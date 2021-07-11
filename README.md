# encode-cli

## Intro

Encode CLI is a CLI wrapper for the [`@etomon/encode-tools`](https://github.com/EtomonUSA/encode-tools) npm package.
Each of the subcommands map directly to a function on the `EncodeTools` class in `@etomon/encode-tools` and retain
same arguments.

All subcommands can be accessed using the `encli` command,

For example, the `EncodeTools.hash` function can be called as follows
```shell
  echo 'hash me!' | npx encode-cli hash -a md5 -f base64
```

Which is equivalent to 
```javascript
(async () => {
  const enc = new (require('@etomon/encode-tools/lib/EncodeTools').EncodeTools)();
  const buf = await enc.hash('hash me!', 'md5');
  process.stdout.end(buf.toString('base64'));
})();
```

**Important**
By default, this will use the portable (pure javascript) version of `@etomon/encode-tools` with no native modules. The native version has
more formats and has better performance. [A better explanation can be found in the `@etomon/encode-tools` documentation.](https://etomonusa.github.io/encode-tools/index.html#requirements) 
To install the native version run `encli plugins:install encode-cli-native`.

Two other deviations from the library exist to better accommodate the command line.

First, input and output can be directed to/from a file or standard input/output. Second, the output of each command can
be re-encoded as any format accepted by `encodeBuffer` using the `-f` flag.

The `serializeObject`, `deseralizeObject`, `encodeObject` and `decodeObject` methods have been replaced with a single
`convertObject` method, because the original methods don't make sense in the context of a command line tool.

## Configuration

The defaults which are passed to the constructor of `EncodeTools` are those found in `DEFAULT_ENCODE_TOOLS_OPTIONS`
which the exception being the default `binaryEncoding` which is `nodeBuffer` instead of `base64`.

You can set the defaults for each value in `EncodingOptions` by setting an environment variable prefixed with `ENCLI_` and the name of
property in uppercase with underscores instead of camel case.

So to set `EncodingOptions.binaryEncoding = "base64url"` you can use `ENCLI_BINARY_ENCODING=base64url`.

Alternatively, you can set all the defaults at once by adding a JSON file at `./.enclirc`, `$HOME/.enclirc`, or by setting the 
`ENCLIRC` environment variable to the path of the JSON file.

The defaults can also be passed by setting the environment variable `ENCLIRC` with raw JSON containing the defaults.

## Documentation

For documentation refer to the [`@etomon/encode-tools` documentation](https://etomonusa.github.io/encode-tools/modules/EncodeTools.html),
all subcommands accept the `--help` argument which will print the required syntax. 

## License

This project is licensed under the GNU LGPL-3.0 a copy of which is located in `LICENSE.txt`.
