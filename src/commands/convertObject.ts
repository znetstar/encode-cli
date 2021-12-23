import {flags} from '@oclif/command'
import {default as EncodeTools, SerializationFormat} from '@znetstar/encode-tools-native/lib/EncodeToolsAuto';
import { IEncodeTools } from  '@znetstar/encode-tools-native/lib/IEncodeTools';
import EncodeToolsBase, {getDefaults} from "./EncodeToolsBase";
import {EncodingFlags} from "./encodeBuffer";

export type SerializationFlags = {
  serializationFormat: SerializationFormat
}

export type ReserializationFlags = {
  inputSerializationFormat: SerializationFormat;
  outputSerializationFormat: SerializationFormat;
}

export const ReserializingFlags = {
  inputSerializationFormat: flags.enum<SerializationFormat>({
    char: 'i',
    required: false,
    default: getDefaults().serializationFormat,
    options: [
      SerializationFormat.json,
      SerializationFormat.cbor,
      SerializationFormat.msgpack,
      SerializationFormat.bson
    ],
    description: 'Format to deserialize input as'
  }),
  outputSerializationFormat: flags.enum<SerializationFormat>({
    char: 'o',
    required: false,
    default: getDefaults().serializationFormat,
    options: [
      SerializationFormat.json,
      SerializationFormat.cbor,
      SerializationFormat.msgpack,
      SerializationFormat.bson
    ],
    description: 'Format to serialize output as'
  })
};

export const SerializingFlags = {
  serializationFormat: flags.enum<SerializationFormat>({
    char: 's',
    required: false,
    default: getDefaults().serializationFormat,
    options: [
      SerializationFormat.json,
      SerializationFormat.cbor,
      SerializationFormat.msgpack,
      SerializationFormat.bson
    ],
    description: 'Format to serialize output as'
  })
};

export const DeserializingFlags = {
  serializationFormat: flags.enum<SerializationFormat>({
    char: 's',
    required: false,
    default: getDefaults().serializationFormat,
    options: [
      SerializationFormat.json,
      SerializationFormat.cbor,
      SerializationFormat.msgpack,
      SerializationFormat.bson
    ],
    description: 'Format to deserialize input from'
  })
};


export default class ConvertObject extends EncodeToolsBase {
  static description = 'Re-encodes data in one serialization format in a different serialization format. The binary encoding must stay the same'
  static example = `echo '{"my": "json"}' | encli convertObject -i json -o msgpack | encli encodeBuffer -f base64`
  static flags = {
    help: flags.help(),
    ...ReserializingFlags,
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

  protected encoder(flags: ReserializationFlags): IEncodeTools {
    return new (EncodeToolsBase.EncodeTools)({
      serializationFormat: flags.inputSerializationFormat
    });
  }

  async run() {
    const {args, flags} = this.parse(ConvertObject)

    const { input, output } = await this.getInputOutput(args);
    const inEnc = new (EncodeToolsBase.EncodeTools)({ serializationFormat: flags.inputSerializationFormat, binaryEncoding: flags.format });
    const outEnc = new (EncodeToolsBase.EncodeTools)({ serializationFormat: flags.outputSerializationFormat, binaryEncoding: flags.format });
    const outputBuffer = outEnc.serializeObject(inEnc.deserializeObject(input, flags.inputSerializationFormat));
    output.end(outputBuffer);
    process.exit(0);
  }
}
