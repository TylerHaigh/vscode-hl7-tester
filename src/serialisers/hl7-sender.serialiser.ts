import * as vscode from 'vscode';
import { Hl7SenderPanel } from '../panels';

export class Hl7SenderWebViewSerializer implements vscode.WebviewPanelSerializer {

  constructor(
    private readonly context: vscode.ExtensionContext
  ) { }

  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, _state: unknown) {

    // `state` is the state persisted using `setState` inside the webview
    // console.log(`Got state: ${state}`);

    // Restore the content of our webview.
    Hl7SenderPanel.revive(webviewPanel, this.context);
    return Promise.resolve();
  }
}
