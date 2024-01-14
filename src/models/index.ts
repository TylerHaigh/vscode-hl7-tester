export interface VSCodeMessage {
  command: string
  text: string
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
