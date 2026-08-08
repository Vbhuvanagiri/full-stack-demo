import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.18.0-rc.1');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(288);

const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);

class _AffinePoint_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment());
  }
  fromValue(value_0) {
    return {
      x: _descriptor_1.fromValue(value_0),
      y: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.x).concat(_descriptor_1.toValue(value_0.y));
  }
}

const _descriptor_2 = new _AffinePoint_0();

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

class _Signature_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_3.alignment()));
  }
  fromValue(value_0) {
    return {
      bigR: _descriptor_2.fromValue(value_0),
      s: _descriptor_1.fromValue(value_0),
      recoveryId: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.bigR).concat(_descriptor_1.toValue(value_0.s).concat(_descriptor_3.toValue(value_0.recoveryId)));
  }
}

const _descriptor_4 = new _Signature_0();

class _RespondBidirectionalEvent_0 {
  alignment() {
    return _descriptor_4.alignment();
  }
  fromValue(value_0) {
    return {
      signature: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.signature);
  }
}

const _descriptor_5 = new _RespondBidirectionalEvent_0();

const _descriptor_6 = new __compactRuntime.CompactTypeBytes(128);

class _SignBidirectionalEventNotification_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_6.alignment());
  }
  fromValue(value_0) {
    return {
      version: _descriptor_3.fromValue(value_0),
      payload: _descriptor_6.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.version).concat(_descriptor_6.toValue(value_0.payload));
  }
}

const _descriptor_7 = new _SignBidirectionalEventNotification_0();

class _SignatureRespondedEvent_0 {
  alignment() {
    return _descriptor_4.alignment();
  }
  fromValue(value_0) {
    return {
      signature: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.signature);
  }
}

const _descriptor_8 = new _SignatureRespondedEvent_0();

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_10 = __compactRuntime.CompactTypeBoolean;

class _Either_0 {
  alignment() {
    return _descriptor_10.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_10.fromValue(value_0),
      left: _descriptor_1.fromValue(value_0),
      right: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_10.toValue(value_0.is_left).concat(_descriptor_1.toValue(value_0.left).concat(_descriptor_1.toValue(value_0.right)));
  }
}

const _descriptor_11 = new _Either_0();

const _descriptor_12 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.bytes);
  }
}

const _descriptor_13 = new _ContractAddress_0();

