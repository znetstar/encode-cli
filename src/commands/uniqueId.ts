import {flags} from '@oclif/command'
import {default as EncodeTools, IDFormat} from '@znetstar/encode-tools-native/lib/EncodeToolsAuto';
import { IEncodeTools } from  '@znetstar/encode-tools-native/lib/IEncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {BufferEncodeFlags, EncodingFlags} from "./encodeBuffer";

export type UniqueIdFlags = BufferEncodeFlags&{
  idFormat: IDFormat
}

export default class UniqueId extends EncodeToolsBase {
  static description = 'Generates a unique ID using one of the available algorithms, writing the output to a file or stdout'
  static example = `encli uniqueId -i uuidv4 -f base64`


  static flags = {
    help: flags.help(),
    idFormat:  flags.enum<IDFormat>({
      char: 'i',
      required: false,
      default: getDefaults().uniqueIdFormat,
      options: [
        IDFormat.timestamp,
        IDFormat.objectId,
        IDFormat.uuidv4String,
        IDFormat.uuidv1String,
        IDFormat.nanoid,
        IDFormat.uuidv4,
        IDFormat.uuidv1
      ],
      description: 'Algorithm to use to generate the unique id'
    }),
    ...EncodingFlags,
    args: flags.string({
      multiple: true,
      char: 'a',
      required: false,
      description: 'Extra args to pass to the ID generation function'
    })
  }

  static args = [
    {
      name: 'returnValue',
      required: false,
      description: 'Path to use as output, leave blank or use "-" for stdout',
      default: '-'
    }
  ]

  protected encoder(flags: UniqueIdFlags): IEncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
      binaryEncoding: flags.format,
      uniqueIdFormat: flags.idFormat
    });
  }

  async run() {
    const {args, flags} = this.parse(UniqueId)

    const output = await this.getOutputAsStream(args);
    const enc = this.encoder(flags);
    let value = enc.uniqueId(flags.idFormat, ...flags.args || []);
    if (typeof(value) === 'number') {
        value = Buffer.from(value.toString(16), 'hex');
    }
    const outputBuffer = enc.encodeBuffer(value, flags.format);

    output.end(outputBuffer);
    process.exit(0);
  }
}
