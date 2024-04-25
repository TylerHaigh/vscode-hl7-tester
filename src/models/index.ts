export interface VSCodeMessage {
  command: 'sendHl7Message'
  payload: {
    hl7: string
    server: string
    port: string
  }
}

export interface HL7ConnectionDetails {
  host: string
  port: number
}
