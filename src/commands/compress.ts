import {flags} from '@oclif/command'
import {CompressionFormat, default as EncodeTools, HashAlgorithm} from '@etomon/encode-tools/lib/EncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";

export type CompressFlags = BufferEncodeFlags&{
  compressionFormat: CompressionFormat,
  compressionLevel?: number
}

export default class Compress extends EncodeToolsBase {
  static description = 'Compresses arbitrary data using the provided format and any options, writing the output to a file or stdout'
  static example = `echo 'hi' | encli compress -c lzma | xz -d`


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
    }),
    compressionLevel: flags.integer({
      char: 'l',
      required: false,
      default: getDefaults().compressionLevel,
      description: 'Compression level, passed to underlying algorithm'
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

  protected encoder(flags: CompressFlags): EncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
      compressionFormat: flags.compressionFormat,
      compressionLevel: flags.compressionLevel,
      binaryEncoding: flags.format
    });
  }

  async run() {
    const {args, flags} = this.parse(Compress)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(await enc.compress(input, flags.compressionFormat, flags.compressionLevel, ...flags.args || []), flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
