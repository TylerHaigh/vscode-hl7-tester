/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as vscode from 'vscode';
import { VSCodeMessage } from '../models';
import { Hl7TcpServer } from '../hl7.server';
import { TcpClient } from '../tcp.client';

export function handleOnDidReceiveMessage(message: VSCodeMessage, panel: vscode.WebviewPanel) {
  switch (message.command) {
    case 'alert': {
      const details = message.payload;
      if (!details) { return; }

      if (!details.server || !details.port || !details.hl7) {
        vscode.window.showWarningMessage('No message sent. missing details.');
        return;
      }
      // const host = details.server;
      const port = parseInt(details.port);
      const host = details.server;

      vscode.window.showInformationMessage(`Sending HL7 message to ${details.server}:${details.port}`);
      const client = new TcpClient();

      client
        .start(port, host, (data: Buffer) => {
          const response = data.toString('utf8').replace(/[\r\n]+/g, '\n');
          panel.webview.postMessage({ command: 'responseData', data: response });
        })
        .send(details.hl7, err => {
          if (err) {
            vscode.window.showErrorMessage(err.message);
          }
        });

      client.close();

      return;
    }

    case 'start': {
      const details = message.payload;
      if (!details) { return; }

      if (!details.server || !details.port) {
        vscode.window.showWarningMessage('Could not start TCP server. Missing details.');
        return;
      }

      const host = details.server;
      const port = parseInt(details.port);
      const server = new Hl7TcpServer();

      server.start(port, host);

      return;
    }

    case 'close': {
      return;
    }

    default: {
      // Do nothing
      const unknownCommand = message.command;
      console.warn(`Unmapped handler for message command ${unknownCommand}`);
    }
  }
}
