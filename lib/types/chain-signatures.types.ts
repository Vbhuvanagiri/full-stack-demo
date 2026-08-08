import type { RSVSignature } from 'signet.js';

export interface RespondBidirectionalData {
  serializedOutput: Buffer;
  signature: RSVSignature;
}

// Event Listener Types
export interface EventListenerResult {
  signature: Promise<RSVSignature>;
  respondBidirectional: Promise<RespondBidirectionalData>;
  cleanup: () => void;
}
