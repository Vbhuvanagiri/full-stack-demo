import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  signBidirectional(context: __compactRuntime.CircuitContext<PS>,
                    requestId_0: Uint8Array,
                    notification_0: { version: bigint, payload: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  respond(context: __compactRuntime.CircuitContext<PS>,
          requestId_0: Uint8Array,
          signatureRespondedEvent_0: { signature: { bigR: { x: Uint8Array,
                                                            y: Uint8Array
                                                          },
                                                    s: Uint8Array,
                                                    recoveryId: bigint
                                                  }
                                     }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  respondBidirectional(context: __compactRuntime.CircuitContext<PS>,
                       requestId_0: Uint8Array,
                       respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                           y: Uint8Array
                                                                         },
                                                                   s: Uint8Array,
                                                                   recoveryId: bigint
                                                                 }
                                                    }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  signBidirectional(context: __compactRuntime.CircuitContext<PS>,
                    requestId_0: Uint8Array,
                    notification_0: { version: bigint, payload: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  respond(context: __compactRuntime.CircuitContext<PS>,
          requestId_0: Uint8Array,
          signatureRespondedEvent_0: { signature: { bigR: { x: Uint8Array,
                                                            y: Uint8Array
                                                          },
                                                    s: Uint8Array,
                                                    recoveryId: bigint
                                                  }
                                     }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  respondBidirectional(context: __compactRuntime.CircuitContext<PS>,
                       requestId_0: Uint8Array,
                       respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                           y: Uint8Array
                                                                         },
                                                                   s: Uint8Array,
                                                                   recoveryId: bigint
                                                                 }
                                                    }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  signBidirectional(context: __compactRuntime.CircuitContext<PS>,
                    requestId_0: Uint8Array,
                    notification_0: { version: bigint, payload: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  respond(context: __compactRuntime.CircuitContext<PS>,
          requestId_0: Uint8Array,
          signatureRespondedEvent_0: { signature: { bigR: { x: Uint8Array,
                                                            y: Uint8Array
                                                          },
                                                    s: Uint8Array,
                                                    recoveryId: bigint
                                                  }
                                     }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  respondBidirectional(context: __compactRuntime.CircuitContext<PS>,
                       requestId_0: Uint8Array,
                       respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                           y: Uint8Array
                                                                         },
                                                                   s: Uint8Array,
                                                                   recoveryId: bigint
                                                                 }
                                                    }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
