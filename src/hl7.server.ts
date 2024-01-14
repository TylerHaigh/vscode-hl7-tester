/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
// eslint-disable-next-line max-classes-per-file
import net from 'net';
import { Server } from 'net';

// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Message, Parser, Req, Res } from 'simple-hl7';

const FS = String.fromCharCode(0x1c);
const CR = String.fromCharCode(0x0d);
const VT = String.fromCharCode(0x0b);

export class Hl7TcpServer {
  protected server?: Server;
  private readonly parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  start(port: number, host: string): void {
    if (this.server) {
      this.server.close(error => console.error(error));
    }

    this.server = net.createServer(socket => {
      socket.on('end', () => console.log('client disconnected successfully.'));
      socket.on('data', data => {
        const message = data.toString();
        const hl7 = this.parser.parse(message.substring(1, message.length - 2));
        const ack = this.createAckMessage(hl7);

        socket.write(VT + ack.toString() + FS + CR);
      });

      socket.pipe(socket);
    });

    this.server.on('error', error => {
      console.error(error);
    });

    this.server.listen(port, host);
  }

  close(): void {
    if (!this.server) {
      console.log('Server was never initialized.');
      return;
    }

    this.server.close(error => console.error(error));
  }

  private createAckMessage(hl7: Message): Message {
    const ack = new Message(
      hl7.header.getField(3),
      hl7.header.getField(4),
      hl7.header.getField(1),
      hl7.header.getField(2),
      moment().format('YYYYMMDDHHmmss'),
      '',
      ['ACK'],
      `ACK${moment().format('YYYYMMDDHHmmss')}`,
      'P',
      '2.3');

    ack.addSegment('MSA', 'AA', hl7.header.getField(8));
    return ack;
  }
}
