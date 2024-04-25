import * as vscode from 'vscode';
import { Hl7ReceiverPanel } from '../panels';

export class Hl7ReceiverWebViewSerializer implements vscode.WebviewPanelSerializer {

  constructor(
    private readonly context: vscode.ExtensionContext
  ) { }

  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, _state: unknown) {

    // `state` is the state persisted using `setState` inside the webview
    // console.log(`Got state: ${JSON.stringify(_state)}`);

    // Restore the content of our webview.
    Hl7ReceiverPanel.revive(webviewPanel, this.context);
    return Promise.resolve();
  }
}
