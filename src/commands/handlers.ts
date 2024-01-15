/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as vscode from 'vscode';
import { VSCodeMessage } from '../models';
import { Hl7TcpServer } from '../hl7.server';
import { TcpClient } from '../tcp.client';

// https://code.visualstudio.com/api/language-extensions/language-server-extension-guide
let server: Hl7TcpServer | undefined;

export function handleOnDidReceiveMessage(message: VSCodeMessage, panel: vscode.WebviewPanel) {
  switch (message.command) {
    case 'alert': {
      const details = message.payload;
      if (!details) { return; }

      if (!details.server || !details.port || !details.hl7) {
        vscode.window.showWarningMessage('No message sent. missing details.');
        return;
      }

      const port = parseInt(details.port);
      const host = details.server;
      const client = new TcpClient();

      vscode.window.showInformationMessage(`Sending HL7 message to ${details.server}:${details.port}`);

      client.start(port, host, (data: Buffer) => {
        const response = data.toString('utf8').replace(/[\r\n]+/g, '\n');
        panel.webview.postMessage({ command: 'responseData', data: response });
      }).send(details.hl7, err => {
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

      if (!server) {
        server = new Hl7TcpServer();
      } else {
        // details may have changed (port, host)
        server.close();
        server = new Hl7TcpServer();
      }

      server.start(port, host);
      return;
    }

    case 'stop': {
      if (!server) { return; }
      server.close();
      server = undefined;
      return;
    }

    default: {
      // Do nothing
      const unknownCommand = message.command;
      console.warn(`Unmapped handler for message command ${unknownCommand}`);
    }
  }
}
