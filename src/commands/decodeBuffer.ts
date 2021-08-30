import {flags} from '@oclif/command'
import {BinaryEncoding} from '@etomon/encode-tools/lib/EncodeToolsAuto';
import {IEncodeTools} from '@etomon/encode-tools/lib/IEncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags} from "./encodeBuffer";

export const DecodingFlags = {
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
    description: 'Format to decode input from'
  })
};

export default class DecodeBuffer extends EncodeToolsBase {
  static description = 'Decodes binary data from the provided format writing the output to a file or stdout'
  static example = `echo 'bXkgaHVnZSBmaWxlCg==' | encli decodeBuffer -f base64`
  static flags = {
    help: flags.help(),
    ...DecodingFlags,
    args: flags.string({
      multiple: true,
      char: 'a',
      required: false,
      description: 'Additional args to pass to the encoder'
    })
  }

  static args = [
    {
      name: 'input',
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
    const {args, flags} = this.parse(DecodeBuffer)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.decodeBuffer(input, flags.format, ...flags.args || []);
    output.end(outputBuffer);
    process.exit(0);
  }
}
