/* eslint-disable @typescript-eslint/no-floating-promises */
import * as vscode from 'vscode';
import { VSCodeMessage } from '../models';
import { sendOneShot } from '../one-shot-connection';

export function handleOnDidReceiveMessage(message: VSCodeMessage, panel: vscode.WebviewPanel) {
  switch (message.command) {
    case 'alert': {

      const details = message.payload;
      if (!details) { return; }

      if (!details.server || !details.port || !details.hl7) {
        vscode.window.showWarningMessage('No message sent. missing details.');
        return;
      }

      vscode.window.showInformationMessage(`Sending HL7 message to ${details.server}:${details.port}`);
      sendOneShot({ host: details.server, port: parseInt(details.port) }, details.hl7, panel);
      return;
    }

    default: {
      // Do nothing
      const unknownCommand = message.command as string;
      console.warn(`Unmapped handler for message command ${unknownCommand}`);
    }
  }
}
