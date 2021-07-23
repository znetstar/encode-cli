import {flags} from '@oclif/command'
import {default as EncodeTools, HashAlgorithm, ImageFormat} from '@etomon/encode-tools/lib/EncodeToolsAuto';
import { IEncodeTools } from  '@etomon/encode-tools/lib/IEncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";
import {ImageFlags, ImageOperationFlags} from "./convertImage";

export default class CropImage extends EncodeToolsBase {
  static description = 'Crops an image and writes the result in the provided format to to a file or stdout'
  static example = `curl -sL 'https://zb.gy/potd/wiki' | encli cropImage -w 300 -h 300 -x 10 -y 10 -i png - /tmp/photo.png; open /tmp/photo.png`


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
      required: true,
      description: 'Height to crop to'
    }),
    width: flags.integer({
      char: 'w',
      required: true,
      description: 'Width to crop to.'
    }),
    top: flags.integer({
      char: 'x',
      required: true,
      description: 'Where to begin the crop on the x-axis'
    }),
    left: flags.integer({
      char: 'y',
      required: true,
      description: 'Where to begin the crop on the y-axis'
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

  protected encoder(flags: ImageFlags): IEncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
      imageFormat: flags.imageFormat,
      binaryEncoding: flags.format
    });
  }

  async run() {
    const {args, flags} = this.parse(CropImage)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(await enc.cropImage(input, { height: flags.height, width: flags.width, top: flags.top, left: flags.left },flags.imageFormat), flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
