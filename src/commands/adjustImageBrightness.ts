import {flags} from '@oclif/command'
import {default as EncodeTools, HashAlgorithm, ImageFormat} from '@etomon/encode-tools/lib/EncodeToolsAuto';
import { IEncodeTools } from  '@etomon/encode-tools/lib/IEncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";
import {ImageFlags, ImageOperationFlags} from "./convertImage";

export default class AdjustImageBrightness extends EncodeToolsBase {
  static description = 'Resizes an image and writes the result in the provided format to to a file or stdout'
  static example = `curl -sL 'https://zb.gy/potd/wiki' | encli adjustImageBrightness -m 5 - /tmp/photo.png; open /tmp/photo.png`


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
    factor: flags.integer({
      char: 'm',
      required: true,
      description: 'Multiple to apply to the brightness must be between -100 and 100'
    }),
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
    const {args, flags} = this.parse(AdjustImageBrightness)

    const { input, output } = await this.getInputOutput(args);
    const enc = this.encoder(flags);
    const outputBuffer = enc.encodeBuffer(await enc.adjustImageBrightness(input, ( flags.factor/100 ),flags.imageFormat), flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
