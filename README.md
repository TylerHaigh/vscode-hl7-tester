# HL7 Test Panel

A VSCode extension that provides support for sending HL7 messages to a server. Inspired by HAPI Test Panel.

## How to Download

In Visual Studio Code, go to the VS Code Extension Marketplace and download the `TylerHaigh.hl7-tester` extension. Once activated, this extension's features should be automatically implemented.

## Contributions

This Extension contributes the following commands:

- `hl7TestPanel.sender` - Launch new Test Panel Sender
- `hl7TestPanel.receiver` - Launch new Test Panel Receiver


## Features

* Send a HL7 message to an MLLP Endpoint server
* Start a HL7 MLLP Server

TODO: 

* Allow for persistent outbound connections

## Release Notes

### 0.0.4

* Add option for specifying HL7 segment separator line endings.
* Fix issue with response processing by stripping of VT and FS characters

### 0.0.3

Include new contribution to launch a HL7 Receiver panel to stop/start a HL7 server listener

### 0.0.2

Fix issue with UI web html loading from incorrect path


### 0.0.1

Initial release of HL7 Test Panel
