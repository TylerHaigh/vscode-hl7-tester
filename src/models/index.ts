export interface HL7ConnectionFormDetails {
  host: string
  port: string
}

export type LineEnding = 'CR' | 'LF' | 'CRLF'
export interface SenderPanelEventMessage {
  command: 'sendHl7Message'
  payload: HL7ConnectionFormDetails & {
    hl7: string
    lineEnding: LineEnding
  }
}

export interface HL7ConnectionDetails {
  host: string
  port: number
}

export interface StartServerEvent {
  command: 'startServer'
  payload: HL7ConnectionFormDetails
}

export interface StopServerEvent {
  command: 'stopServer'
}

export interface WebViewEchoMessage {
  command: 'echo',
  message: string,
  data: unknown
}

export type ReceiverPanelEventMessage = StartServerEvent | StopServerEvent | WebViewEchoMessage;
