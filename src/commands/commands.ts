import * as vscode from 'vscode';
import { getWebViewContent } from '../web';
import { VSCodeMessage } from '../models';
import { handleOnDidReceiveMessage } from './handlers';

export function hl7TestPanelSenderCommand(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'hl7TestPanel', // Identifies the type of the webview. Used internally
    'HL7 Test Panel', // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in.
    {
      enableScripts: true
    }

  );

  // And set its HTML content
  panel.webview.html = getWebViewContent('view.html', context, panel);

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    (message: VSCodeMessage) => handleOnDidReceiveMessage(message, panel),
    undefined,
    context.subscriptions
  );

  // panel.onDidDispose(() => handleOnDidReceiveMessage({
  //   command: 'stop'
  // }, panel));
}

export function hl7TestPanelReceiverCommand(_context: vscode.ExtensionContext) {
  // TODO: Create UI for receiving a HL7 message
}

