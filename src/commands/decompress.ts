import {flags} from '@oclif/command'
import {CompressionFormat, default as EncodeTools, HashAlgorithm} from '@znetstar/encode-tools-native/lib/EncodeToolsAuto';
import { IEncodeTools } from  '@znetstar/encode-tools-native/lib/IEncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";
import {CompressFlags} from "./compress";


export default class Decompress extends EncodeToolsBase {
  static description = 'Decompresses arbitrary data using the provided format and any options, writing the output to a file or stdout'
  static example = `echo 'hi' | xz | encli decompress -c lzma`


  static flags = {
    help: flags.help(),
    compressionFormat: flags.enum<CompressionFormat>({
      char: 'c',
      required: false,
      default: getDefaults().compressionFormat,
      options: [
        CompressionFormat.zstd,
        CompressionFormat.lzma
      ],
      description: 'Format to use'
    }),
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

  protected encoder(flags: CompressFlags): IEncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
      compressionFormat: flags.compressionFormat,
      binaryEncoding: flags.format
    });
  }

  async run() {
    const {args, flags} = this.parse(Decompress)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(await enc.decompress(input, flags.compressionFormat, ...flags.args || []), flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
