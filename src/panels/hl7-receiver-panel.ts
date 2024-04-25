import * as vscode from 'vscode';
import { Hl7TcpServer } from '../hl7.server';
import { Parser, Server } from 'simple-hl7';
import { ReceiverPanelEventMessage } from '../models';
import { getWebViewContent } from '../web';

let server: Hl7TcpServer | undefined;

function startServer(details: ReceiverPanelEventMessage['payload']) {
  if (!details.port) {
    vscode.window.showWarningMessage('Could not start TCP server. Missing port.');
    return;
  }

  const host = details.host;
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

function stopServer() {
  if (!server) { return; }
  server.close();
  server = undefined;
  return;
}

function handleOnDidReceiveMessage(message: ReceiverPanelEventMessage, panel: vscode.WebviewPanel) {

  const details = message.payload;
  if (!details) { return; }

  switch (message.command) {
    case 'startServer': return startServer(details);
    case 'stopServer': return stopServer();
    default: {
      // Do nothing
      const unknownCommand = message.command;
      console.warn(`Unmapped handler for message command ${unknownCommand}`);
    }
  }
}


export class Hl7ReceiverPanel {

  public static readonly PANEL_NAME = 'hl7TestPanelReceiver';
  private static CURRENT_PANEL: Hl7ReceiverPanel | undefined;

  public static revive(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext
  ) {
    Hl7ReceiverPanel.CURRENT_PANEL = new Hl7ReceiverPanel(panel, context);
  }

  public static createOrShow(context: vscode.ExtensionContext) {

    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (Hl7ReceiverPanel.CURRENT_PANEL) {
      Hl7ReceiverPanel.CURRENT_PANEL.panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const webPanel = vscode.window.createWebviewPanel(
      Hl7ReceiverPanel.PANEL_NAME, // Identifies the type of the webview. Used internally
      'HL7 Listener Panel', // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        enableScripts: true
      }
    );

    Hl7ReceiverPanel.CURRENT_PANEL = new Hl7ReceiverPanel(webPanel, context);
  }

  private disposables: vscode.Disposable[] = [];

  constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly context: vscode.ExtensionContext,
  ) {

    // Set the panel's HTML content
    this.panel.webview.html = getWebViewContent('listener.html', this.context.extensionUri, this.panel);

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message: ReceiverPanelEventMessage) => handleOnDidReceiveMessage(message, this.panel),
      undefined,
      this.context.subscriptions
    );

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  public dispose() {

    Hl7ReceiverPanel.CURRENT_PANEL = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) {
        d.dispose();
      }
    }
  }
}
