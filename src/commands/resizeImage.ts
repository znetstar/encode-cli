import {flags} from '@oclif/command'
import {default as EncodeTools, HashAlgorithm, ImageFormat} from '@etomon/encode-tools/lib/EncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";
import {ImageFlags, ImageOperationFlags} from "./convertImage";


export default class ResizeImage extends EncodeToolsBase {
  static description = 'Resizes an image and writes the result in the provided format to to a file or stdout'
  static example = `curl -sL 'https://zb.gy/potd/wiki' | encli resizeImage -w 200 -i png - /tmp/photo.png; open /tmp/photo.png`


  static flags = {
    help: flags.help(),
    ...ImageOperationFlags,
    ...EncodingFlags,
    args: flags.string({
      multiple: true,
      char: 'a',
      required: false,
      description: 'Additional args to pass to the encoder'
    }),
    height: flags.integer({
      char: 'h',
      required: false,
      description: 'Height to resize to. Must provide, height, width or both'
    }),
    width: flags.integer({
      char: 'w',
      required: false,
      description: 'Width to resize to. Must provide, height, width or both'
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
    const {args, flags} = this.parse(ResizeImage)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(await enc.resizeImage(input, { height: flags.height, width: flags.width } as any,flags.imageFormat), flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
