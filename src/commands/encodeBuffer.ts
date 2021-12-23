import { flags} from '@oclif/command'
import {
  BinaryEncoding,
  default as EncodeTools,
  DEFAULT_ENCODE_TOOLS_OPTIONS
} from '@znetstar/encode-tools-native/lib/EncodeToolsAuto';
import { IEncodeTools } from  '@znetstar/encode-tools-native/lib/IEncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";

export type BufferEncodeFlags = {
  format: BinaryEncoding
}

export const EncodingFlags = {
  format: flags.enum<BinaryEncoding>({
    char: 'f',
    required: false,
    default: getDefaults().binaryEncoding,
    options: [
      BinaryEncoding.base64url,
      BinaryEncoding.hashids,
      BinaryEncoding.base32,
      BinaryEncoding.base64,
      BinaryEncoding.arrayBuffer,
      BinaryEncoding.nodeBuffer,
      BinaryEncoding.hex,
      BinaryEncoding.ascii85
    ],
    description: 'Format to encode output as'
  })
};


export default class EncodeBuffer extends EncodeToolsBase {
  static description = 'Encodes binary data using the provided format writing the output to a file or stdout'

  static example = `echo 'my huge file' | encli encodeBuffer -f base64`
  static flags = {
    help: flags.help(),
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

  protected encoder(flags: BufferEncodeFlags): IEncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
       binaryEncoding: flags.format
    });
  }

  async run() {
    const {args, flags} = this.parse(EncodeBuffer)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(input, flags.format, ...flags.args || []);
    output.end(outputBuffer);
    process.exit(0);
  }
}
