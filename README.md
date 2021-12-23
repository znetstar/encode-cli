# encode-cli

## Intro

Encode CLI is a CLI wrapper for the [`@znetstar/encode-tools-native`](https://github.com/znetstar/encode-tools) npm package.
Each of the subcommands map directly to a function on the `EncodeTools` class in `@znetstar/encode-tools-native` and retain
same arguments.

All subcommands can be accessed using the `encli` command,

For example, the `EncodeTools.hash` function can be called as follows
```shell
  echo 'hash me!' | npx encode-cli hash -a md5 -f base64
```

Which is equivalent to 
```javascript
(async () => {
  const enc = new (require('@znetstar/encode-tools-native/lib/EncodeTools').EncodeTools)();
  const buf = await enc.hash('hash me!', 'md5');
  process.stdout.end(buf.toString('base64'));
})();
```

## Docker
I've provided two Docker images with `encode-cli` installed. `znetstar/encode-cli` which is based on `ubuntu:20.10` and Node.js 14 from the NodeSource PPA,
and `znetstar/encode-cli:slim` which is based off of `node:14-slim`.

The former includes the native modules (discussed in the section below), and the latter does not and is 3 times smaller.

Example using Docker
```shell
  echo 'hash me!' | docker run --rm -i znetstar/encode-cli hash -a md5 -f base64
```

**Important**

Two deviations from the library exist to better accommodate the command line.

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

For documentation refer to the [`@znetstar/encode-tools-native` documentation](https://znetstar.github.io/encode-tools-native/modules/encodetoolsnative.html),
all subcommands accept the `--help` argument which will print the required syntax. 

## License

This project is licensed under the GNU LGPL-3.0 a copy of which is located in `LICENSE.txt`.
