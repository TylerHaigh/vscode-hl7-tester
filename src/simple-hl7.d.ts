/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
declare module 'simple-hl7' {
  export class Header {
    constructor();

    getField(index: number, repeatIndex?: number): string;
  }

  export class Message {
    header: Header;
    constructor(...args: Array<string | Array<string>>);

    addSegment(...args: Array<string>): void;
    toString(): string;
  }

  export class Req {
    constructor(msg: any, raw: any);
  }

  export class Res {
    constructor(socket: any, ack: string | Message);
    end(): void;
  }

  export class Parser {
    constructor(opt?: string);
    parse(s: string): Message;
  }

  export class TcpServer {
    constructor(options: { host: string, port: number }, handler: ((socket: any) => void) | undefined);

    start(port: number, encoding?: BufferEncoding | undefined, options?: unknown): void;
    close(): void;
  }

  export class TcpClient {
    constructor();

    connect(cb: ((socket: any) => void) | undefined): void;
    send(msg: string, cb: ((socket: any) => void) | undefined): void;
    close(): void;
  }

  export class Server {
    static createTcpServer(handler?: ((err: any, req: Req, res: Res) => void) | undefined): TcpServer;
    static createTcpClient(...args: any[]): TcpClient;
  }
}
