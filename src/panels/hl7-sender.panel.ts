import * as vscode from 'vscode';
import { getWebViewContent } from '../web';
import { VSCodeMessage } from '../models';
import { handleOnDidReceiveMessage } from '../handlers';

export class Hl7SenderPanel {

  public static readonly PANEL_NAME = 'hl7TestPanelSender';
  private static CURRENT_PANEL: Hl7SenderPanel | undefined;

  public static revive(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext
  ) {
    Hl7SenderPanel.CURRENT_PANEL = new Hl7SenderPanel(panel, context);
  }

  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (Hl7SenderPanel.CURRENT_PANEL) {
      Hl7SenderPanel.CURRENT_PANEL.panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const webPanel = vscode.window.createWebviewPanel(
      Hl7SenderPanel.PANEL_NAME, // Identifies the type of the webview. Used internally
      'HL7 Test Panel', // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        enableScripts: true
      }
    );

    Hl7SenderPanel.CURRENT_PANEL = new Hl7SenderPanel(webPanel, context);
  }

  private disposables: vscode.Disposable[] = [];

  constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly context: vscode.ExtensionContext,
  ) {

    // Set the panel's HTML content
    this.panel.webview.html = getWebViewContent('view.html', this.context.extensionUri, this.panel);

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message: VSCodeMessage) => handleOnDidReceiveMessage(message, this.panel),
      undefined,
      this.context.subscriptions
    );

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  public dispose() {

    Hl7SenderPanel.CURRENT_PANEL = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) {
        d.dispose();
      }
    }
  }




}
