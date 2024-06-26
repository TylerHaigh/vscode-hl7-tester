/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import moment from 'moment';
import { Message, Parser, TcpServer, tcp } from 'simple-hl7';

export class Hl7TcpServer {
  private readonly parser = new Parser();
  private tcpServer?: TcpServer;

  constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly context: vscode.ExtensionContext
  ) { }


  start(port: number, _host: string): void {
    if (this.tcpServer) {
      this.tcpServer.stop();
    }

    this.tcpServer = tcp();

    this.tcpServer.use((req, res, _next) => {
      const msg = req.raw;

      this.panel.webview.postMessage({ command: 'responseData', data: msg });
      this.context.workspaceState.update('hl7Message', msg);

      res.end();
    });


    // this.tcpServer = net.createServer(socket => {
    //   socket.on('end', () => console.log('client disconnected successfully.'));
    //   socket.on('data', data => {
    //     const message = data.toString();
    //     const hl7 = this.parser.parse(message.substring(1, message.length - 2));
    //     const ack = this.createAckMessage(hl7);
    //     const FS = String.fromCharCode(0x1c);
    //     const CR = String.fromCharCode(0x0d);
    //     const VT = String.fromCharCode(0x0b);

    //     socket.write(VT + ack.toString() + FS + CR);
    //   });

    //   socket.pipe(socket);
    // });

    this.tcpServer.on('error', error => {
      console.error(error);
    });

    this.tcpServer.start(port);
  }

  close(): void {
    if (!this.tcpServer) {
      console.log('Server was never initialized.');
      return;
    }

    this.tcpServer.stop();
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
