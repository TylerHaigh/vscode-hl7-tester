import * as vscode from 'vscode';
import { Hl7SenderPanel, Hl7ReceiverPanel } from '../panels';

export function hl7TestPanelSenderCommand(context: vscode.ExtensionContext) {
  Hl7SenderPanel.createOrShow(context);
}

export function hl7TestPanelReceiverCommand(context: vscode.ExtensionContext) {
  Hl7ReceiverPanel.createOrShow(context);
}

