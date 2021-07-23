import {flags} from '@oclif/command'
import {
  BinaryEncoding,
  default as EncodeTools,
  DEFAULT_ENCODE_TOOLS_OPTIONS,
  HashAlgorithm
} from '@etomon/encode-tools/lib/EncodeToolsAuto';
import { IEncodeTools } from  '@etomon/encode-tools/lib/IEncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";
import {SerializationFlags, SerializingFlags} from "./convertObject";
import {HashingFlags} from "./hash";

export type HashFlags = BufferEncodeFlags&SerializationFlags&{
  algorithm: HashAlgorithm
}

export default class HashObject extends EncodeToolsBase {
  static description = 'Hashes an object using the provided algorithm. The object will be deserialized first using "deserializeObject". writing the output to a file or stdout'
  static example = "echo '{ \"foo\": \"bar\" }' | encli hash -s json -a xxhash3 -f base64"
  static flags = {
    help: flags.help(),
    ...HashingFlags,
    ...SerializingFlags,
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

  protected encoder(flags: HashFlags): IEncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
      binaryEncoding: flags.format,
      hashAlgorithm: flags.algorithm
    });
  }

  async run() {
    const {args, flags} = this.parse(HashObject)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(await enc.hashObject(enc.deserializeObject(input, flags.serializationFormat), flags.algorithm, ...flags.args || []), flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
