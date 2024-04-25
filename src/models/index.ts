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

interface HL7ConnectionFormDetails {
  host: string
  port: string
}

export interface ReceiverPanelEventMessage {
  command: 'startServer' | 'stopServer'
  payload: HL7ConnectionFormDetails
}
