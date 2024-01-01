// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { sendOneShot } from './one-shot-connection';
import { getWebViewContent } from './web';
import { VSCodeMessage } from './models';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('vscode-hl7-tester is now active');

  const hl7TestPanelSender = vscode.commands.registerCommand('hl7TestPanel.sender', () => hl7TestPanelSenderCommand(context));
  const hl7TestPanelReceiver = vscode.commands.registerCommand('hl7TestPanel.receiver', () => hl7TestPanelReceiverCommand(context));

  context.subscriptions.push(hl7TestPanelSender);
  context.subscriptions.push(hl7TestPanelReceiver);
}

function hl7TestPanelSenderCommand(context: vscode.ExtensionContext) {
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
}

function hl7TestPanelReceiverCommand(context: vscode.ExtensionContext) {
  // TODO: Create UI for receiving a HL7 message
}

function handleOnDidReceiveMessage(message: VSCodeMessage, panel: vscode.WebviewPanel) {
  switch (message.command) {
    case 'alert': {

      const details = message.payload;
      if (!details) { return; }

      if (!details.server || !details.port || !details.hl7) {
        vscode.window.showWarningMessage(`No message sent. missing details.`);
        return;
      }

      vscode.window.showInformationMessage(`Sending HL7 message to ${details.server}:${details.port}`);
      sendOneShot({ host: details.server, port: parseInt(details.port) }, details.hl7, panel);
      return;
    }
  }
}

// This method is called when your extension is deactivated
export function deactivate() { }
