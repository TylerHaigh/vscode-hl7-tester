// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { sendOneShot } from './one-shot-connection';


export interface VSCodeMessage {
    command: 'alert'
    text: string
    payload: {
        hl7: string
        server: string
        port: string
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('vscode-hl7-tester is now active');

    const hl7TestPanel = vscode.commands.registerCommand('hl7TestPanel.launch', () => {
        const panel = vscode.window.createWebviewPanel(
            'hl7TestPanel', // Identifies the type of the webview. Used internally
            'HL7 Test Panel', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
                enableScripts: true
            }

        );

        function getWebviewContent() {
            return `<!DOCTYPE html>
		  <html lang="en">
		  <head>
			  <meta charset="UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <title>Cat Coding</title>

			  <style>

			  	.hl7-text-box {
					width:100%;
					 white-space: pre;
					overflow-wrap: normal;
					overflow-x: scroll;
				}
			  </style>
		  </head>
		  <body>

		  		<h1>Message Editor</h1>
				<label for="hl7MessageEditor">HL7 Message</label>
				<textarea id="hl7MessageEditor" rows="10" class="hl7-text-box"></textarea>

				<hr />

				<h1>HL7 Connector Config</h1>
				<label for="server">Server Host</label>
				<input type="text" id="server" value="localhost" />

				<label for="port">Port</label>
				<input type="text" id="port"  value="8081"/>

				<hr />

				<input type="button" onclick="sendHl7Message()" value="Send" style="width:100%;"></input>

				<hr />

				<h1>HL7 Response</h1>
				<textarea id="hl7Response" rows="10" readonly="true" class="hl7-text-box" ></textarea>



				<script>


				// Handle the message inside the webview
				window.addEventListener('message', event => {

					const message = event.data; // The JSON data our extension sent

					switch (message.command) {
						case 'responseData': {
							const response = document.getElementById('hl7Response');

							const data = message.data;
							response.value = data;
						}

					}
				});


				function loadVSCodeApiOnlyOnce() {
					// https://stackoverflow.com/a/62968179
					// As per stack overflow link above
					// Only load the VSCode api once. Doing so multiple times
					// will result in hidden failures.

					if (!window.vscode) {
						const vscode = acquireVsCodeApi();
						window.vscode = vscode;
					}

					return window.vscode;
				}

				function sendHl7Message() {

					const vscode = loadVSCodeApiOnlyOnce();

					const hl7 = document.getElementById('hl7MessageEditor').value;
					const server = document.getElementById('server').value;
					const port = document.getElementById('port').value;

					vscode.postMessage({
                        command: 'alert',
						text: '🐛  on line 1' ,
						payload: {hl7, server, port}
                    })

					return false;
				}
				</script>


		  </body>
		  </html>`;
        }

        // And set its HTML content
        panel.webview.html = getWebviewContent();

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            (message: VSCodeMessage) => {
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
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(hl7TestPanel);
}

// This method is called when your extension is deactivated
export function deactivate() { }
