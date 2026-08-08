import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  callerSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  initialize(context: __compactRuntime.CircuitContext<PS>,
             vaultEvm_0: Uint8Array,
             swapRouter_0: Uint8Array,
             chainId_0: bigint,
             chainCaip2Id_0: Uint8Array,
             responseKey_0: __compactRuntime.Secp256k1Point): Promise<__compactRuntime.CircuitResults<PS, []>>;
  deposit(context: __compactRuntime.CircuitContext<PS>,
          evmNonce_0: bigint,
          gasLimit_0: bigint,
          maxFeePerGas_0: bigint,
          maxPriorityFeePerGas_0: bigint,
          keyVersion_0: bigint,
          depositRequest_0: { erc20Address: Uint8Array, amount: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claim(context: __compactRuntime.CircuitContext<PS>,
        requestId_0: Uint8Array,
        respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                            y: Uint8Array
                                                          },
                                                    s: Uint8Array,
                                                    recoveryId: bigint
                                                  }
                                     },
        serializedOutput_0: Uint8Array,
        mintNonce_0: Uint8Array,
        recipient_0: { is_some: boolean,
                       value: { is_left: boolean,
                                left: { bytes: Uint8Array },
                                right: { bytes: Uint8Array }
                              }
                     }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  withdraw(context: __compactRuntime.CircuitContext<PS>,
           evmNonce_0: bigint,
           keyVersion_0: bigint,
           withdrawRequest_0: { erc20Address: Uint8Array,
                                amount: bigint,
                                destEvmAddress: Uint8Array
                              },
           coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  completeWithdraw(context: __compactRuntime.CircuitContext<PS>,
                   requestId_0: Uint8Array,
                   respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                       y: Uint8Array
                                                                     },
                                                               s: Uint8Array,
                                                               recoveryId: bigint
                                                             }
                                                },
                   serializedOutput_0: Uint8Array,
                   mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  refund(context: __compactRuntime.CircuitContext<PS>,
         requestId_0: Uint8Array,
         respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                             y: Uint8Array
                                                           },
                                                     s: Uint8Array,
                                                     recoveryId: bigint
                                                   }
                                      },
         serializedOutput_0: Uint8Array,
         mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  approveRouter(context: __compactRuntime.CircuitContext<PS>,
                erc20Address_0: Uint8Array,
                evmNonce_0: bigint,
                keyVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  swap(context: __compactRuntime.CircuitContext<PS>,
       evmNonce_0: bigint,
       keyVersion_0: bigint,
       swapRequest_0: { tokenIn: Uint8Array,
                        tokenOut: Uint8Array,
                        fee: bigint,
                        amountOut: bigint,
                        amountInMaximum: bigint
                      },
       coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  completeSwap(context: __compactRuntime.CircuitContext<PS>,
               requestId_0: Uint8Array,
               respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                   y: Uint8Array
                                                                 },
                                                           s: Uint8Array,
                                                           recoveryId: bigint
                                                         }
                                            },
               serializedOutput_0: Uint8Array,
               mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  initialize(context: __compactRuntime.CircuitContext<PS>,
             vaultEvm_0: Uint8Array,
             swapRouter_0: Uint8Array,
             chainId_0: bigint,
             chainCaip2Id_0: Uint8Array,
             responseKey_0: __compactRuntime.Secp256k1Point): Promise<__compactRuntime.CircuitResults<PS, []>>;
  deposit(context: __compactRuntime.CircuitContext<PS>,
          evmNonce_0: bigint,
          gasLimit_0: bigint,
          maxFeePerGas_0: bigint,
          maxPriorityFeePerGas_0: bigint,
          keyVersion_0: bigint,
          depositRequest_0: { erc20Address: Uint8Array, amount: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claim(context: __compactRuntime.CircuitContext<PS>,
        requestId_0: Uint8Array,
        respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                            y: Uint8Array
                                                          },
                                                    s: Uint8Array,
                                                    recoveryId: bigint
                                                  }
                                     },
        serializedOutput_0: Uint8Array,
        mintNonce_0: Uint8Array,
        recipient_0: { is_some: boolean,
                       value: { is_left: boolean,
                                left: { bytes: Uint8Array },
                                right: { bytes: Uint8Array }
                              }
                     }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  withdraw(context: __compactRuntime.CircuitContext<PS>,
           evmNonce_0: bigint,
           keyVersion_0: bigint,
           withdrawRequest_0: { erc20Address: Uint8Array,
                                amount: bigint,
                                destEvmAddress: Uint8Array
                              },
           coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  completeWithdraw(context: __compactRuntime.CircuitContext<PS>,
                   requestId_0: Uint8Array,
                   respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                       y: Uint8Array
                                                                     },
                                                               s: Uint8Array,
                                                               recoveryId: bigint
                                                             }
                                                },
                   serializedOutput_0: Uint8Array,
                   mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  refund(context: __compactRuntime.CircuitContext<PS>,
         requestId_0: Uint8Array,
         respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                             y: Uint8Array
                                                           },
                                                     s: Uint8Array,
                                                     recoveryId: bigint
                                                   }
                                      },
         serializedOutput_0: Uint8Array,
         mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  approveRouter(context: __compactRuntime.CircuitContext<PS>,
                erc20Address_0: Uint8Array,
                evmNonce_0: bigint,
                keyVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  swap(context: __compactRuntime.CircuitContext<PS>,
       evmNonce_0: bigint,
       keyVersion_0: bigint,
       swapRequest_0: { tokenIn: Uint8Array,
                        tokenOut: Uint8Array,
                        fee: bigint,
                        amountOut: bigint,
                        amountInMaximum: bigint
                      },
       coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  completeSwap(context: __compactRuntime.CircuitContext<PS>,
               requestId_0: Uint8Array,
               respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                   y: Uint8Array
                                                                 },
                                                           s: Uint8Array,
                                                           recoveryId: bigint
                                                         }
                                            },
               serializedOutput_0: Uint8Array,
               mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
  vaultResponseSchema(): Uint8Array;
  vaultTokenDomainSeparator(erc20Address_0: Uint8Array): Uint8Array;
  userCommitment(sk_0: Uint8Array): Uint8Array;
  withdrawRefundCommitment(sk_0: Uint8Array, requestId_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  vaultResponseSchema(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  vaultTokenDomainSeparator(context: __compactRuntime.CircuitContext<PS>,
                            erc20Address_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  userCommitment(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  withdrawRefundCommitment(context: __compactRuntime.CircuitContext<PS>,
                           sk_0: Uint8Array,
                           requestId_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  initialize(context: __compactRuntime.CircuitContext<PS>,
             vaultEvm_0: Uint8Array,
             swapRouter_0: Uint8Array,
             chainId_0: bigint,
             chainCaip2Id_0: Uint8Array,
             responseKey_0: __compactRuntime.Secp256k1Point): Promise<__compactRuntime.CircuitResults<PS, []>>;
  deposit(context: __compactRuntime.CircuitContext<PS>,
          evmNonce_0: bigint,
          gasLimit_0: bigint,
          maxFeePerGas_0: bigint,
          maxPriorityFeePerGas_0: bigint,
          keyVersion_0: bigint,
          depositRequest_0: { erc20Address: Uint8Array, amount: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claim(context: __compactRuntime.CircuitContext<PS>,
        requestId_0: Uint8Array,
        respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                            y: Uint8Array
                                                          },
                                                    s: Uint8Array,
                                                    recoveryId: bigint
                                                  }
                                     },
        serializedOutput_0: Uint8Array,
        mintNonce_0: Uint8Array,
        recipient_0: { is_some: boolean,
                       value: { is_left: boolean,
                                left: { bytes: Uint8Array },
                                right: { bytes: Uint8Array }
                              }
                     }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  withdraw(context: __compactRuntime.CircuitContext<PS>,
           evmNonce_0: bigint,
           keyVersion_0: bigint,
           withdrawRequest_0: { erc20Address: Uint8Array,
                                amount: bigint,
                                destEvmAddress: Uint8Array
                              },
           coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  completeWithdraw(context: __compactRuntime.CircuitContext<PS>,
                   requestId_0: Uint8Array,
                   respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                       y: Uint8Array
                                                                     },
                                                               s: Uint8Array,
                                                               recoveryId: bigint
                                                             }
                                                },
                   serializedOutput_0: Uint8Array,
                   mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  refund(context: __compactRuntime.CircuitContext<PS>,
         requestId_0: Uint8Array,
         respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                             y: Uint8Array
                                                           },
                                                     s: Uint8Array,
                                                     recoveryId: bigint
                                                   }
                                      },
         serializedOutput_0: Uint8Array,
         mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  approveRouter(context: __compactRuntime.CircuitContext<PS>,
                erc20Address_0: Uint8Array,
                evmNonce_0: bigint,
                keyVersion_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  swap(context: __compactRuntime.CircuitContext<PS>,
       evmNonce_0: bigint,
       keyVersion_0: bigint,
       swapRequest_0: { tokenIn: Uint8Array,
                        tokenOut: Uint8Array,
                        fee: bigint,
                        amountOut: bigint,
                        amountInMaximum: bigint
                      },
       coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  completeSwap(context: __compactRuntime.CircuitContext<PS>,
               requestId_0: Uint8Array,
               respondBidirectionalEvent_0: { signature: { bigR: { x: Uint8Array,
                                                                   y: Uint8Array
                                                                 },
                                                           s: Uint8Array,
                                                           recoveryId: bigint
                                                         }
                                            },
               serializedOutput_0: Uint8Array,
               mintNonce_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
  signBidirectionalEventMap: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { sender: { bytes: Uint8Array },
                                 requestNonce: bigint,
                                 keyVersion: bigint,
                                 path: Uint8Array,
                                 algo: number,
                                 dest: number,
                                 params: Uint8Array,
                                 txParamType: number,
                                 txParams: { chainId: bigint,
                                             nonce: bigint,
                                             maxPriorityFeePerGas: bigint,
                                             maxFeePerGas: bigint,
                                             gasLimit: bigint,
                                             to: Uint8Array,
                                             value: bigint,
                                             calldata: { is_some: boolean,
                                                         value: { selector: Uint8Array,
                                                                  noWords: bigint,
                                                                  words: Uint8Array[]
                                                                }
                                                       },
                                             accessListEntryCount: bigint,
                                             accessList: { address: Uint8Array,
                                                           storageKeyCount: bigint,
                                                           storageKeys: Uint8Array[]
                                                         }[]
                                           },
                                 caip2Id: Uint8Array,
                                 outputDeserializationSchema: Uint8Array,
                                 respondSerializationSchema: Uint8Array
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { sender: { bytes: Uint8Array },
  requestNonce: bigint,
  keyVersion: bigint,
  path: Uint8Array,
  algo: number,
  dest: number,
  params: Uint8Array,
  txParamType: number,
  txParams: { chainId: bigint,
              nonce: bigint,
              maxPriorityFeePerGas: bigint,
              maxFeePerGas: bigint,
              gasLimit: bigint,
              to: Uint8Array,
              value: bigint,
              calldata: { is_some: boolean,
                          value: { selector: Uint8Array,
                                   noWords: bigint,
                                   words: Uint8Array[]
                                 }
                        },
              accessListEntryCount: bigint,
              accessList: { address: Uint8Array,
                            storageKeyCount: bigint,
                            storageKeys: Uint8Array[]
                          }[]
            },
  caip2Id: Uint8Array,
  outputDeserializationSchema: Uint8Array,
  respondSerializationSchema: Uint8Array
}]>
  };
  readonly mpcResponseKey: __compactRuntime.Secp256k1Point;
  readonly signetRequestNonce: bigint;
  readonly initialized: bigint;
  readonly vaultEvmAddress: Uint8Array;
  readonly evmChainId: bigint;
  readonly caip2Id: Uint8Array;
  refundCommitment: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  readonly uniswapRouter: Uint8Array;
  swapEventMap: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { sender: { bytes: Uint8Array },
                                 requestNonce: bigint,
                                 keyVersion: bigint,
                                 path: Uint8Array,
                                 algo: number,
                                 dest: number,
                                 params: Uint8Array,
                                 txParamType: number,
                                 txParams: { chainId: bigint,
                                             nonce: bigint,
                                             maxPriorityFeePerGas: bigint,
                                             maxFeePerGas: bigint,
                                             gasLimit: bigint,
                                             to: Uint8Array,
                                             value: bigint,
                                             calldata: { is_some: boolean,
                                                         value: { selector: Uint8Array,
                                                                  noWords: bigint,
                                                                  words: Uint8Array[]
                                                                }
                                                       },
                                             accessListEntryCount: bigint,
                                             accessList: { address: Uint8Array,
                                                           storageKeyCount: bigint,
                                                           storageKeys: Uint8Array[]
                                                         }[]
                                           },
                                 caip2Id: Uint8Array,
                                 outputDeserializationSchema: Uint8Array,
                                 respondSerializationSchema: Uint8Array
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { sender: { bytes: Uint8Array },
  requestNonce: bigint,
  keyVersion: bigint,
  path: Uint8Array,
  algo: number,
  dest: number,
  params: Uint8Array,
  txParamType: number,
  txParams: { chainId: bigint,
              nonce: bigint,
              maxPriorityFeePerGas: bigint,
              maxFeePerGas: bigint,
              gasLimit: bigint,
              to: Uint8Array,
              value: bigint,
              calldata: { is_some: boolean,
                          value: { selector: Uint8Array,
                                   noWords: bigint,
                                   words: Uint8Array[]
                                 }
                        },
              accessListEntryCount: bigint,
              accessList: { address: Uint8Array,
                            storageKeyCount: bigint,
                            storageKeys: Uint8Array[]
                          }[]
            },
  caip2Id: Uint8Array,
  outputDeserializationSchema: Uint8Array,
  respondSerializationSchema: Uint8Array
}]>
  };
  swapRefundCommitment: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               deployerCommitment_0: Uint8Array,
               signetContract_0: { bytes: Uint8Array }): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
