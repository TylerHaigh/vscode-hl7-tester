import * as fs from 'fs';
import * as vscode from 'vscode';

export function getWebViewContent(
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel
) {

  // Get path to resource on disk
  const onDiskPath = vscode.Uri.joinPath(context.extensionUri, 'src/web', 'view.html');

  // And get the special URI to use with the webview
  const webViewFileUri = panel.webview.asWebviewUri(onDiskPath);

  const webView = fs.readFileSync(webViewFileUri.fsPath, 'utf8');
  return webView;
}