import * as fs from 'fs';
import * as vscode from 'vscode';

export function getWebViewContent(
  fileName: string,
  extensionUri: vscode.Uri,
  panel: vscode.WebviewPanel
) {

  // Get path to resource on disk
  const onDiskPath = vscode.Uri.joinPath(extensionUri, 'assets', fileName);

  // And get the special URI to use with the webview
  const webViewFileUri = panel.webview.asWebviewUri(onDiskPath);

  const webView = fs.readFileSync(webViewFileUri.fsPath, 'utf8');
  return webView;
}
