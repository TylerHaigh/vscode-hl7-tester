// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { hl7TestPanelReceiverCommand, hl7TestPanelSenderCommand } from './commands';
import { Hl7ReceiverWebViewSerializer, Hl7SenderWebViewSerializer } from './serialisers';
import { Hl7ReceiverPanel, Hl7SenderPanel } from './panels';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('vscode-hl7-tester is now active');

  const hl7TestPanelSender = vscode.commands.registerCommand(
    'hl7TestPanel.sender', () => hl7TestPanelSenderCommand(context)
  );

  const hl7TestPanelReceiver = vscode.commands.registerCommand(
    'hl7TestPanel.receiver', () => hl7TestPanelReceiverCommand(context)
  );

  context.subscriptions.push(hl7TestPanelSender);
  context.subscriptions.push(hl7TestPanelReceiver);

  // Register a serializer for reloading webview type
  vscode.window.registerWebviewPanelSerializer(
    Hl7SenderPanel.PANEL_NAME,
    new Hl7SenderWebViewSerializer(context)
  );

  // Register a serializer for reloading webview type
  vscode.window.registerWebviewPanelSerializer(
    Hl7ReceiverPanel.PANEL_NAME,
    new Hl7ReceiverWebViewSerializer(context)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  /** Not defined as yet... */
}
