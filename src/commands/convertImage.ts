import {flags} from '@oclif/command'
import {default as EncodeTools, HashAlgorithm, ImageFormat} from '@etomon/encode-tools/lib/EncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";

export type ImageFlags = BufferEncodeFlags&{
  imageFormat: ImageFormat
}

export const ImageOperationFlags = {
  imageFormat: flags.enum<ImageFormat>({
    char: 'i',
    required: false,
    default: getDefaults().imageFormat,
    options: [
      ImageFormat.jpeg,
      ImageFormat.png,
      ...(/*EncodeToolsBase.isNative*/ true ? [
        ImageFormat.gif,
        ImageFormat.tiff,
        ImageFormat.avif,
        ImageFormat.webp
      ] : []),
    ],
    description: ' Format to save result as'
  }),
}

export default class ConvertImage extends EncodeToolsBase {
  static description = 'Saves an image in the provided format, performing no operations on the image writing the result to to a file or stdout'
  static example = `curl -sL 'https://zb.gy/6rQl' | encli convertImage png - /tmp/x.png; open /tmp/x.png`

  static flags = {
    help: flags.help(),
    ...ImageOperationFlags,
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

  protected encoder(flags: ImageFlags): EncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
      imageFormat: flags.imageFormat,
      binaryEncoding: flags.format
    });
  }

  async run() {
    const {args, flags} = this.parse(ConvertImage)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(await enc.convertImage(input,flags.imageFormat), flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
