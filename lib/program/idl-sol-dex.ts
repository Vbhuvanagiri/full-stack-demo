/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_core_contracts.json`.
 */
export type SolanaDexContract = {
  "address": "DzSqpUpL8DJ1z3wNAFnPMKRPZQL1oEZrwwSnXkA4w8Ce",
  "metadata": {
    "name": "solanaCoreContracts",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimBtc",
      "discriminator": [
        171,
        129,
        74,
        3,
        215,
        249,
        44,
        164
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pendingDeposit",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  98,
                  116,
                  99,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "userBalance",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  98,
                  116,
                  99,
                  95,
                  98,
                  97,
                  108,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "pending_deposit.requester",
                "account": "pendingBtcDeposit"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "serializedOutput",
          "type": "bytes"
        },
        {
          "name": "signature",
          "type": {
            "defined": {
              "name": "signature"
            }
          }
        }
      ]
    },
    {
      "name": "claimErc20",
      "discriminator": [
        137,
        119,
        173,
        96,
        103,
        202,
        227,
        33
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pendingDeposit",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  101,
                  114,
                  99,
                  50,
                  48,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "userBalance",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "serializedOutput",
          "type": "bytes"
        },
        {
          "name": "signature",
          "type": {
            "defined": {
              "name": "signature"
            }
          }
        }
      ]
    },
    {
      "name": "completeWithdrawBtc",
      "discriminator": [
        38,
        128,
        71,
        114,
        184,
        50,
        131,
        32
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pendingWithdrawal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  98,
                  116,
                  99,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "userBalance",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  98,
                  116,
                  99,
                  95,
                  98,
                  97,
                  108,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "pending_withdrawal.requester",
                "account": "pendingBtcWithdrawal"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "serializedOutput",
          "type": "bytes"
        },
        {
          "name": "signature",
          "type": {
            "defined": {
              "name": "signature"
            }
          }
        }
      ]
    },
    {
      "name": "completeWithdrawErc20",
      "discriminator": [
        108,
        220,
        227,
        17,
        212,
        248,
        163,
        74
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pendingWithdrawal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  101,
                  114,
                  99,
                  50,
                  48,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "userBalance",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "serializedOutput",
          "type": "bytes"
        },
        {
          "name": "signature",
          "type": {
            "defined": {
              "name": "signature"
            }
          }
        }
      ]
    },
    {
      "name": "depositBtc",
      "discriminator": [
        198,
        160,
        142,
        68,
        156,
        232,
        70,
        202
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "requesterPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "requester"
              }
            ]
          }
        },
        {
          "name": "pendingDeposit",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  98,
                  116,
                  99,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "optional": true
        },
        {
          "name": "chainSignaturesState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "chainSignaturesProgram"
            }
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "chainSignaturesProgram"
            }
          }
        },
        {
          "name": "chainSignaturesProgram",
          "address": "H5tHfpYoEnarrrzcV7sWBcZhiKMvL2aRpUYvb1ydWkwS"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "instructions",
          "optional": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "requester",
          "type": "pubkey"
        },
        {
          "name": "inputs",
          "type": {
            "vec": {
              "defined": {
                "name": "btcInput"
              }
            }
          }
        },
        {
          "name": "outputs",
          "type": {
            "vec": {
              "defined": {
                "name": "btcOutput"
              }
            }
          }
        },
        {
          "name": "txParams",
          "type": {
            "defined": {
              "name": "btcDepositParams"
            }
          }
        }
      ]
    },
    {
      "name": "depositErc20",
      "discriminator": [
        22,
        2,
        82,
        3,
        29,
        137,
        71,
        85
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "requesterPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "requester"
              }
            ]
          }
        },
        {
          "name": "pendingDeposit",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  101,
                  114,
                  99,
                  50,
                  48,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "optional": true
        },
        {
          "name": "chainSignaturesState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "chainSignaturesProgram"
            }
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "chainSignaturesProgram"
            }
          }
        },
        {
          "name": "chainSignaturesProgram",
          "address": "H5tHfpYoEnarrrzcV7sWBcZhiKMvL2aRpUYvb1ydWkwS"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "instructions",
          "optional": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "requester",
          "type": "pubkey"
        },
        {
          "name": "erc20Address",
          "type": {
            "array": [
              "u8",
              20
            ]
          }
        },
        {
          "name": "recipientAddress",
          "type": {
            "array": [
              "u8",
              20
            ]
          }
        },
        {
          "name": "amount",
          "type": "u128"
        },
        {
          "name": "txParams",
          "type": {
            "defined": {
              "name": "evmTransactionParams"
            }
          }
        }
      ]
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "mpcRootPublicKey",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "withdrawBtc",
      "discriminator": [
        22,
        191,
        230,
        176,
        149,
        62,
        236,
        140
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "requester",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  98,
                  116,
                  99,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "userBalance",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  98,
                  116,
                  99,
                  95,
                  98,
                  97,
                  108,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "optional": true
        },
        {
          "name": "chainSignaturesState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "chainSignaturesProgram"
            }
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "chainSignaturesProgram"
            }
          }
        },
        {
          "name": "chainSignaturesProgram",
          "address": "H5tHfpYoEnarrrzcV7sWBcZhiKMvL2aRpUYvb1ydWkwS"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "instructions",
          "optional": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "inputs",
          "type": {
            "vec": {
              "defined": {
                "name": "btcInput"
              }
            }
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "recipientAddress",
          "type": "string"
        },
        {
          "name": "txParams",
          "type": {
            "defined": {
              "name": "btcWithdrawParams"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawErc20",
      "discriminator": [
        19,
        124,
        28,
        31,
        171,
        187,
        87,
        70
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "requester",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  101,
                  114,
                  99,
                  50,
                  48,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "userBalance",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  101,
                  114,
                  99,
                  50,
                  48,
                  95,
                  98,
                  97,
                  108,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "erc20Address"
              }
            ]
          }
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "optional": true
        },
        {
          "name": "chainSignaturesState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "chainSignaturesProgram"
            }
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "chainSignaturesProgram"
            }
          }
        },
        {
          "name": "chainSignaturesProgram",
          "address": "H5tHfpYoEnarrrzcV7sWBcZhiKMvL2aRpUYvb1ydWkwS"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "instructions",
          "optional": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "erc20Address",
          "type": {
            "array": [
              "u8",
              20
            ]
          }
        },
        {
          "name": "amount",
          "type": "u128"
        },
        {
          "name": "recipientAddress",
          "type": {
            "array": [
              "u8",
              20
            ]
          }
        },
        {
          "name": "txParams",
          "type": {
            "defined": {
              "name": "evmTransactionParams"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pendingBtcDeposit",
      "discriminator": [
        210,
        198,
        216,
        218,
        80,
        77,
        38,
        139
      ]
    },
    {
      "name": "pendingBtcWithdrawal",
      "discriminator": [
        215,
        0,
        70,
        221,
        85,
        240,
        166,
        85
      ]
    },
    {
      "name": "pendingErc20Deposit",
      "discriminator": [
        214,
        238,
        68,
        242,
        98,
        102,
        251,
        178
      ]
    },
    {
      "name": "pendingErc20Withdrawal",
      "discriminator": [
        33,
        60,
        7,
        188,
        11,
        40,
        41,
        150
      ]
    },
    {
      "name": "userBtcBalance",
      "discriminator": [
        15,
        220,
        25,
        120,
        133,
        118,
        246,
        20
      ]
    },
    {
      "name": "userErc20Balance",
      "discriminator": [
        29,
        16,
        203,
        40,
        208,
        43,
        221,
        11
      ]
    },
    {
      "name": "vaultConfig",
      "discriminator": [
        99,
        86,
        43,
        216,
        184,
        102,
        119,
        77
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "serializationError",
      "msg": "Serialization error"
    },
    {
      "code": 6001,
      "name": "functionNotFound",
      "msg": "Function not found in ABI"
    },
    {
      "code": 6002,
      "name": "invalidRequestId",
      "msg": "Invalid request ID"
    },
    {
      "code": 6003,
      "name": "invalidSignature",
      "msg": "Invalid signature"
    },
    {
      "code": 6004,
      "name": "transferFailed",
      "msg": "Transfer failed"
    },
    {
      "code": 6005,
      "name": "invalidOutput",
      "msg": "Invalid output format"
    },
    {
      "code": 6006,
      "name": "overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6007,
      "name": "invalidAddress",
      "msg": "Invalid address"
    },
    {
      "code": 6008,
      "name": "insufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6009,
      "name": "underflow",
      "msg": "Underflow error"
    },
    {
      "code": 6010,
      "name": "vaultOutputNotFound",
      "msg": "No vault outputs found in transaction"
    },
    {
      "code": 6011,
      "name": "insufficientInputs",
      "msg": "Provided inputs do not cover requested amount + fee"
    }
  ],
  "types": [
    {
      "name": "affinePoint",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "x",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "y",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "btcDepositParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lockTime",
            "type": "u32"
          },
          {
            "name": "caip2Id",
            "type": "string"
          },
          {
            "name": "vaultScriptPubkey",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "btcInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "txid",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "vout",
            "type": "u32"
          },
          {
            "name": "scriptPubkey",
            "type": "bytes"
          },
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "btcOutput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "scriptPubkey",
            "type": "bytes"
          },
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "btcWithdrawParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lockTime",
            "type": "u32"
          },
          {
            "name": "caip2Id",
            "type": "string"
          },
          {
            "name": "vaultScriptPubkey",
            "type": "bytes"
          },
          {
            "name": "recipientScriptPubkey",
            "type": "bytes"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "evmTransactionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": "u128"
          },
          {
            "name": "gasLimit",
            "type": "u128"
          },
          {
            "name": "maxFeePerGas",
            "type": "u128"
          },
          {
            "name": "maxPriorityFeePerGas",
            "type": "u128"
          },
          {
            "name": "nonce",
            "type": "u64"
          },
          {
            "name": "chainId",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pendingBtcDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "requester",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "path",
            "type": "string"
          },
          {
            "name": "requestId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "pendingBtcWithdrawal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "requester",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "recipientAddress",
            "type": "string"
          },
          {
            "name": "path",
            "type": "string"
          },
          {
            "name": "requestId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "pendingErc20Deposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "requester",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u128"
          },
          {
            "name": "erc20Address",
            "type": {
              "array": [
                "u8",
                20
              ]
            }
          },
          {
            "name": "path",
            "type": "string"
          },
          {
            "name": "requestId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "pendingErc20Withdrawal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "requester",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u128"
          },
          {
            "name": "erc20Address",
            "type": {
              "array": [
                "u8",
                20
              ]
            }
          },
          {
            "name": "recipientAddress",
            "type": {
              "array": [
                "u8",
                20
              ]
            }
          },
          {
            "name": "path",
            "type": "string"
          },
          {
            "name": "requestId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "signature",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bigR",
            "type": {
              "defined": {
                "name": "affinePoint"
              }
            }
          },
          {
            "name": "s",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "recoveryId",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userBtcBalance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userErc20Balance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "vaultConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mpcRootPublicKey",
            "docs": [
              "The full 64-byte uncompressed secp256k1 public key (without 0x04 prefix)"
            ],
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          }
        ]
      }
    }
  ]
};

import IDL_JSON from './solana_dex_contract.json';
export const IDL = IDL_JSON as SolanaDexContract;
