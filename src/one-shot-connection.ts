import net from 'net';
import * as vscode from 'vscode';
import { HL7ConnectionDetails } from './models';

// HL7 byte marks
const VT = String.fromCharCode(0x0b);
const FS = String.fromCharCode(0x1c);
const CR = String.fromCharCode(0x0d);

export function sendOneShot(conn: HL7ConnectionDetails, message: string, panel: vscode.WebviewPanel) {

  const payload = VT + message + FS + CR;

  const socket = net.createConnection({
    host: conn.host,
    port: conn.port
  });

  socket.on('connect', () => {
    console.log('Socket has connected!');
  });

  socket.on('close', (hadError: boolean) => {
    console.log('Socket has closed' + (hadError ? ' with error' : ''));
  });

  socket.on('error', (err) => {
    console.error('Error detected: ' + err.message);
  });

  socket.on('data', (data: Buffer) => {
    let response = data.toString('utf8');

    response = response.replace(/[\r\n]+/g, '\n');

    console.log(response);

    // Send a message to our webview.
    panel.webview.postMessage({ command: 'responseData', data: response });
  });

  socket.on('end', () => {
    console.log('Socket has ended!');
  });

  socket.write(payload, (err) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    }

    socket.end();
  });

}