const _descriptor_14 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      signBidirectional: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`signBidirectional: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestId_0 = args_1[1];
        const notification_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('signBidirectional',
                                     'argument 1 (as invoked from Typescript)',
                                     'signet-contract.compact line 31 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestId_0.buffer instanceof ArrayBuffer && requestId_0.BYTES_PER_ELEMENT === 1 && requestId_0.length === 32)) {
          __compactRuntime.typeError('signBidirectional',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'signet-contract.compact line 31 char 1',
                                     'Bytes<32>',
                                     requestId_0)
        }
        if (!(typeof(notification_0) === 'object' && typeof(notification_0.version) === 'bigint' && notification_0.version >= 0n && notification_0.version <= 255n && notification_0.payload.buffer instanceof ArrayBuffer && notification_0.payload.BYTES_PER_ELEMENT === 1 && notification_0.payload.length === 128)) {
          __compactRuntime.typeError('signBidirectional',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'signet-contract.compact line 31 char 1',
                                     'struct SignBidirectionalEventNotification<version: Uint<0..256>, payload: Bytes<128>>',
                                     notification_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(requestId_0).concat(_descriptor_7.toValue(notification_0)),
            alignment: _descriptor_1.alignment().concat(_descriptor_7.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._signBidirectional_0(context,
                                                         partialProofData,
                                                         requestId_0,
                                                         notification_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      respond: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`respond: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestId_0 = args_1[1];
        const signatureRespondedEvent_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('respond',
                                     'argument 1 (as invoked from Typescript)',
                                     'signet-contract.compact line 52 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestId_0.buffer instanceof ArrayBuffer && requestId_0.BYTES_PER_ELEMENT === 1 && requestId_0.length === 32)) {
          __compactRuntime.typeError('respond',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'signet-contract.compact line 52 char 1',
                                     'Bytes<32>',
                                     requestId_0)
        }
        if (!(typeof(signatureRespondedEvent_0) === 'object' && typeof(signatureRespondedEvent_0.signature) === 'object' && typeof(signatureRespondedEvent_0.signature.bigR) === 'object' && signatureRespondedEvent_0.signature.bigR.x.buffer instanceof ArrayBuffer && signatureRespondedEvent_0.signature.bigR.x.BYTES_PER_ELEMENT === 1 && signatureRespondedEvent_0.signature.bigR.x.length === 32 && signatureRespondedEvent_0.signature.bigR.y.buffer instanceof ArrayBuffer && signatureRespondedEvent_0.signature.bigR.y.BYTES_PER_ELEMENT === 1 && signatureRespondedEvent_0.signature.bigR.y.length === 32 && signatureRespondedEvent_0.signature.s.buffer instanceof ArrayBuffer && signatureRespondedEvent_0.signature.s.BYTES_PER_ELEMENT === 1 && signatureRespondedEvent_0.signature.s.length === 32 && typeof(signatureRespondedEvent_0.signature.recoveryId) === 'bigint' && signatureRespondedEvent_0.signature.recoveryId >= 0n && signatureRespondedEvent_0.signature.recoveryId <= 255n)) {
          __compactRuntime.typeError('respond',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'signet-contract.compact line 52 char 1',
                                     'struct SignatureRespondedEvent<signature: struct Signature<bigR: struct AffinePoint<x: Bytes<32>, y: Bytes<32>>, s: Bytes<32>, recoveryId: Uint<0..256>>>',
                                     signatureRespondedEvent_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(requestId_0).concat(_descriptor_8.toValue(signatureRespondedEvent_0)),
            alignment: _descriptor_1.alignment().concat(_descriptor_8.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._respond_0(context,
                                               partialProofData,
                                               requestId_0,
                                               signatureRespondedEvent_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      respondBidirectional: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`respondBidirectional: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestId_0 = args_1[1];
        const respondBidirectionalEvent_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('respondBidirectional',
                                     'argument 1 (as invoked from Typescript)',
                                     'signet-contract.compact line 78 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestId_0.buffer instanceof ArrayBuffer && requestId_0.BYTES_PER_ELEMENT === 1 && requestId_0.length === 32)) {
          __compactRuntime.typeError('respondBidirectional',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'signet-contract.compact line 78 char 1',
                                     'Bytes<32>',
                                     requestId_0)
        }
        if (!(typeof(respondBidirectionalEvent_0) === 'object' && typeof(respondBidirectionalEvent_0.signature) === 'object' && typeof(respondBidirectionalEvent_0.signature.bigR) === 'object' && respondBidirectionalEvent_0.signature.bigR.x.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.x.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.x.length === 32 && respondBidirectionalEvent_0.signature.bigR.y.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.y.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.y.length === 32 && respondBidirectionalEvent_0.signature.s.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.s.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.s.length === 32 && typeof(respondBidirectionalEvent_0.signature.recoveryId) === 'bigint' && respondBidirectionalEvent_0.signature.recoveryId >= 0n && respondBidirectionalEvent_0.signature.recoveryId <= 255n)) {
          __compactRuntime.typeError('respondBidirectional',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'signet-contract.compact line 78 char 1',
                                     'struct RespondBidirectionalEvent<signature: struct Signature<bigR: struct AffinePoint<x: Bytes<32>, y: Bytes<32>>, s: Bytes<32>, recoveryId: Uint<0..256>>>',
                                     respondBidirectionalEvent_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(requestId_0).concat(_descriptor_5.toValue(respondBidirectionalEvent_0)),
            alignment: _descriptor_1.alignment().concat(_descriptor_5.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._respondBidirectional_0(context,
                                                            partialProofData,
                                                            requestId_0,
                                                            respondBidirectionalEvent_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      }
    };
    this.impureCircuits = {
      signBidirectional: this.circuits.signBidirectional,
      respond: this.circuits.respond,
      respondBidirectional: this.circuits.respondBidirectional
    };
    this.provableCircuits = {
      signBidirectional: this.circuits.signBidirectional,
      respond: this.circuits.respond,
      respondBidirectional: this.circuits.respondBidirectional
    };
  }
  async initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('signBidirectional', new __compactRuntime.ContractOperation());
    state_0.setOperation('respond', new __compactRuntime.ContractOperation());
    state_0.setOperation('respondBidirectional', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext('constructor', __compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    state_0.data = new __compactRuntime.ChargedState(context.callContext.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.callContext.currentPrivateState,
      currentZswapLocalState: context.callContext.currentZswapLocalState
    }
  }
  async _signBidirectional_0(context,
                             partialProofData,
                             requestId_0,
                             notification_0)
  {
    let t_0;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newArray()
                                                          .arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(1n),
                                                                                                           alignment: _descriptor_14.alignment() })).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(10n),
                                                                                                                                                                                                     alignment: _descriptor_3.alignment() })).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue((t_0 = { name:
                                                                                                                                                                                                                                                                                                                                      new Uint8Array([83, 105, 103, 110, 66, 105, 100, 105, 114, 101, 99, 116, 105, 111, 110, 97, 108, 69, 118, 101, 110, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                                                                                                                                                                                                                                                                                                    payload:
                                                                                                                                                                                                                                                                                                                                      Uint8Array.from([notification_0.version,
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(requestId_0,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(notification_0.payload,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(new Uint8Array(95),
                                                                                                                                                                                                                                                                                                                                                                     BigInt)],
                                                                                                                                                                                                                                                                                                                                                      Number) },
                                                                                                                                                                                                                                                                                                                            Uint8Array.from([...Array.from(t_0.name,
                                                                                                                                                                                                                                                                                                                                                           BigInt),
                                                                                                                                                                                                                                                                                                                                             ...Array.from(t_0.payload,
                                                                                                                                                                                                                                                                                                                                                           BigInt)],
                                                                                                                                                                                                                                                                                                                                            Number))),
                                                                                                                                                                                                                                                                                              alignment: _descriptor_0.alignment() }))
                                                          .encode() } },
                                       'log']);
    return [];
  }
  async _respond_0(context,
                   partialProofData,
                   requestId_0,
                   signatureRespondedEvent_0)
  {
    let t_0;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newArray()
                                                          .arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(1n),
                                                                                                           alignment: _descriptor_14.alignment() })).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(10n),
                                                                                                                                                                                                     alignment: _descriptor_3.alignment() })).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue((t_0 = { name:
                                                                                                                                                                                                                                                                                                                                      new Uint8Array([83, 105, 103, 110, 97, 116, 117, 114, 101, 82, 101, 115, 112, 111, 110, 100, 101, 100, 69, 118, 101, 110, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                                                                                                                                                                                                                                                                                                    payload:
                                                                                                                                                                                                                                                                                                                                      Uint8Array.from([...Array.from(requestId_0,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(signatureRespondedEvent_0.signature.bigR.x,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(signatureRespondedEvent_0.signature.bigR.y,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(signatureRespondedEvent_0.signature.s,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       signatureRespondedEvent_0.signature.recoveryId,
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(new Uint8Array(127),
                                                                                                                                                                                                                                                                                                                                                                     BigInt)],
                                                                                                                                                                                                                                                                                                                                                      Number) },
                                                                                                                                                                                                                                                                                                                            Uint8Array.from([...Array.from(t_0.name,
                                                                                                                                                                                                                                                                                                                                                           BigInt),
                                                                                                                                                                                                                                                                                                                                             ...Array.from(t_0.payload,
                                                                                                                                                                                                                                                                                                                                                           BigInt)],
                                                                                                                                                                                                                                                                                                                                            Number))),
                                                                                                                                                                                                                                                                                              alignment: _descriptor_0.alignment() }))
                                                          .encode() } },
                                       'log']);
    return [];
  }
  async _respondBidirectional_0(context,
                                partialProofData,
                                requestId_0,
                                respondBidirectionalEvent_0)
  {
    let t_0;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newArray()
                                                          .arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(1n),
                                                                                                           alignment: _descriptor_14.alignment() })).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(10n),
                                                                                                                                                                                                     alignment: _descriptor_3.alignment() })).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue((t_0 = { name:
                                                                                                                                                                                                                                                                                                                                      new Uint8Array([82, 101, 115, 112, 111, 110, 100, 66, 105, 100, 105, 114, 101, 99, 116, 105, 111, 110, 97, 108, 69, 118, 101, 110, 116, 0, 0, 0, 0, 0, 0, 0]),
                                                                                                                                                                                                                                                                                                                                    payload:
                                                                                                                                                                                                                                                                                                                                      Uint8Array.from([...Array.from(requestId_0,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(respondBidirectionalEvent_0.signature.bigR.x,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(respondBidirectionalEvent_0.signature.bigR.y,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(respondBidirectionalEvent_0.signature.s,
                                                                                                                                                                                                                                                                                                                                                                     BigInt),
                                                                                                                                                                                                                                                                                                                                                       respondBidirectionalEvent_0.signature.recoveryId,
                                                                                                                                                                                                                                                                                                                                                       ...Array.from(new Uint8Array(127),
                                                                                                                                                                                                                                                                                                                                                                     BigInt)],
                                                                                                                                                                                                                                                                                                                                                      Number) },
                                                                                                                                                                                                                                                                                                                            Uint8Array.from([...Array.from(t_0.name,
                                                                                                                                                                                                                                                                                                                                                           BigInt),
                                                                                                                                                                                                                                                                                                                                             ...Array.from(t_0.payload,
                                                                                                                                                                                                                                                                                                                                                           BigInt)],
                                                                                                                                                                                                                                                                                                                                            Number))),
                                                                                                                                                                                                                                                                                              alignment: _descriptor_0.alignment() }))
                                                          .encode() } },
                                       'log']);
    return [];
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    callContext: { currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() },
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
  };
}
const _emptyContext = {
  callContext: { currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() }
};
const _dummyContract = new Contract({ });
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
export const expectedVk = {
  'respond': 'eb818b22d69927732dd5f27674fc500e9e0784b729bf60025379128e6e3e1453',
  'respondBidirectional': 'b8f00268018b1c1ea09d067929559e6e2f4e1b8b5f2b5fcf162087fda8014647',
  'signBidirectional': '101ac368e366286272dbabd81ea7ca5c192e34fc69b7a3f5159d85054625214f',
};

//# sourceMappingURL=index.js.map
