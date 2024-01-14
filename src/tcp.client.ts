import net from 'net';

export class TcpClient {
  private socket?: net.Socket;

  start(port: number, host: string, cb: (data: Buffer) => void): TcpClient {
    this.socket = net.createConnection({
      host,
      port
    });

    this.socket.on('data', (data: Buffer) => {
      cb(data);
    });

    this.socket.on('connect', () => {
      console.log('Socket has connected!');
    });

    this.socket.on('close', (hadError: boolean) => {
      console.log(`Socket has closed${hadError ? ' with error' : ''}`);
    });

    this.socket.on('error', err => {
      console.error(`Error detected: ${err.message}`);
    });

    this.socket.on('end', () => {
      console.log('Socket has ended!');
    });

    return this;
  }

  send(payload: string | Uint8Array, cb?: ((err?: Error | undefined) => void) | undefined): void {
    this.socket?.write(payload, error => {
      if (cb) {
        cb(error);
      }
    });
  }

  close(): void {
    this.socket?.end();
    delete this.socket;
  }
}
