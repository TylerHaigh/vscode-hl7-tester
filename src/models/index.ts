export interface HL7ConnectionFormDetails {
  host: string
  port: string
}
export interface SenderPanelEventMessage {
  command: 'sendHl7Message'
  payload: HL7ConnectionFormDetails & {
    hl7: string
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
