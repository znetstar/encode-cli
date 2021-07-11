import {Command, flags} from '@oclif/command'
import {
  BinaryEncoding,
  default as EncodeTools,
  DEFAULT_ENCODE_TOOLS_OPTIONS as DEFAULT_ENCODE_TOOLS_REGULAR_OPTIONS,
  EncodingOptions
} from '@etomon/encode-tools/lib/EncodeTools';

import {
  // @ts-ignore
  DEFAULT_ENCODE_TOOLS_NATIVE_OPTIONS as DEFAULT_ENCODE_TOOLS_NATIVE_OPTIONS
} from '@etomon/encode-tools/lib/EncodeToolsNative';
import {createReadStream, createWriteStream, existsSync, readFileSync, ReadStream, WriteStream} from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface IOCommandArgs {
  inputBuffer: string|'-'|undefined,
  returnValue: string|'-'|undefined
}
export interface CommandFlagsBase {
  args?: string[],
  help?: boolean
}

let defaults: EncodingOptions;


export function getDefaults(): EncodingOptions {
  if (defaults)
    return defaults;

  let DEFAULT_ENCODE_TOOLS_OPTIONS = EncodeToolsBase.isNative ? DEFAULT_ENCODE_TOOLS_NATIVE_OPTIONS : DEFAULT_ENCODE_TOOLS_REGULAR_OPTIONS;

  let rcFile: any;
  if (process.env.ENCLIRC) {
    rcFile = JSON.parse(process.env.ENCLIRC);
  } else {
    rcFile = (global as any).DEFAULT_ENCODE_TOOLS_OPTIONS || {};
  }

  if (!rcFile) {
    let viablePaths = [
      process.env.ENCLIRC_PATH,
      path.join(process.cwd(), '.enclirc'),
      path.join(os.homedir(), '.enclirc')
    ].filter(Boolean);

    for (let file of viablePaths) {
      try {
        if (file && existsSync(file)) {
          rcFile = JSON.parse(readFileSync(file, 'utf8'));
          break;
        }
      } catch (err) {
      }
    }
  }

  let origKeys = new Map();


  let keys = Object.keys(DEFAULT_ENCODE_TOOLS_OPTIONS).map((k) => {
    let key: string[] = [];
    for (let l of k.split('')) {
      let isUpperCase = l.toUpperCase() === l;
      if (isUpperCase) key.push('_');
      key.push(l.toUpperCase());
    }
    let newKey = `ENCLI_${key.join('')}`;
    origKeys.set(newKey, k);
    return newKey
  });

  for (let envVar in process.env) {
    if (keys.includes(envVar)) {
      rcFile[origKeys.get(envVar)] = process.env[envVar];
    }
  }

  defaults = {
    ...DEFAULT_ENCODE_TOOLS_OPTIONS,
    binaryEncoding: BinaryEncoding.nodeBuffer,
    ...rcFile
  };

  return defaults;
}

export default abstract class EncodeToolsBase extends Command {
  protected abstract encoder(args: unknown, flags: unknown): EncodeTools;

  static flags = {
    help: flags.help(),
    args: flags.string({
      multiple: true,
      char: 'a',
      required: false,
      description: 'Additional args to pass to the encoder'
    })
  }

  static ioArgs = [
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

  protected async getInputAsBuffer(args: IOCommandArgs|{ [name: string]: any }): Promise<Buffer> {
    let inputStream: ReadStream;

    if (!args.inputBuffer)
      args.inputBuffer = '-';

    if (args.inputBuffer !== '-')
      inputStream = createReadStream(args.inputBuffer);
    else
      inputStream = process.stdin as any as ReadStream;

    return await new Promise((resolve, reject) => {
      let buf: Buffer[] = [];
      inputStream.on('data', (data) => {
        buf.push(data);
      });

      inputStream.once('end', (() => {
        resolve(Buffer.concat(buf));
      }));

      inputStream.once('error', ((err: any) => {
        reject(err);
      }));
    });
  }

  protected async getOutputAsStream(args: IOCommandArgs|{ [name: string]: any }): Promise<WriteStream> {
    let outputStream: WriteStream;

    if (!args.returnValue)
      args.returnValue = '-';

    if (args.returnValue !== '-')
      outputStream = createWriteStream(args.returnValue);
    else
      outputStream = process.stdout as any as WriteStream;

    return outputStream;
  }

  protected async getInputOutput(args: IOCommandArgs|{ [name: string]: any }): Promise<{ input: Buffer, output: WriteStream }> {
    const [ input, output ] = await Promise.all([
      this.getInputAsBuffer(args as IOCommandArgs),
      this.getOutputAsStream(args as IOCommandArgs)
    ]);

    return { input, output };
  }

  abstract async run(): Promise<void>;

  static get isNative(): boolean {
    return Boolean((global as any).EncodeTools);
  }

  static get EncodeTools() {
    return this.isNative ? (global as any).EncodeTools : EncodeTools;
  }
}

export const DEFAULT_ENCODE_TOOLS_OPTIONS = EncodeToolsBase.isNative ? DEFAULT_ENCODE_TOOLS_NATIVE_OPTIONS : DEFAULT_ENCODE_TOOLS_REGULAR_OPTIONS;
