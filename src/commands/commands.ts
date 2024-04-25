import * as vscode from 'vscode';
import { Hl7SenderPanel } from '../panels/hl7-sender.panel';

export function hl7TestPanelSenderCommand(context: vscode.ExtensionContext) {
  Hl7SenderPanel.createOrShow(context);
}

export function hl7TestPanelReceiverCommand(_context: vscode.ExtensionContext) {
  // TODO: Create UI for receiving a HL7 message
}

