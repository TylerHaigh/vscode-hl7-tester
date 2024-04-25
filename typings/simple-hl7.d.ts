// Taken from https://github.com/hitgeek/simple-hl7/pull/69/files

declare module 'simple-hl7' {

  import { EventEmitter } from 'events';
  import { Socket } from 'net';

  const Server: {
    createTcpServer(options: any, handler: any): TcpServer;
    createTcpClient(options: CreateTcpClientOptions): TcpClient;
    createTcpClient(host: string, port: number): TcpClient;
    createFileServer(options: any, handler: any): FileServer;
    createFileClient(dest: any): FileClient;
  };

  class Parser {
    constructor(opts?: ParserOptions);
    message: Message | null;
    delimiters: Delimiters;

    parse(s: string): Message;
    parseFile(path: string, callback: (data: string) => void): void;
    parseFileSync(path: string): string;
    parseHeader(s: string): Header;
    parseSegment(s: string): Segment;
    parseField(s: string): Field;
    parseComponent(s: string): Component;
  }

  class Message {
    constructor(...args: (string | string[])[]);
    header: Header;
    segments: Segment[];
    getSegment(name: string): Segment | undefined;
    getSegments(name: string): Segment[];
    addSegment<U>(...args: U[]): Segment;
    log(): string;
    toString(): string;
  }


  class Component {
    constructor(...args: string[]);
    toString(delimiters: Delimiters): string;
    value: string[];
  }


  class Field<T = any> {
    constructor(...args: T[]);
    constructor(...args: T[][]);
    value: (T | T[])[];
    toString(delimiters: Delimiters): string;
  }


  class Segment {
    name: string;
    fields: Field[] | Field[][];
    addField<T = any>(fieldValue: FieldValue<T>, position?: number): void;
    setField<T>(index: number, fieldValue: FieldValue<T>): void;
    removeField(index: number): void;
    getField(index: number, repeatIndex?: number): string;
    getComponent(
      fieldIndex: number,
      componentIndex: number,
      subComponentIndex?: number
    ): string;
    setComponent<T>(
      fieldIndex: number,
      componentIndex: number,
      value: ComponentValue<T>
    ): void;
    toString(delimiters: Delimiters): string;
  }



  interface Delimiters {
    fieldSeperator: "|";
    componentSeperator: "^";
    subcomponentSeperator: "&";
    escapeCharacter: "\\";
    repititionCharacter: "~";
    segmentSeperator: "\r";
  }

  class FileClient { }
  class FileServer { }


  class Header {
    name: string;
    delimiters: Delimiters;
    fields: (Field | Field[])[];
    addField<T = any>(fieldValue: FieldValue<T>, position?: number): void;
    setField<T>(index: number, fieldValue: FieldValue<T>): void;
    removeField(index: number): void;
    getField(index: number, repeatIndex?: number): string;
    getComponent(
      fieldIndex: number,
      componentIndex: number,
      subComponentIndex?: number
    ): string;
    toString(): string;
  }

  type ParserOptions = string | { segmentSeperator: string };

  type ComponentValue<T> = FieldValue<T>;

  type FieldValue<T> =
    | string
    | Record<string | number | symbol, unknown>
    | Array<T>
    | T;


  interface CreateTcpClientOptions {
    host: string;
    port: number;
    callback?: () => void;
    keepAlive?: boolean;
  }

  class TcpClient {
    connect(callback: (err: any, ack: any) => void): void
    send(msg: Message, callback: (err: any, ack: any) => void): void
    close(): void
  }

  interface CreateTcpServerOptions { host: string, port: number }
  type ServerHandlerFunction = (err: Error | null | undefined, req: Req | undefined, res: Res | undefined) => void;
  type StandardHandlerFunction = (req: Req, res: Res, next: Function) => void;
  type ErrorHandlerFunction = (err: Error, req: Req | undefined, res: Res | undefined, next: Function) => void;
  type HandlerFunction = StandardHandlerFunction | ErrorHandlerFunction;
  type NextFunction = (err: Error | null | undefined) => void;



  class TcpServer extends EventEmitter {

    constructor(
      options: CreateTcpServerOptions,
      handler: ServerHandlerFunction
    );

    start(port: number, encoding?: BufferEncoding, options?: any): void
    stop(): void
    createAckMessage(msg: Message): Message

    // protos
    use(fn: StandardHandlerFunction): void
    use(fn: ErrorHandlerFunction): void
  }


  function tcp(options?: any): TcpServer;
  function file(): any;

  class Req {
    msg: Message
    raw: string
    sender: string;
    facility: string
    type: string
    event: string
    constructor(msg: Message, raw: string);

  }

  class Res {
    ack: any
    socket: Socket
    constructor(socket: Socket, ack: string | Message);
    end(): void;
  }


  export {
    Server, Parser, Message, Component, Field,
    Segment, tcp, file, TcpClient, TcpServer,
    CreateTcpClientOptions, FileClient, FileServer,
    Header, ParserOptions, Req, Res, CreateTcpServerOptions
  };
}
