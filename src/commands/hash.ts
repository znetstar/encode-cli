import {flags} from '@oclif/command'
import {
  BinaryEncoding,
  default as EncodeTools,
  DEFAULT_ENCODE_TOOLS_OPTIONS,
  HashAlgorithm
} from '@etomon/encode-tools/lib/EncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";

export type HashFlags = BufferEncodeFlags&{
  algorithm: HashAlgorithm
}

export const HashingFlags = {
  algorithm: flags.enum<HashAlgorithm>({
    char: 'a',
    required: false,
    default: getDefaults().hashAlgorithm,
    get options(): HashAlgorithm[] {
      return [
        HashAlgorithm.xxhash64,
        HashAlgorithm.crc32,
        HashAlgorithm.md5,
        HashAlgorithm.bcrypt,
        ...(true /*EncodeToolsBase.isNative*/ ? [HashAlgorithm.xxhash3] : []),
        HashAlgorithm.sha1,
        HashAlgorithm.xxhash32,
        HashAlgorithm.sha512,
        HashAlgorithm.sha3,
        HashAlgorithm.sha2
      ];
    },
    description: 'Algorithm to use'
  }),
}

export default class Hash extends EncodeToolsBase {
  static description = 'Hashes data using the provided algorithm, writing the output to a file or stdout'
  static example = `echo 'hash me!' | encli hash -a md5 -f hex`

  static aliases = [ 'hashString' ]

  static flags = {
    help: flags.help(),
    ...HashingFlags,
    ...EncodingFlags,
    args: flags.string({
      multiple: true,
      char: 'a',
      required: false,
      description: 'Additional args to pass to the encoder'
    })
  }

  static args = [
    {
      name: 'inputBuffer',
      required: false,
      description: 'Path to input data, leave blank or use "-" for stdin',
      default: '-'
    },
    {
      name: 'returnValue',
      required: false,
      description: 'Path to use as output, leave blank or use "-" for stdout',
      default: '-'
    }
  ]

  protected encoder(flags: HashFlags): EncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
      binaryEncoding: flags.format,
      hashAlgorithm: flags.algorithm
    });
  }

  async run() {
    const {args, flags} = this.parse(Hash)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(await enc.hash(input, flags.algorithm, ...flags.args || []), flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
