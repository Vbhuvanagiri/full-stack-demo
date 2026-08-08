import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
import * as __compactContractsImport_SignetSigner from '../../SignetSigner/contract/index.js';
__compactRuntime.checkRuntimeVersion('0.18.0-rc.1');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = __compactRuntime.CompactTypeBoolean;

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_3 = __compactRuntime.CompactTypeSecp256k1Point;

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_4 = new _ContractAddress_0();

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_6 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_7 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_8 = new __compactRuntime.CompactTypeBytes(64);

const _descriptor_9 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_10 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

const _descriptor_11 = new __compactRuntime.CompactTypeBytes(20);

const _descriptor_12 = new __compactRuntime.CompactTypeBytes(4);

const _descriptor_13 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_14 = new __compactRuntime.CompactTypeVector(7, _descriptor_0);

class _EvmCalldata_0 {
  alignment() {
    return _descriptor_12.alignment().concat(_descriptor_13.alignment().concat(_descriptor_14.alignment()));
  }
  fromValue(value_0) {
    return {
      selector: _descriptor_12.fromValue(value_0),
      noWords: _descriptor_13.fromValue(value_0),
      words: _descriptor_14.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_12.toValue(value_0.selector).concat(_descriptor_13.toValue(value_0.noWords).concat(_descriptor_14.toValue(value_0.words)));
  }
}

const _descriptor_15 = new _EvmCalldata_0();

class _Maybe_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_15.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_1.fromValue(value_0),
      value: _descriptor_15.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_some).concat(_descriptor_15.toValue(value_0.value));
  }
}

const _descriptor_16 = new _Maybe_0();

const _descriptor_17 = new __compactRuntime.CompactTypeVector(0, _descriptor_0);

class _EvmAccessListEntry_0 {
  alignment() {
    return _descriptor_11.alignment().concat(_descriptor_5.alignment().concat(_descriptor_17.alignment()));
  }
  fromValue(value_0) {
    return {
      address: _descriptor_11.fromValue(value_0),
      storageKeyCount: _descriptor_5.fromValue(value_0),
      storageKeys: _descriptor_17.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_11.toValue(value_0.address).concat(_descriptor_5.toValue(value_0.storageKeyCount).concat(_descriptor_17.toValue(value_0.storageKeys)));
  }
}

const _descriptor_18 = new _EvmAccessListEntry_0();

const _descriptor_19 = new __compactRuntime.CompactTypeVector(0, _descriptor_18);

class _EvmType2TxParams_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_10.alignment().concat(_descriptor_10.alignment().concat(_descriptor_2.alignment().concat(_descriptor_11.alignment().concat(_descriptor_10.alignment().concat(_descriptor_16.alignment().concat(_descriptor_5.alignment().concat(_descriptor_19.alignment())))))))));
  }
  fromValue(value_0) {
    return {
      chainId: _descriptor_2.fromValue(value_0),
      nonce: _descriptor_2.fromValue(value_0),
      maxPriorityFeePerGas: _descriptor_10.fromValue(value_0),
      maxFeePerGas: _descriptor_10.fromValue(value_0),
      gasLimit: _descriptor_2.fromValue(value_0),
      to: _descriptor_11.fromValue(value_0),
      value: _descriptor_10.fromValue(value_0),
      calldata: _descriptor_16.fromValue(value_0),
      accessListEntryCount: _descriptor_5.fromValue(value_0),
      accessList: _descriptor_19.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.chainId).concat(_descriptor_2.toValue(value_0.nonce).concat(_descriptor_10.toValue(value_0.maxPriorityFeePerGas).concat(_descriptor_10.toValue(value_0.maxFeePerGas).concat(_descriptor_2.toValue(value_0.gasLimit).concat(_descriptor_11.toValue(value_0.to).concat(_descriptor_10.toValue(value_0.value).concat(_descriptor_16.toValue(value_0.calldata).concat(_descriptor_5.toValue(value_0.accessListEntryCount).concat(_descriptor_19.toValue(value_0.accessList))))))))));
  }
}

const _descriptor_20 = new _EvmType2TxParams_0();

const _descriptor_21 = new __compactRuntime.CompactTypeBytes(38);

const _descriptor_22 = new __compactRuntime.CompactTypeBytes(37);

class _SignBidirectionalEvent_0 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_2.alignment().concat(_descriptor_5.alignment().concat(_descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment().concat(_descriptor_9.alignment().concat(_descriptor_20.alignment().concat(_descriptor_0.alignment().concat(_descriptor_21.alignment().concat(_descriptor_22.alignment())))))))))));
  }
  fromValue(value_0) {
    return {
      sender: _descriptor_4.fromValue(value_0),
      requestNonce: _descriptor_2.fromValue(value_0),
      keyVersion: _descriptor_5.fromValue(value_0),
      path: _descriptor_0.fromValue(value_0),
      algo: _descriptor_6.fromValue(value_0),
      dest: _descriptor_7.fromValue(value_0),
      params: _descriptor_8.fromValue(value_0),
      txParamType: _descriptor_9.fromValue(value_0),
      txParams: _descriptor_20.fromValue(value_0),
      caip2Id: _descriptor_0.fromValue(value_0),
      outputDeserializationSchema: _descriptor_21.fromValue(value_0),
      respondSerializationSchema: _descriptor_22.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.sender).concat(_descriptor_2.toValue(value_0.requestNonce).concat(_descriptor_5.toValue(value_0.keyVersion).concat(_descriptor_0.toValue(value_0.path).concat(_descriptor_6.toValue(value_0.algo).concat(_descriptor_7.toValue(value_0.dest).concat(_descriptor_8.toValue(value_0.params).concat(_descriptor_9.toValue(value_0.txParamType).concat(_descriptor_20.toValue(value_0.txParams).concat(_descriptor_0.toValue(value_0.caip2Id).concat(_descriptor_21.toValue(value_0.outputDeserializationSchema).concat(_descriptor_22.toValue(value_0.respondSerializationSchema))))))))))));
  }
}

const _descriptor_23 = new _SignBidirectionalEvent_0();

class _AffinePoint_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      x: _descriptor_0.fromValue(value_0),
      y: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.x).concat(_descriptor_0.toValue(value_0.y));
  }
}

const _descriptor_24 = new _AffinePoint_0();

class _Signature_0 {
  alignment() {
    return _descriptor_24.alignment().concat(_descriptor_0.alignment().concat(_descriptor_5.alignment()));
  }
  fromValue(value_0) {
    return {
      bigR: _descriptor_24.fromValue(value_0),
      s: _descriptor_0.fromValue(value_0),
      recoveryId: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_24.toValue(value_0.bigR).concat(_descriptor_0.toValue(value_0.s).concat(_descriptor_5.toValue(value_0.recoveryId)));
  }
}

const _descriptor_25 = new _Signature_0();

class _RespondBidirectionalEvent_0 {
  alignment() {
    return _descriptor_25.alignment();
  }
  fromValue(value_0) {
    return {
      signature: _descriptor_25.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_25.toValue(value_0.signature);
  }
}

const _descriptor_26 = new _RespondBidirectionalEvent_0();

const _descriptor_27 = new __compactRuntime.CompactTypeBytes(8);

const _descriptor_28 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

class _EvmCalldata_1 {
  alignment() {
    return _descriptor_12.alignment().concat(_descriptor_13.alignment().concat(_descriptor_28.alignment()));
  }
  fromValue(value_0) {
    return {
      selector: _descriptor_12.fromValue(value_0),
      noWords: _descriptor_13.fromValue(value_0),
      words: _descriptor_28.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_12.toValue(value_0.selector).concat(_descriptor_13.toValue(value_0.noWords).concat(_descriptor_28.toValue(value_0.words)));
  }
}

const _descriptor_29 = new _EvmCalldata_1();

class _Maybe_1 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_29.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_1.fromValue(value_0),
      value: _descriptor_29.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_some).concat(_descriptor_29.toValue(value_0.value));
  }
}

const _descriptor_30 = new _Maybe_1();

class _EvmType2TxParams_1 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_10.alignment().concat(_descriptor_10.alignment().concat(_descriptor_2.alignment().concat(_descriptor_11.alignment().concat(_descriptor_10.alignment().concat(_descriptor_30.alignment().concat(_descriptor_5.alignment().concat(_descriptor_19.alignment())))))))));
  }
  fromValue(value_0) {
    return {
      chainId: _descriptor_2.fromValue(value_0),
      nonce: _descriptor_2.fromValue(value_0),
      maxPriorityFeePerGas: _descriptor_10.fromValue(value_0),
      maxFeePerGas: _descriptor_10.fromValue(value_0),
      gasLimit: _descriptor_2.fromValue(value_0),
      to: _descriptor_11.fromValue(value_0),
      value: _descriptor_10.fromValue(value_0),
      calldata: _descriptor_30.fromValue(value_0),
      accessListEntryCount: _descriptor_5.fromValue(value_0),
      accessList: _descriptor_19.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.chainId).concat(_descriptor_2.toValue(value_0.nonce).concat(_descriptor_10.toValue(value_0.maxPriorityFeePerGas).concat(_descriptor_10.toValue(value_0.maxFeePerGas).concat(_descriptor_2.toValue(value_0.gasLimit).concat(_descriptor_11.toValue(value_0.to).concat(_descriptor_10.toValue(value_0.value).concat(_descriptor_30.toValue(value_0.calldata).concat(_descriptor_5.toValue(value_0.accessListEntryCount).concat(_descriptor_19.toValue(value_0.accessList))))))))));
  }
}

const _descriptor_31 = new _EvmType2TxParams_1();

const _descriptor_32 = new __compactRuntime.CompactTypeBytes(34);

class _SignBidirectionalEvent_1 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_2.alignment().concat(_descriptor_5.alignment().concat(_descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment().concat(_descriptor_9.alignment().concat(_descriptor_31.alignment().concat(_descriptor_0.alignment().concat(_descriptor_32.alignment().concat(_descriptor_32.alignment())))))))))));
  }
  fromValue(value_0) {
    return {
      sender: _descriptor_4.fromValue(value_0),
      requestNonce: _descriptor_2.fromValue(value_0),
      keyVersion: _descriptor_5.fromValue(value_0),
      path: _descriptor_0.fromValue(value_0),
      algo: _descriptor_6.fromValue(value_0),
      dest: _descriptor_7.fromValue(value_0),
      params: _descriptor_8.fromValue(value_0),
      txParamType: _descriptor_9.fromValue(value_0),
      txParams: _descriptor_31.fromValue(value_0),
      caip2Id: _descriptor_0.fromValue(value_0),
      outputDeserializationSchema: _descriptor_32.fromValue(value_0),
      respondSerializationSchema: _descriptor_32.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.sender).concat(_descriptor_2.toValue(value_0.requestNonce).concat(_descriptor_5.toValue(value_0.keyVersion).concat(_descriptor_0.toValue(value_0.path).concat(_descriptor_6.toValue(value_0.algo).concat(_descriptor_7.toValue(value_0.dest).concat(_descriptor_8.toValue(value_0.params).concat(_descriptor_9.toValue(value_0.txParamType).concat(_descriptor_31.toValue(value_0.txParams).concat(_descriptor_0.toValue(value_0.caip2Id).concat(_descriptor_32.toValue(value_0.outputDeserializationSchema).concat(_descriptor_32.toValue(value_0.respondSerializationSchema))))))))))));
  }
}

const _descriptor_33 = new _SignBidirectionalEvent_1();

const _descriptor_34 = new __compactRuntime.CompactTypeUnsignedInteger(16777215n, 3);

class _SwapRequest_0 {
  alignment() {
    return _descriptor_11.alignment().concat(_descriptor_11.alignment().concat(_descriptor_34.alignment().concat(_descriptor_10.alignment().concat(_descriptor_10.alignment()))));
  }
  fromValue(value_0) {
    return {
      tokenIn: _descriptor_11.fromValue(value_0),
      tokenOut: _descriptor_11.fromValue(value_0),
      fee: _descriptor_34.fromValue(value_0),
      amountOut: _descriptor_10.fromValue(value_0),
      amountInMaximum: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_11.toValue(value_0.tokenIn).concat(_descriptor_11.toValue(value_0.tokenOut).concat(_descriptor_34.toValue(value_0.fee).concat(_descriptor_10.toValue(value_0.amountOut).concat(_descriptor_10.toValue(value_0.amountInMaximum)))));
  }
}

const _descriptor_35 = new _SwapRequest_0();

class _ShieldedCoinInfo_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_10.alignment()));
  }
  fromValue(value_0) {
    return {
      nonce: _descriptor_0.fromValue(value_0),
      color: _descriptor_0.fromValue(value_0),
      value: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.nonce).concat(_descriptor_0.toValue(value_0.color).concat(_descriptor_10.toValue(value_0.value)));
  }
}

const _descriptor_36 = new _ShieldedCoinInfo_0();

const _descriptor_37 = new __compactRuntime.CompactTypeBytes(1);

const _descriptor_38 = new __compactRuntime.CompactTypeBytes(5);

class _WithdrawRequest_0 {
  alignment() {
    return _descriptor_11.alignment().concat(_descriptor_10.alignment().concat(_descriptor_11.alignment()));
  }
  fromValue(value_0) {
    return {
      erc20Address: _descriptor_11.fromValue(value_0),
      amount: _descriptor_10.fromValue(value_0),
      destEvmAddress: _descriptor_11.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_11.toValue(value_0.erc20Address).concat(_descriptor_10.toValue(value_0.amount).concat(_descriptor_11.toValue(value_0.destEvmAddress)));
  }
}

const _descriptor_39 = new _WithdrawRequest_0();

class _DepositRequest_0 {
  alignment() {
    return _descriptor_11.alignment().concat(_descriptor_10.alignment());
  }
  fromValue(value_0) {
    return {
      erc20Address: _descriptor_11.fromValue(value_0),
      amount: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_11.toValue(value_0.erc20Address).concat(_descriptor_10.toValue(value_0.amount));
  }
}

const _descriptor_40 = new _DepositRequest_0();

class _ZswapCoinPublicKey_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_41 = new _ZswapCoinPublicKey_0();

class _Either_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_41.alignment().concat(_descriptor_4.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_1.fromValue(value_0),
      left: _descriptor_41.fromValue(value_0),
      right: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_left).concat(_descriptor_41.toValue(value_0.left).concat(_descriptor_4.toValue(value_0.right)));
  }
}

const _descriptor_42 = new _Either_0();

class _Maybe_2 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_42.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_1.fromValue(value_0),
      value: _descriptor_42.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_some).concat(_descriptor_42.toValue(value_0.value));
  }
}

const _descriptor_43 = new _Maybe_2();

const _descriptor_44 = new __compactRuntime.CompactTypeVector(4, _descriptor_5);

const _descriptor_45 = new __compactRuntime.CompactTypeBytes(128);

class _SignBidirectionalEventNotification_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_45.alignment());
  }
  fromValue(value_0) {
    return {
      version: _descriptor_5.fromValue(value_0),
      payload: _descriptor_45.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.version).concat(_descriptor_45.toValue(value_0.payload));
  }
}

const _descriptor_46 = new _SignBidirectionalEventNotification_0();

class _ExactOutputSingleReturnValue_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      amountIn: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.amountIn);
  }
}

const _descriptor_47 = new _ExactOutputSingleReturnValue_0();

const _descriptor_48 = __compactRuntime.CompactTypeSecp256k1Scalar;

class _VaultResponse_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      success: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.success);
  }
}

const _descriptor_49 = new _VaultResponse_0();

const _descriptor_50 = __compactRuntime.CompactTypeSecp256k1Base;

class _tuple_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_27.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_0.fromValue(value_0),
      _descriptor_27.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0[0]).concat(_descriptor_27.toValue(value_0[1]));
  }
}

const _descriptor_51 = new _tuple_0();

class _tuple_1 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_37.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_0.fromValue(value_0),
      _descriptor_37.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0[0]).concat(_descriptor_37.toValue(value_0[1]));
  }
}

const _descriptor_52 = new _tuple_1();

class _tuple_2 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_38.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_0.fromValue(value_0),
      _descriptor_38.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0[0]).concat(_descriptor_38.toValue(value_0[1]));
  }
}

const _descriptor_53 = new _tuple_2();

const _descriptor_54 = new __compactRuntime.CompactTypeBytes(21);

class _CoinPreimage_0 {
  alignment() {
    return _descriptor_54.alignment().concat(_descriptor_36.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_54.fromValue(value_0),
      info: _descriptor_36.fromValue(value_0),
      dataType: _descriptor_1.fromValue(value_0),
      data: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_54.toValue(value_0.domain_sep).concat(_descriptor_36.toValue(value_0.info).concat(_descriptor_1.toValue(value_0.dataType).concat(_descriptor_0.toValue(value_0.data))));
  }
}

const _descriptor_55 = new _CoinPreimage_0();

const _descriptor_56 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

class _Secp256k1EcdsaSignature_0 {
  alignment() {
    return _descriptor_48.alignment().concat(_descriptor_48.alignment());
  }
  fromValue(value_0) {
    return {
      r: _descriptor_48.fromValue(value_0),
      s: _descriptor_48.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_48.toValue(value_0.r).concat(_descriptor_48.toValue(value_0.s));
  }
}

const _descriptor_57 = new _Secp256k1EcdsaSignature_0();

class _Either_1 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_1.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_58 = new _Either_1();

const _descriptor_59 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

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
    if (typeof(witnesses_0.callerSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named callerSecretKey');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      async vaultResponseSchema(context, ...args_1) {
        return { result: pureCircuits.vaultResponseSchema(...args_1), context };
      },
      async vaultTokenDomainSeparator(context, ...args_1) {
        return { result: pureCircuits.vaultTokenDomainSeparator(...args_1), context };
      },
      async userCommitment(context, ...args_1) {
        return { result: pureCircuits.userCommitment(...args_1), context };
      },
      async withdrawRefundCommitment(context, ...args_1) {
        return { result: pureCircuits.withdrawRefundCommitment(...args_1), context };
      },
      initialize: async (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`initialize: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const vaultEvm_0 = args_1[1];
        const swapRouter_0 = args_1[2];
        const chainId_0 = args_1[3];
        const chainCaip2Id_0 = args_1[4];
        const responseKey_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('initialize',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 217 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(vaultEvm_0.buffer instanceof ArrayBuffer && vaultEvm_0.BYTES_PER_ELEMENT === 1 && vaultEvm_0.length === 20)) {
          __compactRuntime.typeError('initialize',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 217 char 1',
                                     'Bytes<20>',
                                     vaultEvm_0)
        }
        if (!(swapRouter_0.buffer instanceof ArrayBuffer && swapRouter_0.BYTES_PER_ELEMENT === 1 && swapRouter_0.length === 20)) {
          __compactRuntime.typeError('initialize',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 217 char 1',
                                     'Bytes<20>',
                                     swapRouter_0)
        }
        if (!(typeof(chainId_0) === 'bigint' && chainId_0 >= 0n && chainId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('initialize',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 217 char 1',
                                     'Uint<0..18446744073709551616>',
                                     chainId_0)
        }
        if (!(chainCaip2Id_0.buffer instanceof ArrayBuffer && chainCaip2Id_0.BYTES_PER_ELEMENT === 1 && chainCaip2Id_0.length === 32)) {
          __compactRuntime.typeError('initialize',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'erc20-vault.compact line 217 char 1',
                                     'Bytes<32>',
                                     chainCaip2Id_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_11.toValue(vaultEvm_0).concat(_descriptor_11.toValue(swapRouter_0).concat(_descriptor_2.toValue(chainId_0).concat(_descriptor_0.toValue(chainCaip2Id_0).concat(_descriptor_3.toValue(responseKey_0))))),
            alignment: _descriptor_11.alignment().concat(_descriptor_11.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._initialize_0(context,
                                                  partialProofData,
                                                  vaultEvm_0,
                                                  swapRouter_0,
                                                  chainId_0,
                                                  chainCaip2Id_0,
                                                  responseKey_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      deposit: async (...args_1) => {
        if (args_1.length !== 7) {
          throw new __compactRuntime.CompactError(`deposit: expected 7 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const evmNonce_0 = args_1[1];
        const gasLimit_0 = args_1[2];
        const maxFeePerGas_0 = args_1[3];
        const maxPriorityFeePerGas_0 = args_1[4];
        const keyVersion_0 = args_1[5];
        const depositRequest_0 = args_1[6];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('deposit',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 252 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(evmNonce_0) === 'bigint' && evmNonce_0 >= 0n && evmNonce_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('deposit',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 252 char 1',
                                     'Uint<0..18446744073709551616>',
                                     evmNonce_0)
        }
        if (!(typeof(gasLimit_0) === 'bigint' && gasLimit_0 >= 0n && gasLimit_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('deposit',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 252 char 1',
                                     'Uint<0..18446744073709551616>',
                                     gasLimit_0)
        }
        if (!(typeof(maxFeePerGas_0) === 'bigint' && maxFeePerGas_0 >= 0n && maxFeePerGas_0 <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('deposit',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 252 char 1',
                                     'Uint<0..340282366920938463463374607431768211456>',
                                     maxFeePerGas_0)
        }
        if (!(typeof(maxPriorityFeePerGas_0) === 'bigint' && maxPriorityFeePerGas_0 >= 0n && maxPriorityFeePerGas_0 <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('deposit',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'erc20-vault.compact line 252 char 1',
                                     'Uint<0..340282366920938463463374607431768211456>',
                                     maxPriorityFeePerGas_0)
        }
        if (!(typeof(keyVersion_0) === 'bigint' && keyVersion_0 >= 0n && keyVersion_0 <= 255n)) {
          __compactRuntime.typeError('deposit',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'erc20-vault.compact line 252 char 1',
                                     'Uint<0..256>',
                                     keyVersion_0)
        }
        if (!(typeof(depositRequest_0) === 'object' && depositRequest_0.erc20Address.buffer instanceof ArrayBuffer && depositRequest_0.erc20Address.BYTES_PER_ELEMENT === 1 && depositRequest_0.erc20Address.length === 20 && typeof(depositRequest_0.amount) === 'bigint' && depositRequest_0.amount >= 0n && depositRequest_0.amount <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('deposit',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'erc20-vault.compact line 252 char 1',
                                     'struct DepositRequest<erc20Address: Bytes<20>, amount: Uint<0..340282366920938463463374607431768211456>>',
                                     depositRequest_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(evmNonce_0).concat(_descriptor_2.toValue(gasLimit_0).concat(_descriptor_10.toValue(maxFeePerGas_0).concat(_descriptor_10.toValue(maxPriorityFeePerGas_0).concat(_descriptor_5.toValue(keyVersion_0).concat(_descriptor_40.toValue(depositRequest_0)))))),
            alignment: _descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_10.alignment().concat(_descriptor_10.alignment().concat(_descriptor_5.alignment().concat(_descriptor_40.alignment())))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._deposit_0(context,
                                               partialProofData,
                                               evmNonce_0,
                                               gasLimit_0,
                                               maxFeePerGas_0,
                                               maxPriorityFeePerGas_0,
                                               keyVersion_0,
                                               depositRequest_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      claim: async (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`claim: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestId_0 = args_1[1];
        const respondBidirectionalEvent_0 = args_1[2];
        const serializedOutput_0 = args_1[3];
        const mintNonce_0 = args_1[4];
        const recipient_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claim',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 345 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestId_0.buffer instanceof ArrayBuffer && requestId_0.BYTES_PER_ELEMENT === 1 && requestId_0.length === 32)) {
          __compactRuntime.typeError('claim',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 345 char 1',
                                     'Bytes<32>',
                                     requestId_0)
        }
        if (!(typeof(respondBidirectionalEvent_0) === 'object' && typeof(respondBidirectionalEvent_0.signature) === 'object' && typeof(respondBidirectionalEvent_0.signature.bigR) === 'object' && respondBidirectionalEvent_0.signature.bigR.x.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.x.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.x.length === 32 && respondBidirectionalEvent_0.signature.bigR.y.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.y.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.y.length === 32 && respondBidirectionalEvent_0.signature.s.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.s.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.s.length === 32 && typeof(respondBidirectionalEvent_0.signature.recoveryId) === 'bigint' && respondBidirectionalEvent_0.signature.recoveryId >= 0n && respondBidirectionalEvent_0.signature.recoveryId <= 255n)) {
          __compactRuntime.typeError('claim',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 345 char 1',
                                     'struct RespondBidirectionalEvent<signature: struct Signature<bigR: struct AffinePoint<x: Bytes<32>, y: Bytes<32>>, s: Bytes<32>, recoveryId: Uint<0..256>>>',
                                     respondBidirectionalEvent_0)
        }
        if (!(serializedOutput_0.buffer instanceof ArrayBuffer && serializedOutput_0.BYTES_PER_ELEMENT === 1 && serializedOutput_0.length === 1)) {
          __compactRuntime.typeError('claim',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 345 char 1',
                                     'Bytes<1>',
                                     serializedOutput_0)
        }
        if (!(mintNonce_0.buffer instanceof ArrayBuffer && mintNonce_0.BYTES_PER_ELEMENT === 1 && mintNonce_0.length === 32)) {
          __compactRuntime.typeError('claim',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'erc20-vault.compact line 345 char 1',
                                     'Bytes<32>',
                                     mintNonce_0)
        }
        if (!(typeof(recipient_0) === 'object' && typeof(recipient_0.is_some) === 'boolean' && typeof(recipient_0.value) === 'object' && typeof(recipient_0.value.is_left) === 'boolean' && typeof(recipient_0.value.left) === 'object' && recipient_0.value.left.bytes.buffer instanceof ArrayBuffer && recipient_0.value.left.bytes.BYTES_PER_ELEMENT === 1 && recipient_0.value.left.bytes.length === 32 && typeof(recipient_0.value.right) === 'object' && recipient_0.value.right.bytes.buffer instanceof ArrayBuffer && recipient_0.value.right.bytes.BYTES_PER_ELEMENT === 1 && recipient_0.value.right.bytes.length === 32)) {
          __compactRuntime.typeError('claim',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'erc20-vault.compact line 345 char 1',
                                     'struct Maybe<is_some: Boolean, value: struct Either<is_left: Boolean, left: struct ZswapCoinPublicKey<bytes: Bytes<32>>, right: struct ContractAddress<bytes: Bytes<32>>>>',
                                     recipient_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(requestId_0).concat(_descriptor_26.toValue(respondBidirectionalEvent_0).concat(_descriptor_37.toValue(serializedOutput_0).concat(_descriptor_0.toValue(mintNonce_0).concat(_descriptor_43.toValue(recipient_0))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_26.alignment().concat(_descriptor_37.alignment().concat(_descriptor_0.alignment().concat(_descriptor_43.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._claim_0(context,
                                             partialProofData,
                                             requestId_0,
                                             respondBidirectionalEvent_0,
                                             serializedOutput_0,
                                             mintNonce_0,
                                             recipient_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      withdraw: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`withdraw: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const evmNonce_0 = args_1[1];
        const keyVersion_0 = args_1[2];
        const withdrawRequest_0 = args_1[3];
        const coin_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('withdraw',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 421 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(evmNonce_0) === 'bigint' && evmNonce_0 >= 0n && evmNonce_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('withdraw',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 421 char 1',
                                     'Uint<0..18446744073709551616>',
                                     evmNonce_0)
        }
        if (!(typeof(keyVersion_0) === 'bigint' && keyVersion_0 >= 0n && keyVersion_0 <= 255n)) {
          __compactRuntime.typeError('withdraw',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 421 char 1',
                                     'Uint<0..256>',
                                     keyVersion_0)
        }
        if (!(typeof(withdrawRequest_0) === 'object' && withdrawRequest_0.erc20Address.buffer instanceof ArrayBuffer && withdrawRequest_0.erc20Address.BYTES_PER_ELEMENT === 1 && withdrawRequest_0.erc20Address.length === 20 && typeof(withdrawRequest_0.amount) === 'bigint' && withdrawRequest_0.amount >= 0n && withdrawRequest_0.amount <= 340282366920938463463374607431768211455n && withdrawRequest_0.destEvmAddress.buffer instanceof ArrayBuffer && withdrawRequest_0.destEvmAddress.BYTES_PER_ELEMENT === 1 && withdrawRequest_0.destEvmAddress.length === 20)) {
          __compactRuntime.typeError('withdraw',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 421 char 1',
                                     'struct WithdrawRequest<erc20Address: Bytes<20>, amount: Uint<0..340282366920938463463374607431768211456>, destEvmAddress: Bytes<20>>',
                                     withdrawRequest_0)
        }
        if (!(typeof(coin_0) === 'object' && coin_0.nonce.buffer instanceof ArrayBuffer && coin_0.nonce.BYTES_PER_ELEMENT === 1 && coin_0.nonce.length === 32 && coin_0.color.buffer instanceof ArrayBuffer && coin_0.color.BYTES_PER_ELEMENT === 1 && coin_0.color.length === 32 && typeof(coin_0.value) === 'bigint' && coin_0.value >= 0n && coin_0.value <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('withdraw',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'erc20-vault.compact line 421 char 1',
                                     'struct ShieldedCoinInfo<nonce: Bytes<32>, color: Bytes<32>, value: Uint<0..340282366920938463463374607431768211456>>',
                                     coin_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(evmNonce_0).concat(_descriptor_5.toValue(keyVersion_0).concat(_descriptor_39.toValue(withdrawRequest_0).concat(_descriptor_36.toValue(coin_0)))),
            alignment: _descriptor_2.alignment().concat(_descriptor_5.alignment().concat(_descriptor_39.alignment().concat(_descriptor_36.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._withdraw_0(context,
                                                partialProofData,
                                                evmNonce_0,
                                                keyVersion_0,
                                                withdrawRequest_0,
                                                coin_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      completeWithdraw: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`completeWithdraw: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestId_0 = args_1[1];
        const respondBidirectionalEvent_0 = args_1[2];
        const serializedOutput_0 = args_1[3];
        const mintNonce_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('completeWithdraw',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 558 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestId_0.buffer instanceof ArrayBuffer && requestId_0.BYTES_PER_ELEMENT === 1 && requestId_0.length === 32)) {
          __compactRuntime.typeError('completeWithdraw',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 558 char 1',
                                     'Bytes<32>',
                                     requestId_0)
        }
        if (!(typeof(respondBidirectionalEvent_0) === 'object' && typeof(respondBidirectionalEvent_0.signature) === 'object' && typeof(respondBidirectionalEvent_0.signature.bigR) === 'object' && respondBidirectionalEvent_0.signature.bigR.x.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.x.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.x.length === 32 && respondBidirectionalEvent_0.signature.bigR.y.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.y.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.y.length === 32 && respondBidirectionalEvent_0.signature.s.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.s.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.s.length === 32 && typeof(respondBidirectionalEvent_0.signature.recoveryId) === 'bigint' && respondBidirectionalEvent_0.signature.recoveryId >= 0n && respondBidirectionalEvent_0.signature.recoveryId <= 255n)) {
          __compactRuntime.typeError('completeWithdraw',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 558 char 1',
                                     'struct RespondBidirectionalEvent<signature: struct Signature<bigR: struct AffinePoint<x: Bytes<32>, y: Bytes<32>>, s: Bytes<32>, recoveryId: Uint<0..256>>>',
                                     respondBidirectionalEvent_0)
        }
        if (!(serializedOutput_0.buffer instanceof ArrayBuffer && serializedOutput_0.BYTES_PER_ELEMENT === 1 && serializedOutput_0.length === 1)) {
          __compactRuntime.typeError('completeWithdraw',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 558 char 1',
                                     'Bytes<1>',
                                     serializedOutput_0)
        }
        if (!(mintNonce_0.buffer instanceof ArrayBuffer && mintNonce_0.BYTES_PER_ELEMENT === 1 && mintNonce_0.length === 32)) {
          __compactRuntime.typeError('completeWithdraw',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'erc20-vault.compact line 558 char 1',
                                     'Bytes<32>',
                                     mintNonce_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(requestId_0).concat(_descriptor_26.toValue(respondBidirectionalEvent_0).concat(_descriptor_37.toValue(serializedOutput_0).concat(_descriptor_0.toValue(mintNonce_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_26.alignment().concat(_descriptor_37.alignment().concat(_descriptor_0.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._completeWithdraw_0(context,
                                                        partialProofData,
                                                        requestId_0,
                                                        respondBidirectionalEvent_0,
                                                        serializedOutput_0,
                                                        mintNonce_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      refund: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`refund: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestId_0 = args_1[1];
        const respondBidirectionalEvent_0 = args_1[2];
        const serializedOutput_0 = args_1[3];
        const mintNonce_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('refund',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 615 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestId_0.buffer instanceof ArrayBuffer && requestId_0.BYTES_PER_ELEMENT === 1 && requestId_0.length === 32)) {
          __compactRuntime.typeError('refund',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 615 char 1',
                                     'Bytes<32>',
                                     requestId_0)
        }
        if (!(typeof(respondBidirectionalEvent_0) === 'object' && typeof(respondBidirectionalEvent_0.signature) === 'object' && typeof(respondBidirectionalEvent_0.signature.bigR) === 'object' && respondBidirectionalEvent_0.signature.bigR.x.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.x.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.x.length === 32 && respondBidirectionalEvent_0.signature.bigR.y.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.y.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.y.length === 32 && respondBidirectionalEvent_0.signature.s.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.s.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.s.length === 32 && typeof(respondBidirectionalEvent_0.signature.recoveryId) === 'bigint' && respondBidirectionalEvent_0.signature.recoveryId >= 0n && respondBidirectionalEvent_0.signature.recoveryId <= 255n)) {
          __compactRuntime.typeError('refund',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 615 char 1',
                                     'struct RespondBidirectionalEvent<signature: struct Signature<bigR: struct AffinePoint<x: Bytes<32>, y: Bytes<32>>, s: Bytes<32>, recoveryId: Uint<0..256>>>',
                                     respondBidirectionalEvent_0)
        }
        if (!(serializedOutput_0.buffer instanceof ArrayBuffer && serializedOutput_0.BYTES_PER_ELEMENT === 1 && serializedOutput_0.length === 5)) {
          __compactRuntime.typeError('refund',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 615 char 1',
                                     'Bytes<5>',
                                     serializedOutput_0)
        }
        if (!(mintNonce_0.buffer instanceof ArrayBuffer && mintNonce_0.BYTES_PER_ELEMENT === 1 && mintNonce_0.length === 32)) {
          __compactRuntime.typeError('refund',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'erc20-vault.compact line 615 char 1',
                                     'Bytes<32>',
                                     mintNonce_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(requestId_0).concat(_descriptor_26.toValue(respondBidirectionalEvent_0).concat(_descriptor_38.toValue(serializedOutput_0).concat(_descriptor_0.toValue(mintNonce_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_26.alignment().concat(_descriptor_38.alignment().concat(_descriptor_0.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._refund_0(context,
                                              partialProofData,
                                              requestId_0,
                                              respondBidirectionalEvent_0,
                                              serializedOutput_0,
                                              mintNonce_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      approveRouter: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`approveRouter: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const erc20Address_0 = args_1[1];
        const evmNonce_0 = args_1[2];
        const keyVersion_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('approveRouter',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 695 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(erc20Address_0.buffer instanceof ArrayBuffer && erc20Address_0.BYTES_PER_ELEMENT === 1 && erc20Address_0.length === 20)) {
          __compactRuntime.typeError('approveRouter',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 695 char 1',
                                     'Bytes<20>',
                                     erc20Address_0)
        }
        if (!(typeof(evmNonce_0) === 'bigint' && evmNonce_0 >= 0n && evmNonce_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('approveRouter',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 695 char 1',
                                     'Uint<0..18446744073709551616>',
                                     evmNonce_0)
        }
        if (!(typeof(keyVersion_0) === 'bigint' && keyVersion_0 >= 0n && keyVersion_0 <= 255n)) {
          __compactRuntime.typeError('approveRouter',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 695 char 1',
                                     'Uint<0..256>',
                                     keyVersion_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_11.toValue(erc20Address_0).concat(_descriptor_2.toValue(evmNonce_0).concat(_descriptor_5.toValue(keyVersion_0))),
            alignment: _descriptor_11.alignment().concat(_descriptor_2.alignment().concat(_descriptor_5.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._approveRouter_0(context,
                                                     partialProofData,
                                                     erc20Address_0,
                                                     evmNonce_0,
                                                     keyVersion_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      swap: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`swap: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const evmNonce_0 = args_1[1];
        const keyVersion_0 = args_1[2];
        const swapRequest_0 = args_1[3];
        const coin_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('swap',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 786 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(evmNonce_0) === 'bigint' && evmNonce_0 >= 0n && evmNonce_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('swap',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 786 char 1',
                                     'Uint<0..18446744073709551616>',
                                     evmNonce_0)
        }
        if (!(typeof(keyVersion_0) === 'bigint' && keyVersion_0 >= 0n && keyVersion_0 <= 255n)) {
          __compactRuntime.typeError('swap',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 786 char 1',
                                     'Uint<0..256>',
                                     keyVersion_0)
        }
        if (!(typeof(swapRequest_0) === 'object' && swapRequest_0.tokenIn.buffer instanceof ArrayBuffer && swapRequest_0.tokenIn.BYTES_PER_ELEMENT === 1 && swapRequest_0.tokenIn.length === 20 && swapRequest_0.tokenOut.buffer instanceof ArrayBuffer && swapRequest_0.tokenOut.BYTES_PER_ELEMENT === 1 && swapRequest_0.tokenOut.length === 20 && typeof(swapRequest_0.fee) === 'bigint' && swapRequest_0.fee >= 0n && swapRequest_0.fee <= 16777215n && typeof(swapRequest_0.amountOut) === 'bigint' && swapRequest_0.amountOut >= 0n && swapRequest_0.amountOut <= 340282366920938463463374607431768211455n && typeof(swapRequest_0.amountInMaximum) === 'bigint' && swapRequest_0.amountInMaximum >= 0n && swapRequest_0.amountInMaximum <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('swap',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 786 char 1',
                                     'struct SwapRequest<tokenIn: Bytes<20>, tokenOut: Bytes<20>, fee: Uint<0..16777216>, amountOut: Uint<0..340282366920938463463374607431768211456>, amountInMaximum: Uint<0..340282366920938463463374607431768211456>>',
                                     swapRequest_0)
        }
        if (!(typeof(coin_0) === 'object' && coin_0.nonce.buffer instanceof ArrayBuffer && coin_0.nonce.BYTES_PER_ELEMENT === 1 && coin_0.nonce.length === 32 && coin_0.color.buffer instanceof ArrayBuffer && coin_0.color.BYTES_PER_ELEMENT === 1 && coin_0.color.length === 32 && typeof(coin_0.value) === 'bigint' && coin_0.value >= 0n && coin_0.value <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('swap',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'erc20-vault.compact line 786 char 1',
                                     'struct ShieldedCoinInfo<nonce: Bytes<32>, color: Bytes<32>, value: Uint<0..340282366920938463463374607431768211456>>',
                                     coin_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(evmNonce_0).concat(_descriptor_5.toValue(keyVersion_0).concat(_descriptor_35.toValue(swapRequest_0).concat(_descriptor_36.toValue(coin_0)))),
            alignment: _descriptor_2.alignment().concat(_descriptor_5.alignment().concat(_descriptor_35.alignment().concat(_descriptor_36.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._swap_0(context,
                                            partialProofData,
                                            evmNonce_0,
                                            keyVersion_0,
                                            swapRequest_0,
                                            coin_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      completeSwap: async (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`completeSwap: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestId_0 = args_1[1];
        const respondBidirectionalEvent_0 = args_1[2];
        const serializedOutput_0 = args_1[3];
        const mintNonce_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('completeSwap',
                                     'argument 1 (as invoked from Typescript)',
                                     'erc20-vault.compact line 888 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestId_0.buffer instanceof ArrayBuffer && requestId_0.BYTES_PER_ELEMENT === 1 && requestId_0.length === 32)) {
          __compactRuntime.typeError('completeSwap',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'erc20-vault.compact line 888 char 1',
                                     'Bytes<32>',
                                     requestId_0)
        }
        if (!(typeof(respondBidirectionalEvent_0) === 'object' && typeof(respondBidirectionalEvent_0.signature) === 'object' && typeof(respondBidirectionalEvent_0.signature.bigR) === 'object' && respondBidirectionalEvent_0.signature.bigR.x.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.x.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.x.length === 32 && respondBidirectionalEvent_0.signature.bigR.y.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.bigR.y.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.bigR.y.length === 32 && respondBidirectionalEvent_0.signature.s.buffer instanceof ArrayBuffer && respondBidirectionalEvent_0.signature.s.BYTES_PER_ELEMENT === 1 && respondBidirectionalEvent_0.signature.s.length === 32 && typeof(respondBidirectionalEvent_0.signature.recoveryId) === 'bigint' && respondBidirectionalEvent_0.signature.recoveryId >= 0n && respondBidirectionalEvent_0.signature.recoveryId <= 255n)) {
          __compactRuntime.typeError('completeSwap',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'erc20-vault.compact line 888 char 1',
                                     'struct RespondBidirectionalEvent<signature: struct Signature<bigR: struct AffinePoint<x: Bytes<32>, y: Bytes<32>>, s: Bytes<32>, recoveryId: Uint<0..256>>>',
                                     respondBidirectionalEvent_0)
        }
        if (!(serializedOutput_0.buffer instanceof ArrayBuffer && serializedOutput_0.BYTES_PER_ELEMENT === 1 && serializedOutput_0.length === 8)) {
          __compactRuntime.typeError('completeSwap',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'erc20-vault.compact line 888 char 1',
                                     'Bytes<8>',
                                     serializedOutput_0)
        }
        if (!(mintNonce_0.buffer instanceof ArrayBuffer && mintNonce_0.BYTES_PER_ELEMENT === 1 && mintNonce_0.length === 32)) {
          __compactRuntime.typeError('completeSwap',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'erc20-vault.compact line 888 char 1',
                                     'Bytes<32>',
                                     mintNonce_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(requestId_0).concat(_descriptor_26.toValue(respondBidirectionalEvent_0).concat(_descriptor_27.toValue(serializedOutput_0).concat(_descriptor_0.toValue(mintNonce_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_26.alignment().concat(_descriptor_27.alignment().concat(_descriptor_0.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._completeSwap_0(context,
                                                    partialProofData,
                                                    requestId_0,
                                                    respondBidirectionalEvent_0,
                                                    serializedOutput_0,
                                                    mintNonce_0);
        partialProofData.output = { value: _descriptor_17.toValue(result_0), alignment: _descriptor_17.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      }
    };
    this.impureCircuits = {
      initialize: this.circuits.initialize,
      deposit: this.circuits.deposit,
      claim: this.circuits.claim,
      withdraw: this.circuits.withdraw,
      completeWithdraw: this.circuits.completeWithdraw,
      refund: this.circuits.refund,
      approveRouter: this.circuits.approveRouter,
      swap: this.circuits.swap,
      completeSwap: this.circuits.completeSwap
    };
    this.provableCircuits = {
      initialize: this.circuits.initialize,
      deposit: this.circuits.deposit,
      claim: this.circuits.claim,
      withdraw: this.circuits.withdraw,
      completeWithdraw: this.circuits.completeWithdraw,
      refund: this.circuits.refund,
      approveRouter: this.circuits.approveRouter,
      swap: this.circuits.swap,
      completeSwap: this.circuits.completeSwap
    };
  }
  async initialState(...args_0) {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const deployerCommitment_0 = args_0[1];
    const signetContract_0 = args_0[2];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(deployerCommitment_0.buffer instanceof ArrayBuffer && deployerCommitment_0.BYTES_PER_ELEMENT === 1 && deployerCommitment_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'erc20-vault.compact line 203 char 1',
                                 'Bytes<32>',
                                 deployerCommitment_0)
    }
    if (!(typeof(signetContract_0) === 'object' && signetContract_0.bytes.buffer instanceof ArrayBuffer && signetContract_0.bytes.BYTES_PER_ELEMENT === 1 && signetContract_0.bytes.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'erc20-vault.compact line 203 char 1',
                                 'contract SignetSigner[signBidirectional(Bytes<32>, struct SignBidirectionalEventNotification<version: Uint<0..256>, payload: Bytes<128>>): []]',
                                 signetContract_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('initialize', new __compactRuntime.ContractOperation());
    state_0.setOperation('deposit', new __compactRuntime.ContractOperation());
    state_0.setOperation('claim', new __compactRuntime.ContractOperation());
    state_0.setOperation('withdraw', new __compactRuntime.ContractOperation());
    state_0.setOperation('completeWithdraw', new __compactRuntime.ContractOperation());
    state_0.setOperation('refund', new __compactRuntime.ContractOperation());
    state_0.setOperation('approveRouter', new __compactRuntime.ContractOperation());
    state_0.setOperation('swap', new __compactRuntime.ContractOperation());
    state_0.setOperation('completeSwap', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext('constructor', __compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(1n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue({ bytes: new Uint8Array(32) }),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(2n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(({x: 0n, y: 0n, identity: true})),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(3n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(4n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(5n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(new Uint8Array(20)),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(6n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(7n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(8n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(9n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(10n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(new Uint8Array(20)),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(11n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(12n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(8n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(deployerCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(1n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(signetContract_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.callContext.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.callContext.currentPrivateState,
      currentZswapLocalState: context.callContext.currentZswapLocalState
    }
  }
  _some_0(value_0) { return { is_some: true, value: value_0 }; }
  _some_1(value_0) { return { is_some: true, value: value_0 }; }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: { bytes: new Uint8Array(32) } };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _tokenType_0(domain_sep_0, contractAddress_0) {
    return this._persistentCommit_0([domain_sep_0, contractAddress_0.bytes],
                                    new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 100, 101, 114, 105, 118, 101, 95, 116, 111, 107, 101, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  async _mintShieldedToken_0(context,
                             partialProofData,
                             domain_sep_0,
                             value_0,
                             nonce_0,
                             recipient_0)
  {
    const coin_0 = { nonce: nonce_0,
                     color:
                       this._tokenType_0(domain_sep_0,
                                         _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                   partialProofData,
                                                                                                   [
                                                                                                    { dup: { n: 2 } },
                                                                                                    { idx: { cached: true,
                                                                                                             pushPath: false,
                                                                                                             path: [
                                                                                                                    { tag: 'value',
                                                                                                                      value: { value: _descriptor_5.toValue(0n),
                                                                                                                               alignment: _descriptor_5.alignment() } }] } },
                                                                                                    { popeq: { cached: true,
                                                                                                               result: undefined } }]).value)),
                     value: value_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(4n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_sep_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(value_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    this._createZswapOutput_0(context, partialProofData, coin_0, recipient_0);
    const cm_0 = this._coinCommitment_0(coin_0, recipient_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(2n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(cm_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (!recipient_0.is_left
        &&
        this._equal_0(recipient_0.right.bytes,
                      _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 2 } },
                                                                                 { idx: { cached: true,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_5.toValue(0n),
                                                                                                            alignment: _descriptor_5.alignment() } }] } },
                                                                                 { popeq: { cached: true,
                                                                                            result: undefined } }]).value).bytes))
    {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_5.toValue(1n),
                                                                    alignment: _descriptor_5.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(cm_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newNull().encode() } },
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return coin_0;
  }
  async _receiveShielded_0(context, partialProofData, coin_0) {
    const recipient_0 = this._right_0(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 2 } },
                                                                                                 { idx: { cached: true,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_5.toValue(0n),
                                                                                                                            alignment: _descriptor_5.alignment() } }] } },
                                                                                                 { popeq: { cached: true,
                                                                                                            result: undefined } }]).value));
    this._createZswapOutput_0(context, partialProofData, coin_0, recipient_0);
    const tmp_0 = this._coinCommitment_0(coin_0, recipient_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(1n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _coinCommitment_0(coin_0, recipient_0) {
    return this._persistentHash_2({ domain_sep:
                                      new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 122, 115, 119, 97, 112, 45, 99, 99, 91, 118, 49, 93]),
                                    info: coin_0,
                                    dataType: recipient_0.is_left,
                                    data:
                                      recipient_0.is_left ?
                                      recipient_0.left.bytes :
                                      recipient_0.right.bytes });
  }
  _hashToSecp256k1Scalar_0(digest_0) {
    const v_0 = Array.from(digest_0, BigInt);
    const beReversed_0 = Uint8Array.from([v_0[31],
                                          v_0[30],
                                          v_0[29],
                                          v_0[28],
                                          v_0[27],
                                          v_0[26],
                                          v_0[25],
                                          v_0[24],
                                          v_0[23],
                                          v_0[22],
                                          v_0[21],
                                          v_0[20],
                                          v_0[19],
                                          v_0[18],
                                          v_0[17],
                                          v_0[16],
                                          v_0[15],
                                          v_0[14],
                                          v_0[13],
                                          v_0[12],
                                          v_0[11],
                                          v_0[10],
                                          v_0[9],
                                          v_0[8],
                                          v_0[7],
                                          v_0[6],
                                          v_0[5],
                                          v_0[4],
                                          v_0[3],
                                          v_0[2],
                                          v_0[1],
                                          v_0[0]],
                                         Number);
    return __compactRuntime.convertBytesToField(115792089237316195423570985008687907852837564279074904382605163141518161494336n,
                                                32,
                                                beReversed_0,
                                                'Secp256k1Scalar',
                                                '<standard library>');
  }
  _secp256k1EcdsaVerify_0(msgHash_0, sig_0, pk_0) {
    const z_0 = this._hashToSecp256k1Scalar_0(msgHash_0);
    const __compact_pattern_tmp1_0 = sig_0;
    const r_0 = __compact_pattern_tmp1_0.r;
    const s_0 = __compact_pattern_tmp1_0.s;
    const w_0 = this._inv_0(s_0);
    const u1_0 = this._mul_0(z_0, w_0);
    const u2_0 = this._mul_0(r_0, w_0);
    const point_0 = this._ecAdd_0(this._ecMulGenerator_0(u1_0),
                                  this._ecMul_0(pk_0, u2_0));
    return __compactRuntime.convertBytesToField(115792089237316195423570985008687907852837564279074904382605163141518161494336n,
                                                32,
                                                __compactRuntime.convertBigintToBytes(32,
                                                                                      this._secp256k1PointX_0(point_0),
                                                                                      '<standard library>'),
                                                'Secp256k1Scalar',
                                                '<standard library>')
           ===
           r_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_56, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_28, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_55, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_28,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _keccak256_0(value_0) {
    const result_0 = __compactRuntime.keccak256(_descriptor_52, value_0);
    return result_0;
  }
  _keccak256_1(value_0) {
    const result_0 = __compactRuntime.keccak256(_descriptor_53, value_0);
    return result_0;
  }
  _keccak256_2(value_0) {
    const result_0 = __compactRuntime.keccak256(_descriptor_33, value_0);
    return result_0;
  }
  _keccak256_3(value_0) {
    const result_0 = __compactRuntime.keccak256(_descriptor_23, value_0);
    return result_0;
  }
  _keccak256_4(value_0) {
    const result_0 = __compactRuntime.keccak256(_descriptor_51, value_0);
    return result_0;
  }
  _ownPublicKey_0(context, partialProofData) {
    const result_0 = __compactRuntime.ownPublicKey(context);
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_41.toValue(result_0),
      alignment: _descriptor_41.alignment()
    });
    return result_0;
  }
  _createZswapOutput_0(context, partialProofData, coin_0, recipient_0) {
    const result_0 = __compactRuntime.createZswapOutput(context,
                                                        coin_0,
                                                        recipient_0);
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_17.toValue(result_0),
      alignment: _descriptor_17.alignment()
    });
    return result_0;
  }
  _mul_0(x_0, y_0) {
    const result_0 = __compactRuntime.secp256k1ScalarMul(x_0, y_0);
    return result_0;
  }
  _inv_0(s_0) {
    const result_0 = __compactRuntime.secp256k1ScalarInv(s_0);
    return result_0;
  }
  _secp256k1PointX_0(pt_0) {
    const result_0 = __compactRuntime.secp256k1PointX(pt_0);
    return result_0;
  }
  _ecAdd_0(a_0, b_0) {
    const result_0 = __compactRuntime.secp256k1Add(a_0, b_0);
    return result_0;
  }
  _ecMul_0(a_0, b_0) {
    const result_0 = __compactRuntime.secp256k1Mul(a_0, b_0);
    return result_0;
  }
  _ecMulGenerator_0(b_0) {
    const result_0 = __compactRuntime.secp256k1MulGenerator(b_0);
    return result_0;
  }
  _deserialize_0(value_0) { return { success: BigInt(value_0[0n]) === 1n }; }
  _deserialize_1(value_0) {
    return { amountIn:
               __compactRuntime.convertBytesToUint(18446744073709551615n,
                                                   8,
                                                   ((e, i) => e.slice(i, i+8))(value_0,
                                                                               Number(0n)),
                                                   'Uint<0..18446744073709551616>',
                                                   '<standard library>') };
  }
  _constructSignBidirectionalEvent_0(sender_0,
                                     requestNonce_0,
                                     keyVersion_0,
                                     path_0,
                                     algo_0,
                                     dest_0,
                                     params_0,
                                     txParamType_0,
                                     txParams_0,
                                     caip2Id_0,
                                     outputDeserializationSchema_0,
                                     respondSerializationSchema_0)
  {
    __compactRuntime.assert(keyVersion_0 >= 1n, 'keyVersion must be >= 1');
    return { sender: sender_0,
             requestNonce: requestNonce_0,
             keyVersion: keyVersion_0,
             path: path_0,
             algo: algo_0,
             dest: dest_0,
             params: params_0,
             txParamType: txParamType_0,
             txParams: txParams_0,
             caip2Id: caip2Id_0,
             outputDeserializationSchema: outputDeserializationSchema_0,
             respondSerializationSchema: respondSerializationSchema_0 };
  }
  _constructSignBidirectionalEvent_1(sender_0,
                                     requestNonce_0,
                                     keyVersion_0,
                                     path_0,
                                     algo_0,
                                     dest_0,
                                     params_0,
                                     txParamType_0,
                                     txParams_0,
                                     caip2Id_0,
                                     outputDeserializationSchema_0,
                                     respondSerializationSchema_0)
  {
    __compactRuntime.assert(keyVersion_0 >= 1n, 'keyVersion must be >= 1');
    return { sender: sender_0,
             requestNonce: requestNonce_0,
             keyVersion: keyVersion_0,
             path: path_0,
             algo: algo_0,
             dest: dest_0,
             params: params_0,
             txParamType: txParamType_0,
             txParams: txParams_0,
             caip2Id: caip2Id_0,
             outputDeserializationSchema: outputDeserializationSchema_0,
             respondSerializationSchema: respondSerializationSchema_0 };
  }
  _calculateRequestId_0(request_0) { return this._keccak256_2(request_0); }
  _calculateRequestId_1(request_0) { return this._keccak256_3(request_0); }
  _constructSignBidirectionalEventNotificationV1_0(callerAddress_0,
                                                   requestsPathDepth_0,
                                                   requestsPath_0)
  {
    return { version: 1n,
             payload:
               Uint8Array.from([...Array.from(callerAddress_0.bytes, BigInt),
                                requestsPathDepth_0,
                                requestsPath_0[0],
                                requestsPath_0[1],
                                requestsPath_0[2],
                                requestsPath_0[3],
                                ...Array.from(new Uint8Array(91), BigInt)],
                               Number) };
  }
  _calculateSignetAttestationDigest_0(requestId_0, serializedOutput_0) {
    return this._keccak256_0([requestId_0, serializedOutput_0]);
  }
  _calculateSignetAttestationDigest_1(requestId_0, serializedOutput_0) {
    return this._keccak256_1([requestId_0, serializedOutput_0]);
  }
  _calculateSignetAttestationDigest_2(requestId_0, serializedOutput_0) {
    return this._keccak256_4([requestId_0, serializedOutput_0]);
  }
  _reverseBytes32_0(b_0) {
    const v_0 = Array.from(b_0, BigInt);
    return Uint8Array.from([v_0[31],
                            v_0[30],
                            v_0[29],
                            v_0[28],
                            v_0[27],
                            v_0[26],
                            v_0[25],
                            v_0[24],
                            v_0[23],
                            v_0[22],
                            v_0[21],
                            v_0[20],
                            v_0[19],
                            v_0[18],
                            v_0[17],
                            v_0[16],
                            v_0[15],
                            v_0[14],
                            v_0[13],
                            v_0[12],
                            v_0[11],
                            v_0[10],
                            v_0[9],
                            v_0[8],
                            v_0[7],
                            v_0[6],
                            v_0[5],
                            v_0[4],
                            v_0[3],
                            v_0[2],
                            v_0[1],
                            v_0[0]],
                           Number);
  }
  _verifyRespondBidirectionalEvent_0(requestId_0,
                                     serializedOutput_0,
                                     respondBidirectionalEvent_0,
                                     mpcResponseKey_0)
  {
    const digest_0 = this._calculateSignetAttestationDigest_0(requestId_0,
                                                              serializedOutput_0);
    return this._secp256k1EcdsaVerify_0(digest_0,
                                        { r:
                                            __compactRuntime.convertBytesToField(115792089237316195423570985008687907852837564279074904382605163141518161494336n,
                                                                                 32,
                                                                                 this._reverseBytes32_0(respondBidirectionalEvent_0.signature.bigR.x),
                                                                                 'Secp256k1Scalar',
                                                                                 'Signet.compact line 398 char 12'),
                                          s:
                                            __compactRuntime.convertBytesToField(115792089237316195423570985008687907852837564279074904382605163141518161494336n,
                                                                                 32,
                                                                                 this._reverseBytes32_0(respondBidirectionalEvent_0.signature.s),
                                                                                 'Secp256k1Scalar',
                                                                                 'Signet.compact line 399 char 12') },
                                        mpcResponseKey_0);
  }
  _verifyRespondBidirectionalEvent_1(requestId_0,
                                     serializedOutput_0,
                                     respondBidirectionalEvent_0,
                                     mpcResponseKey_0)
  {
    const digest_0 = this._calculateSignetAttestationDigest_1(requestId_0,
                                                              serializedOutput_0);
    return this._secp256k1EcdsaVerify_0(digest_0,
                                        { r:
                                            __compactRuntime.convertBytesToField(115792089237316195423570985008687907852837564279074904382605163141518161494336n,
                                                                                 32,
                                                                                 this._reverseBytes32_0(respondBidirectionalEvent_0.signature.bigR.x),
                                                                                 'Secp256k1Scalar',
                                                                                 'Signet.compact line 398 char 12'),
                                          s:
                                            __compactRuntime.convertBytesToField(115792089237316195423570985008687907852837564279074904382605163141518161494336n,
                                                                                 32,
                                                                                 this._reverseBytes32_0(respondBidirectionalEvent_0.signature.s),
                                                                                 'Secp256k1Scalar',
                                                                                 'Signet.compact line 399 char 12') },
                                        mpcResponseKey_0);
  }
  _verifyRespondBidirectionalEvent_2(requestId_0,
                                     serializedOutput_0,
                                     respondBidirectionalEvent_0,
                                     mpcResponseKey_0)
  {
    const digest_0 = this._calculateSignetAttestationDigest_2(requestId_0,
                                                              serializedOutput_0);
    return this._secp256k1EcdsaVerify_0(digest_0,
                                        { r:
                                            __compactRuntime.convertBytesToField(115792089237316195423570985008687907852837564279074904382605163141518161494336n,
                                                                                 32,
                                                                                 this._reverseBytes32_0(respondBidirectionalEvent_0.signature.bigR.x),
                                                                                 'Secp256k1Scalar',
                                                                                 'Signet.compact line 398 char 12'),
                                          s:
                                            __compactRuntime.convertBytesToField(115792089237316195423570985008687907852837564279074904382605163141518161494336n,
                                                                                 32,
                                                                                 this._reverseBytes32_0(respondBidirectionalEvent_0.signature.s),
                                                                                 'Secp256k1Scalar',
                                                                                 'Signet.compact line 399 char 12') },
                                        mpcResponseKey_0);
  }
  _evmAddressAbiWord_0(addr_0) {
    return Uint8Array.from([...Array.from(new Uint8Array(12), BigInt),
                            ...Array.from(addr_0, BigInt)],
                           Number);
  }
  _numericAbiWord_0(value_0) {
    const le_0 = Array.from(__compactRuntime.convertBigintToBytes(16,
                                                                  value_0,
                                                                  'Signet.compact line 480 char 17'),
                            BigInt);
    return Uint8Array.from([...Array.from(new Uint8Array(16), BigInt),
                            le_0[15],
                            le_0[14],
                            le_0[13],
                            le_0[12],
                            le_0[11],
                            le_0[10],
                            le_0[9],
                            le_0[8],
                            le_0[7],
                            le_0[6],
                            le_0[5],
                            le_0[4],
                            le_0[3],
                            le_0[2],
                            le_0[1],
                            le_0[0]],
                           Number);
  }
  _abiWordToUint128_0(word_0) {
    __compactRuntime.assert(__compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                16,
                                                                ((e, i) => e.slice(i, i+16))(word_0,
                                                                                             Number(0n)),
                                                                'Field',
                                                                'Signet.compact line 499 char 12')
                            ===
                            0n,
                            'ABI word exceeds Uint<128>');
    const b0_0 = __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                     1,
                                                     ((e, i) => e.slice(i, i+1))(word_0,
                                                                                 Number(16n)),
                                                     'Field',
                                                     'Signet.compact line 500 char 17');
    const b1_0 = __compactRuntime.addField(__compactRuntime.mulField(b0_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(17n)),
                                                                               'Field',
                                                                               'Signet.compact line 501 char 30'));
    const b2_0 = __compactRuntime.addField(__compactRuntime.mulField(b1_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(18n)),
                                                                               'Field',
                                                                               'Signet.compact line 502 char 30'));
    const b3_0 = __compactRuntime.addField(__compactRuntime.mulField(b2_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(19n)),
                                                                               'Field',
                                                                               'Signet.compact line 503 char 30'));
    const b4_0 = __compactRuntime.addField(__compactRuntime.mulField(b3_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(20n)),
                                                                               'Field',
                                                                               'Signet.compact line 504 char 30'));
    const b5_0 = __compactRuntime.addField(__compactRuntime.mulField(b4_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(21n)),
                                                                               'Field',
                                                                               'Signet.compact line 505 char 30'));
    const b6_0 = __compactRuntime.addField(__compactRuntime.mulField(b5_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(22n)),
                                                                               'Field',
                                                                               'Signet.compact line 506 char 30'));
    const b7_0 = __compactRuntime.addField(__compactRuntime.mulField(b6_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(23n)),
                                                                               'Field',
                                                                               'Signet.compact line 507 char 30'));
    const b8_0 = __compactRuntime.addField(__compactRuntime.mulField(b7_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(24n)),
                                                                               'Field',
                                                                               'Signet.compact line 508 char 30'));
    const b9_0 = __compactRuntime.addField(__compactRuntime.mulField(b8_0, 256n),
                                           __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                               1,
                                                                               ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                           Number(25n)),
                                                                               'Field',
                                                                               'Signet.compact line 509 char 30'));
    const b10_0 = __compactRuntime.addField(__compactRuntime.mulField(b9_0, 256n),
                                            __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                                1,
                                                                                ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                            Number(26n)),
                                                                                'Field',
                                                                                'Signet.compact line 510 char 30'));
    const b11_0 = __compactRuntime.addField(__compactRuntime.mulField(b10_0,
                                                                      256n),
                                            __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                                1,
                                                                                ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                            Number(27n)),
                                                                                'Field',
                                                                                'Signet.compact line 511 char 30'));
    const b12_0 = __compactRuntime.addField(__compactRuntime.mulField(b11_0,
                                                                      256n),
                                            __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                                1,
                                                                                ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                            Number(28n)),
                                                                                'Field',
                                                                                'Signet.compact line 512 char 30'));
    const b13_0 = __compactRuntime.addField(__compactRuntime.mulField(b12_0,
                                                                      256n),
                                            __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                                1,
                                                                                ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                            Number(29n)),
                                                                                'Field',
                                                                                'Signet.compact line 513 char 30'));
    const b14_0 = __compactRuntime.addField(__compactRuntime.mulField(b13_0,
                                                                      256n),
                                            __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                                1,
                                                                                ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                            Number(30n)),
                                                                                'Field',
                                                                                'Signet.compact line 514 char 30'));
    const b15_0 = __compactRuntime.addField(__compactRuntime.mulField(b14_0,
                                                                      256n),
                                            __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                                1,
                                                                                ((e, i) => e.slice(i, i+1))(word_0,
                                                                                                            Number(31n)),
                                                                                'Field',
                                                                                'Signet.compact line 515 char 30'));
    return ((t1) => {
             if (t1 > 340282366920938463463374607431768211455n) {
               throw new __compactRuntime.CompactError('Signet.compact line 516 char 12: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
             }
             return t1;
           })(b15_0);
  }
  _vaultResponseSchema_0() {
    return new Uint8Array([91, 123, 34, 110, 97, 109, 101, 34, 58, 34, 115, 117, 99, 99, 101, 115, 115, 34, 44, 34, 116, 121, 112, 101, 34, 58, 34, 98, 111, 111, 108, 34, 125, 93]);
  }
  _swapOutputSchema_0() {
    return new Uint8Array([91, 123, 34, 110, 97, 109, 101, 34, 58, 34, 97, 109, 111, 117, 110, 116, 73, 110, 34, 44, 34, 116, 121, 112, 101, 34, 58, 34, 117, 105, 110, 116, 50, 53, 54, 34, 125, 93]);
  }
  _swapRespondSchema_0() {
    return new Uint8Array([91, 123, 34, 110, 97, 109, 101, 34, 58, 34, 97, 109, 111, 117, 110, 116, 73, 110, 34, 44, 34, 116, 121, 112, 101, 34, 58, 34, 117, 105, 110, 116, 54, 52, 34, 125, 93]);
  }
  _vaultTokenDomainSeparator_0(erc20Address_0) {
    return this._persistentHash_1([new Uint8Array([101, 114, 99, 50, 48, 58, 118, 97, 117, 108, 116, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   __compactRuntime.convertBigintToBytes(32,
                                                                         __compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                                                             20,
                                                                                                             erc20Address_0,
                                                                                                             'Field',
                                                                                                             'erc20-vault.compact line 165 char 5'),
                                                                         'erc20-vault.compact line 165 char 5')]);
  }
  _callerSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.callerSecretKey(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('callerSecretKey',
                                 'return value',
                                 'erc20-vault.compact line 175 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _userCommitment_0(sk_0) {
    return this._persistentHash_1([new Uint8Array([118, 97, 117, 108, 116, 58, 117, 115, 101, 114, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  _withdrawRefundCommitment_0(sk_0, requestId_0) {
    return this._persistentHash_0([new Uint8Array([118, 97, 117, 108, 116, 58, 114, 101, 102, 117, 110, 100, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0,
                                   requestId_0]);
  }
  async _initialize_0(context,
                      partialProofData,
                      vaultEvm_0,
                      swapRouter_0,
                      chainId_0,
                      chainCaip2Id_0,
                      responseKey_0)
  {
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(4n),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value)
                            ===
                            0n,
                            'Already initialized');
    __compactRuntime.assert(this._equal_1(this._userCommitment_0(this._callerSecretKey_0(context,
                                                                                         partialProofData)),
                                          _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_5.toValue(8n),
                                                                                                                                alignment: _descriptor_5.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Not the deployer');
    __compactRuntime.assert(chainId_0 > 0n, 'Chain ID must be positive');
    __compactRuntime.assert(__compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                20,
                                                                swapRouter_0,
                                                                'Field',
                                                                'erc20-vault.compact line 227 char 10')
                            !==
                            0n,
                            'Router cannot be zero');
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(4n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_13.toValue(tmp_0),
                                                                alignment: _descriptor_13.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(5n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(vaultEvm_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(10n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(swapRouter_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(6n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(chainId_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(7n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(chainCaip2Id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(2n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(responseKey_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  async _deposit_0(context,
                   partialProofData,
                   evmNonce_0,
                   gasLimit_0,
                   maxFeePerGas_0,
                   maxPriorityFeePerGas_0,
                   keyVersion_0,
                   depositRequest_0)
  {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_5.toValue(4n),
                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value),
                             t_0 >= 1n),
                            'Not initialized');
    __compactRuntime.assert(__compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                20,
                                                                depositRequest_0.erc20Address,
                                                                'Field',
                                                                'erc20-vault.compact line 261 char 10')
                            !==
                            0n,
                            'ERC20 address cannot be zero');
    let t_1;
    __compactRuntime.assert((t_1 = depositRequest_0.amount, t_1 > 0n),
                            'Amount must be positive');
    let t_2;
    __compactRuntime.assert((t_2 = depositRequest_0.amount,
                             t_2 <= 18446744073709551615n),
                            'Amount exceeds Uint<64> max');
    __compactRuntime.assert(gasLimit_0 > 0n, 'Gas limit must be positive');
    const caller_0 = this._userCommitment_0(this._callerSecretKey_0(context,
                                                                    partialProofData));
    const calldata_0 = { selector:
                           Uint8Array.from([169n, 5n, 156n, 187n], Number),
                         noWords: 2n,
                         words:
                           [this._evmAddressAbiWord_0(_descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                 partialProofData,
                                                                                                                 [
                                                                                                                  { dup: { n: 0 } },
                                                                                                                  { idx: { cached: false,
                                                                                                                           pushPath: false,
                                                                                                                           path: [
                                                                                                                                  { tag: 'value',
                                                                                                                                    value: { value: _descriptor_5.toValue(5n),
                                                                                                                                             alignment: _descriptor_5.alignment() } }] } },
                                                                                                                  { popeq: { cached: false,
                                                                                                                             result: undefined } }]).value)),
                            this._numericAbiWord_0(depositRequest_0.amount)] };
    const txParams_0 = { chainId:
                           _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_5.toValue(6n),
                                                                                                                 alignment: _descriptor_5.alignment() } }] } },
                                                                                      { popeq: { cached: false,
                                                                                                 result: undefined } }]).value),
                         nonce: evmNonce_0,
                         maxPriorityFeePerGas: maxPriorityFeePerGas_0,
                         maxFeePerGas: maxFeePerGas_0,
                         gasLimit: gasLimit_0,
                         to: depositRequest_0.erc20Address,
                         value: 0n,
                         calldata: this._some_0(calldata_0),
                         accessListEntryCount: 0n,
                         accessList: [] };
    const schema_0 = this._vaultResponseSchema_0();
    const requestNonce_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_5.toValue(3n),
                                                                                                                 alignment: _descriptor_5.alignment() } }] } },
                                                                                      { popeq: { cached: true,
                                                                                                 result: undefined } }]).value);
    const request_0 = this._constructSignBidirectionalEvent_0(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 2 } },
                                                                                                                         { idx: { cached: true,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_5.toValue(0n),
                                                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                                                         { popeq: { cached: true,
                                                                                                                                    result: undefined } }]).value),
                                                              requestNonce_0,
                                                              keyVersion_0,
                                                              caller_0,
                                                              0,
                                                              0,
                                                              new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                              0,
                                                              txParams_0,
                                                              _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 0 } },
                                                                                                                         { idx: { cached: false,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_5.toValue(7n),
                                                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                                                         { popeq: { cached: false,
                                                                                                                                    result: undefined } }]).value),
                                                              schema_0,
                                                              schema_0);
    const requestId_0 = this._calculateRequestId_0(request_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_5.toValue(0n),
                                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Request already exists');
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(3n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_13.toValue(tmp_0),
                                                                alignment: _descriptor_13.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(0n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_33.toValue(request_0),
                                                                                              alignment: _descriptor_33.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await __compactRuntime.crossContractCall(context,
                                             __compactContractsImport_SignetSigner,
                                             'signBidirectional',
                                             __compactRuntime.decodeContractAddress((_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                               partialProofData,
                                                                                                                                               [
                                                                                                                                                { dup: { n: 0 } },
                                                                                                                                                { idx: { cached: false,
                                                                                                                                                         pushPath: false,
                                                                                                                                                         path: [
                                                                                                                                                                { tag: 'value',
                                                                                                                                                                  value: { value: _descriptor_5.toValue(1n),
                                                                                                                                                                           alignment: _descriptor_5.alignment() } }] } },
                                                                                                                                                { popeq: { cached: false,
                                                                                                                                                           result: undefined } }]).value)).bytes),
                                             false,
                                             partialProofData,
                                             requestId_0,
                                             this._constructSignBidirectionalEventNotificationV1_0(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                             partialProofData,
                                                                                                                                                             [
                                                                                                                                                              { dup: { n: 2 } },
                                                                                                                                                              { idx: { cached: true,
                                                                                                                                                                       pushPath: false,
                                                                                                                                                                       path: [
                                                                                                                                                                              { tag: 'value',
                                                                                                                                                                                value: { value: _descriptor_5.toValue(0n),
                                                                                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                                                                                              { popeq: { cached: true,
                                                                                                                                                                         result: undefined } }]).value),
                                                                                                   1n,
                                                                                                   [0n,
                                                                                                    0n,
                                                                                                    0n,
                                                                                                    0n]));
    return [];
  }
  async _claim_0(context,
                 partialProofData,
                 requestId_0,
                 respondBidirectionalEvent_0,
                 serializedOutput_0,
                 mintNonce_0,
                 recipient_0)
  {
    const disclosedRequestId_0 = requestId_0;
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_5.toValue(4n),
                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value),
                             t_0 >= 1n),
                            'Not initialized');
    const response_0 = this._deserialize_0(serializedOutput_0);
    __compactRuntime.assert(response_0.success, 'ERC20 transfer returned false');
    __compactRuntime.assert(this._verifyRespondBidirectionalEvent_0(disclosedRequestId_0,
                                                                    serializedOutput_0,
                                                                    respondBidirectionalEvent_0,
                                                                    _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                              partialProofData,
                                                                                                                              [
                                                                                                                               { dup: { n: 0 } },
                                                                                                                               { idx: { cached: false,
                                                                                                                                        pushPath: false,
                                                                                                                                        path: [
                                                                                                                                               { tag: 'value',
                                                                                                                                                 value: { value: _descriptor_5.toValue(2n),
                                                                                                                                                          alignment: _descriptor_5.alignment() } }] } },
                                                                                                                               { popeq: { cached: false,
                                                                                                                                          result: undefined } }]).value)),
                            'Invalid attestation signature');
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(0n),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Request not found');
    const signatureRequest_0 = _descriptor_33.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_5.toValue(0n),
                                                                                                                      alignment: _descriptor_5.alignment() } }] } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(0n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 1 } }]);
    const caller_0 = this._userCommitment_0(this._callerSecretKey_0(context,
                                                                    partialProofData));
    __compactRuntime.assert(this._equal_2(caller_0, signatureRequest_0.path),
                            'Not the depositor');
    __compactRuntime.assert(signatureRequest_0.txParams.calldata.is_some,
                            'Request has no calldata');
    const amount_0 = this._abiWordToUint128_0(signatureRequest_0.txParams.calldata.value.words[1]);
    const erc20Addr_0 = signatureRequest_0.txParams.to;
    const domainSep_0 = this._vaultTokenDomainSeparator_0(erc20Addr_0);
    const claimRecipient_0 = recipient_0.is_some ?
                             recipient_0.value :
                             this._left_0(this._ownPublicKey_0(context,
                                                               partialProofData));
    await this._mintShieldedToken_0(context,
                                    partialProofData,
                                    domainSep_0,
                                    ((t1) => {
                                      if (t1 > 18446744073709551615n) {
                                        throw new __compactRuntime.CompactError('erc20-vault.compact line 397 char 32: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                      }
                                      return t1;
                                    })(amount_0),
                                    mintNonce_0,
                                    claimRecipient_0);
    return [];
  }
  async _withdraw_0(context,
                    partialProofData,
                    evmNonce_0,
                    keyVersion_0,
                    withdrawRequest_0,
                    coin_0)
  {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_5.toValue(4n),
                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value),
                             t_0 >= 1n),
                            'Not initialized');
    __compactRuntime.assert(__compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                20,
                                                                withdrawRequest_0.erc20Address,
                                                                'Field',
                                                                'erc20-vault.compact line 428 char 10')
                            !==
                            0n,
                            'ERC20 address cannot be zero');
    let t_1;
    __compactRuntime.assert((t_1 = withdrawRequest_0.amount, t_1 > 0n),
                            'Amount must be positive');
    let t_2;
    __compactRuntime.assert((t_2 = withdrawRequest_0.amount,
                             t_2 <= 18446744073709551615n),
                            'Amount exceeds Uint<64> max');
    const color_0 = this._tokenType_0(this._vaultTokenDomainSeparator_0(withdrawRequest_0.erc20Address),
                                      _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 2 } },
                                                                                                 { idx: { cached: true,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_5.toValue(0n),
                                                                                                                            alignment: _descriptor_5.alignment() } }] } },
                                                                                                 { popeq: { cached: true,
                                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(this._equal_3(coin_0.color, color_0),
                            'Coin is not the vault token for this ERC20');
    __compactRuntime.assert(coin_0.value === withdrawRequest_0.amount,
                            'Coin value must equal the withdraw amount');
    const calldata_0 = { selector:
                           Uint8Array.from([169n, 5n, 156n, 187n], Number),
                         noWords: 2n,
                         words:
                           [this._evmAddressAbiWord_0(withdrawRequest_0.destEvmAddress),
                            this._numericAbiWord_0(withdrawRequest_0.amount)] };
    const txParams_0 = { chainId:
                           _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_5.toValue(6n),
                                                                                                                 alignment: _descriptor_5.alignment() } }] } },
                                                                                      { popeq: { cached: false,
                                                                                                 result: undefined } }]).value),
                         nonce: evmNonce_0,
                         maxPriorityFeePerGas: 1000000000n,
                         maxFeePerGas: 30000000000n,
                         gasLimit: 100000n,
                         to: withdrawRequest_0.erc20Address,
                         value: 0n,
                         calldata: this._some_0(calldata_0),
                         accessListEntryCount: 0n,
                         accessList: [] };
    const path_0 = new Uint8Array([118, 97, 117, 108, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const schema_0 = this._vaultResponseSchema_0();
    const requestNonce_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_5.toValue(3n),
                                                                                                                 alignment: _descriptor_5.alignment() } }] } },
                                                                                      { popeq: { cached: true,
                                                                                                 result: undefined } }]).value);
    const request_0 = this._constructSignBidirectionalEvent_0(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 2 } },
                                                                                                                         { idx: { cached: true,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_5.toValue(0n),
                                                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                                                         { popeq: { cached: true,
                                                                                                                                    result: undefined } }]).value),
                                                              requestNonce_0,
                                                              keyVersion_0,
                                                              path_0,
                                                              0,
                                                              0,
                                                              new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                              0,
                                                              txParams_0,
                                                              _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 0 } },
                                                                                                                         { idx: { cached: false,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_5.toValue(7n),
                                                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                                                         { popeq: { cached: false,
                                                                                                                                    result: undefined } }]).value),
                                                              schema_0,
                                                              schema_0);
    const requestId_0 = this._calculateRequestId_0(request_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_5.toValue(0n),
                                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Request already exists');
    await this._receiveShielded_0(context, partialProofData, coin_0);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(3n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_13.toValue(tmp_0),
                                                                alignment: _descriptor_13.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(0n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_33.toValue(request_0),
                                                                                              alignment: _descriptor_33.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this._withdrawRefundCommitment_0(this._callerSecretKey_0(context,
                                                                           partialProofData),
                                                   requestId_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(9n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await __compactRuntime.crossContractCall(context,
                                             __compactContractsImport_SignetSigner,
                                             'signBidirectional',
                                             __compactRuntime.decodeContractAddress((_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                               partialProofData,
                                                                                                                                               [
                                                                                                                                                { dup: { n: 0 } },
                                                                                                                                                { idx: { cached: false,
                                                                                                                                                         pushPath: false,
                                                                                                                                                         path: [
                                                                                                                                                                { tag: 'value',
                                                                                                                                                                  value: { value: _descriptor_5.toValue(1n),
                                                                                                                                                                           alignment: _descriptor_5.alignment() } }] } },
                                                                                                                                                { popeq: { cached: false,
                                                                                                                                                           result: undefined } }]).value)).bytes),
                                             false,
                                             partialProofData,
                                             requestId_0,
                                             this._constructSignBidirectionalEventNotificationV1_0(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                             partialProofData,
                                                                                                                                                             [
                                                                                                                                                              { dup: { n: 2 } },
                                                                                                                                                              { idx: { cached: true,
                                                                                                                                                                       pushPath: false,
                                                                                                                                                                       path: [
                                                                                                                                                                              { tag: 'value',
                                                                                                                                                                                value: { value: _descriptor_5.toValue(0n),
                                                                                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                                                                                              { popeq: { cached: true,
                                                                                                                                                                         result: undefined } }]).value),
                                                                                                   1n,
                                                                                                   [0n,
                                                                                                    0n,
                                                                                                    0n,
                                                                                                    0n]));
    return [];
  }
  async _refundSurrenderedValue_0(context,
                                  partialProofData,
                                  disclosedRequestId_0,
                                  signatureRequest_0,
                                  mintNonce_0)
  {
    __compactRuntime.assert(this._equal_4(this._withdrawRefundCommitment_0(this._callerSecretKey_0(context,
                                                                                                   partialProofData),
                                                                           disclosedRequestId_0),
                                          _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_5.toValue(9n),
                                                                                                                                alignment: _descriptor_5.alignment() } }] } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                                alignment: _descriptor_0.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Not the withdrawer');
    __compactRuntime.assert(signatureRequest_0.txParams.calldata.is_some,
                            'Request has no calldata');
    const amount_0 = this._abiWordToUint128_0(signatureRequest_0.txParams.calldata.value.words[1]);
    const erc20Addr_0 = signatureRequest_0.txParams.to;
    const domainSep_0 = this._vaultTokenDomainSeparator_0(erc20Addr_0);
    const recipient_0 = this._left_0(this._ownPublicKey_0(context,
                                                          partialProofData));
    await this._mintShieldedToken_0(context,
                                    partialProofData,
                                    domainSep_0,
                                    ((t1) => {
                                      if (t1 > 18446744073709551615n) {
                                        throw new __compactRuntime.CompactError('erc20-vault.compact line 543 char 32: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                      }
                                      return t1;
                                    })(amount_0),
                                    mintNonce_0,
                                    recipient_0);
    return [];
  }
  async _completeWithdraw_0(context,
                            partialProofData,
                            requestId_0,
                            respondBidirectionalEvent_0,
                            serializedOutput_0,
                            mintNonce_0)
  {
    const disclosedRequestId_0 = requestId_0;
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_5.toValue(4n),
                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value),
                             t_0 >= 1n),
                            'Not initialized');
    __compactRuntime.assert(this._verifyRespondBidirectionalEvent_0(disclosedRequestId_0,
                                                                    serializedOutput_0,
                                                                    respondBidirectionalEvent_0,
                                                                    _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                              partialProofData,
                                                                                                                              [
                                                                                                                               { dup: { n: 0 } },
                                                                                                                               { idx: { cached: false,
                                                                                                                                        pushPath: false,
                                                                                                                                        path: [
                                                                                                                                               { tag: 'value',
                                                                                                                                                 value: { value: _descriptor_5.toValue(2n),
                                                                                                                                                          alignment: _descriptor_5.alignment() } }] } },
                                                                                                                               { popeq: { cached: false,
                                                                                                                                          result: undefined } }]).value)),
                            'Invalid attestation signature');
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(9n),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Withdrawal not found');
    const signatureRequest_0 = _descriptor_33.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_5.toValue(0n),
                                                                                                                      alignment: _descriptor_5.alignment() } }] } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(0n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 1 } }]);
    const succeeded_0 = this._deserialize_0(serializedOutput_0).success;
    if (!succeeded_0) {
      await this._refundSurrenderedValue_0(context,
                                           partialProofData,
                                           disclosedRequestId_0,
                                           signatureRequest_0,
                                           mintNonce_0);
    }
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(9n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _refund_0(context,
                  partialProofData,
                  requestId_0,
                  respondBidirectionalEvent_0,
                  serializedOutput_0,
                  mintNonce_0)
  {
    const disclosedRequestId_0 = requestId_0;
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_5.toValue(4n),
                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value),
                             t_0 >= 1n),
                            'Not initialized');
    __compactRuntime.assert(this._verifyRespondBidirectionalEvent_1(disclosedRequestId_0,
                                                                    serializedOutput_0,
                                                                    respondBidirectionalEvent_0,
                                                                    _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                              partialProofData,
                                                                                                                              [
                                                                                                                               { dup: { n: 0 } },
                                                                                                                               { idx: { cached: false,
                                                                                                                                        pushPath: false,
                                                                                                                                        path: [
                                                                                                                                               { tag: 'value',
                                                                                                                                                 value: { value: _descriptor_5.toValue(2n),
                                                                                                                                                          alignment: _descriptor_5.alignment() } }] } },
                                                                                                                               { popeq: { cached: false,
                                                                                                                                          result: undefined } }]).value)),
                            'Invalid attestation signature');
    const failureOutput_0 = Uint8Array.from([222n, 173n, 190n, 239n, 1n], Number);
    __compactRuntime.assert(this._equal_5(serializedOutput_0, failureOutput_0),
                            'Not the MPC failure output');
    if (_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_5.toValue(9n),
                                                                                              alignment: _descriptor_5.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value))
    {
      const signatureRequest_0 = _descriptor_33.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_5.toValue(0n),
                                                                                                                        alignment: _descriptor_5.alignment() } }] } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_5.toValue(0n),
                                                                    alignment: _descriptor_5.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 1 } }]);
      await this._refundSurrenderedValue_0(context,
                                           partialProofData,
                                           disclosedRequestId_0,
                                           signatureRequest_0,
                                           mintNonce_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_5.toValue(9n),
                                                                    alignment: _descriptor_5.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 1 } }]);
    } else {
      __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_5.toValue(12n),
                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                              'Request not found');
      const signatureRequest_1 = _descriptor_23.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_5.toValue(11n),
                                                                                                                        alignment: _descriptor_5.alignment() } }] } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_5.toValue(11n),
                                                                    alignment: _descriptor_5.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 1 } }]);
      __compactRuntime.assert(this._equal_6(this._withdrawRefundCommitment_0(this._callerSecretKey_0(context,
                                                                                                     partialProofData),
                                                                             disclosedRequestId_0),
                                            _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_5.toValue(12n),
                                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                                  alignment: _descriptor_0.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value)),
                              'Not the swapper');
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_5.toValue(12n),
                                                                    alignment: _descriptor_5.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { rem: { cached: false } },
                                         { ins: { cached: true, n: 1 } }]);
      __compactRuntime.assert(signatureRequest_1.txParams.calldata.is_some,
                              'Request has no calldata');
      const amountInMaximum_0 = this._abiWordToUint128_0(signatureRequest_1.txParams.calldata.value.words[5]);
      const tokenIn_0 = ((e, i) => e.slice(i, i+20))(signatureRequest_1.txParams.calldata.value.words[0],
                                                     Number(12n));
      const domainSep_0 = this._vaultTokenDomainSeparator_0(tokenIn_0);
      const recipient_0 = this._left_0(this._ownPublicKey_0(context,
                                                            partialProofData));
      await this._mintShieldedToken_0(context,
                                      partialProofData,
                                      domainSep_0,
                                      ((t1) => {
                                        if (t1 > 18446744073709551615n) {
                                          throw new __compactRuntime.CompactError('erc20-vault.compact line 674 char 34: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                        }
                                        return t1;
                                      })(amountInMaximum_0),
                                      mintNonce_0,
                                      recipient_0);
    }
    return [];
  }
  async _approveRouter_0(context,
                         partialProofData,
                         erc20Address_0,
                         evmNonce_0,
                         keyVersion_0)
  {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_5.toValue(4n),
                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value),
                             t_0 >= 1n),
                            'Not initialized');
    __compactRuntime.assert(__compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                20,
                                                                erc20Address_0,
                                                                'Field',
                                                                'erc20-vault.compact line 701 char 10')
                            !==
                            0n,
                            'ERC20 address cannot be zero');
    const calldata_0 = { selector:
                           Uint8Array.from([9n, 94n, 167n, 179n], Number),
                         noWords: 2n,
                         words:
                           [this._evmAddressAbiWord_0(_descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                 partialProofData,
                                                                                                                 [
                                                                                                                  { dup: { n: 0 } },
                                                                                                                  { idx: { cached: false,
                                                                                                                           pushPath: false,
                                                                                                                           path: [
                                                                                                                                  { tag: 'value',
                                                                                                                                    value: { value: _descriptor_5.toValue(10n),
                                                                                                                                             alignment: _descriptor_5.alignment() } }] } },
                                                                                                                  { popeq: { cached: false,
                                                                                                                             result: undefined } }]).value)),
                            this._numericAbiWord_0(340282366920938463463374607431768211455n)] };
    const txParams_0 = { chainId:
                           _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_5.toValue(6n),
                                                                                                                 alignment: _descriptor_5.alignment() } }] } },
                                                                                      { popeq: { cached: false,
                                                                                                 result: undefined } }]).value),
                         nonce: evmNonce_0,
                         maxPriorityFeePerGas: 1000000000n,
                         maxFeePerGas: 30000000000n,
                         gasLimit: 100000n,
                         to: erc20Address_0,
                         value: 0n,
                         calldata: this._some_0(calldata_0),
                         accessListEntryCount: 0n,
                         accessList: [] };
    const path_0 = new Uint8Array([118, 97, 117, 108, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const schema_0 = this._vaultResponseSchema_0();
    const requestNonce_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_5.toValue(3n),
                                                                                                                 alignment: _descriptor_5.alignment() } }] } },
                                                                                      { popeq: { cached: true,
                                                                                                 result: undefined } }]).value);
    const request_0 = this._constructSignBidirectionalEvent_0(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 2 } },
                                                                                                                         { idx: { cached: true,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_5.toValue(0n),
                                                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                                                         { popeq: { cached: true,
                                                                                                                                    result: undefined } }]).value),
                                                              requestNonce_0,
                                                              keyVersion_0,
                                                              path_0,
                                                              0,
                                                              0,
                                                              new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                              0,
                                                              txParams_0,
                                                              _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 0 } },
                                                                                                                         { idx: { cached: false,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_5.toValue(7n),
                                                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                                                         { popeq: { cached: false,
                                                                                                                                    result: undefined } }]).value),
                                                              schema_0,
                                                              schema_0);
    const requestId_0 = this._calculateRequestId_0(request_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_5.toValue(0n),
                                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Request already exists');
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(3n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_13.toValue(tmp_0),
                                                                alignment: _descriptor_13.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(0n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_33.toValue(request_0),
                                                                                              alignment: _descriptor_33.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await __compactRuntime.crossContractCall(context,
                                             __compactContractsImport_SignetSigner,
                                             'signBidirectional',
                                             __compactRuntime.decodeContractAddress((_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                               partialProofData,
                                                                                                                                               [
                                                                                                                                                { dup: { n: 0 } },
                                                                                                                                                { idx: { cached: false,
                                                                                                                                                         pushPath: false,
                                                                                                                                                         path: [
                                                                                                                                                                { tag: 'value',
                                                                                                                                                                  value: { value: _descriptor_5.toValue(1n),
                                                                                                                                                                           alignment: _descriptor_5.alignment() } }] } },
                                                                                                                                                { popeq: { cached: false,
                                                                                                                                                           result: undefined } }]).value)).bytes),
                                             false,
                                             partialProofData,
                                             requestId_0,
                                             this._constructSignBidirectionalEventNotificationV1_0(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                             partialProofData,
                                                                                                                                                             [
                                                                                                                                                              { dup: { n: 2 } },
                                                                                                                                                              { idx: { cached: true,
                                                                                                                                                                       pushPath: false,
                                                                                                                                                                       path: [
                                                                                                                                                                              { tag: 'value',
                                                                                                                                                                                value: { value: _descriptor_5.toValue(0n),
                                                                                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                                                                                              { popeq: { cached: true,
                                                                                                                                                                         result: undefined } }]).value),
                                                                                                   1n,
                                                                                                   [0n,
                                                                                                    0n,
                                                                                                    0n,
                                                                                                    0n]));
    return [];
  }
  async _swap_0(context,
                partialProofData,
                evmNonce_0,
                keyVersion_0,
                swapRequest_0,
                coin_0)
  {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_5.toValue(4n),
                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value),
                             t_0 >= 1n),
                            'Not initialized');
    __compactRuntime.assert(__compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                20,
                                                                swapRequest_0.tokenIn,
                                                                'Field',
                                                                'erc20-vault.compact line 793 char 10')
                            !==
                            0n,
                            'tokenIn cannot be zero');
    __compactRuntime.assert(__compactRuntime.convertBytesToUint(52435875175126190479447740508185965837690552500527637822603658699938581184512n,
                                                                20,
                                                                swapRequest_0.tokenOut,
                                                                'Field',
                                                                'erc20-vault.compact line 794 char 10')
                            !==
                            0n,
                            'tokenOut cannot be zero');
    let t_1;
    __compactRuntime.assert((t_1 = swapRequest_0.amountOut, t_1 > 0n),
                            'amountOut must be positive');
    let t_2;
    __compactRuntime.assert((t_2 = swapRequest_0.amountInMaximum, t_2 > 0n),
                            'amountInMaximum must be positive');
    let t_3;
    __compactRuntime.assert((t_3 = swapRequest_0.amountOut,
                             t_3 <= 18446744073709551615n),
                            'amountOut exceeds Uint<64> max');
    let t_4;
    __compactRuntime.assert((t_4 = swapRequest_0.amountInMaximum,
                             t_4 <= 18446744073709551615n),
                            'amountInMaximum exceeds Uint<64> max');
    const color_0 = this._tokenType_0(this._vaultTokenDomainSeparator_0(swapRequest_0.tokenIn),
                                      _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 2 } },
                                                                                                 { idx: { cached: true,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_5.toValue(0n),
                                                                                                                            alignment: _descriptor_5.alignment() } }] } },
                                                                                                 { popeq: { cached: true,
                                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(this._equal_7(coin_0.color, color_0),
                            'Coin is not the vault token for tokenIn');
    __compactRuntime.assert(coin_0.value === swapRequest_0.amountInMaximum,
                            'Coin value must equal amountInMaximum');
    const calldata_0 = { selector:
                           Uint8Array.from([80n, 35n, 180n, 223n], Number),
                         noWords: 7n,
                         words:
                           [this._evmAddressAbiWord_0(swapRequest_0.tokenIn),
                            this._evmAddressAbiWord_0(swapRequest_0.tokenOut),
                            this._numericAbiWord_0(swapRequest_0.fee),
                            this._evmAddressAbiWord_0(_descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                 partialProofData,
                                                                                                                 [
                                                                                                                  { dup: { n: 0 } },
                                                                                                                  { idx: { cached: false,
                                                                                                                           pushPath: false,
                                                                                                                           path: [
                                                                                                                                  { tag: 'value',
                                                                                                                                    value: { value: _descriptor_5.toValue(5n),
                                                                                                                                             alignment: _descriptor_5.alignment() } }] } },
                                                                                                                  { popeq: { cached: false,
                                                                                                                             result: undefined } }]).value)),
                            this._numericAbiWord_0(swapRequest_0.amountOut),
                            this._numericAbiWord_0(swapRequest_0.amountInMaximum),
                            this._numericAbiWord_0(0n)] };
    const txParams_0 = { chainId:
                           _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_5.toValue(6n),
                                                                                                                 alignment: _descriptor_5.alignment() } }] } },
                                                                                      { popeq: { cached: false,
                                                                                                 result: undefined } }]).value),
                         nonce: evmNonce_0,
                         maxPriorityFeePerGas: 1000000000n,
                         maxFeePerGas: 30000000000n,
                         gasLimit: 700000n,
                         to:
                           _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(10n),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                         value: 0n,
                         calldata: this._some_1(calldata_0),
                         accessListEntryCount: 0n,
                         accessList: [] };
    const path_0 = new Uint8Array([118, 97, 117, 108, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const requestNonce_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_5.toValue(3n),
                                                                                                                 alignment: _descriptor_5.alignment() } }] } },
                                                                                      { popeq: { cached: true,
                                                                                                 result: undefined } }]).value);
    const request_0 = this._constructSignBidirectionalEvent_1(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 2 } },
                                                                                                                         { idx: { cached: true,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_5.toValue(0n),
                                                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                                                         { popeq: { cached: true,
                                                                                                                                    result: undefined } }]).value),
                                                              requestNonce_0,
                                                              keyVersion_0,
                                                              path_0,
                                                              0,
                                                              0,
                                                              new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                              0,
                                                              txParams_0,
                                                              _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 0 } },
                                                                                                                         { idx: { cached: false,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_5.toValue(7n),
                                                                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                                                                         { popeq: { cached: false,
                                                                                                                                    result: undefined } }]).value),
                                                              this._swapOutputSchema_0(),
                                                              this._swapRespondSchema_0());
    const requestId_0 = this._calculateRequestId_1(request_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_5.toValue(11n),
                                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Request already exists');
    await this._receiveShielded_0(context, partialProofData, coin_0);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(3n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_13.toValue(tmp_0),
                                                                alignment: _descriptor_13.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(11n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_23.toValue(request_0),
                                                                                              alignment: _descriptor_23.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this._withdrawRefundCommitment_0(this._callerSecretKey_0(context,
                                                                           partialProofData),
                                                   requestId_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(12n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(requestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await __compactRuntime.crossContractCall(context,
                                             __compactContractsImport_SignetSigner,
                                             'signBidirectional',
                                             __compactRuntime.decodeContractAddress((_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                               partialProofData,
                                                                                                                                               [
                                                                                                                                                { dup: { n: 0 } },
                                                                                                                                                { idx: { cached: false,
                                                                                                                                                         pushPath: false,
                                                                                                                                                         path: [
                                                                                                                                                                { tag: 'value',
                                                                                                                                                                  value: { value: _descriptor_5.toValue(1n),
                                                                                                                                                                           alignment: _descriptor_5.alignment() } }] } },
                                                                                                                                                { popeq: { cached: false,
                                                                                                                                                           result: undefined } }]).value)).bytes),
                                             false,
                                             partialProofData,
                                             requestId_0,
                                             this._constructSignBidirectionalEventNotificationV1_0(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                             partialProofData,
                                                                                                                                                             [
                                                                                                                                                              { dup: { n: 2 } },
                                                                                                                                                              { idx: { cached: true,
                                                                                                                                                                       pushPath: false,
                                                                                                                                                                       path: [
                                                                                                                                                                              { tag: 'value',
                                                                                                                                                                                value: { value: _descriptor_5.toValue(0n),
                                                                                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                                                                                              { popeq: { cached: true,
                                                                                                                                                                         result: undefined } }]).value),
                                                                                                   1n,
                                                                                                   [11n,
                                                                                                    0n,
                                                                                                    0n,
                                                                                                    0n]));
    return [];
  }
  async _completeSwap_0(context,
                        partialProofData,
                        requestId_0,
                        respondBidirectionalEvent_0,
                        serializedOutput_0,
                        mintNonce_0)
  {
    const disclosedRequestId_0 = requestId_0;
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_5.toValue(4n),
                                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                                              { popeq: { cached: true,
                                                                                                         result: undefined } }]).value),
                             t_0 >= 1n),
                            'Not initialized');
    __compactRuntime.assert(this._verifyRespondBidirectionalEvent_2(disclosedRequestId_0,
                                                                    serializedOutput_0,
                                                                    respondBidirectionalEvent_0,
                                                                    _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                              partialProofData,
                                                                                                                              [
                                                                                                                               { dup: { n: 0 } },
                                                                                                                               { idx: { cached: false,
                                                                                                                                        pushPath: false,
                                                                                                                                        path: [
                                                                                                                                               { tag: 'value',
                                                                                                                                                 value: { value: _descriptor_5.toValue(2n),
                                                                                                                                                          alignment: _descriptor_5.alignment() } }] } },
                                                                                                                               { popeq: { cached: false,
                                                                                                                                          result: undefined } }]).value)),
                            'Invalid attestation signature');
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(12n),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Swap not found');
    const signatureRequest_0 = _descriptor_23.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_5.toValue(11n),
                                                                                                                      alignment: _descriptor_5.alignment() } }] } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(11n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.assert(this._equal_8(this._withdrawRefundCommitment_0(this._callerSecretKey_0(context,
                                                                                                   partialProofData),
                                                                           disclosedRequestId_0),
                                          _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_5.toValue(12n),
                                                                                                                                alignment: _descriptor_5.alignment() } }] } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                                                                alignment: _descriptor_0.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Not the swapper');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(12n),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedRequestId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.assert(signatureRequest_0.txParams.calldata.is_some,
                            'Request has no calldata');
    const recipient_0 = this._left_0(this._ownPublicKey_0(context,
                                                          partialProofData));
    const amountOut_0 = this._abiWordToUint128_0(signatureRequest_0.txParams.calldata.value.words[4]);
    const tokenOut_0 = ((e, i) => e.slice(i, i+20))(signatureRequest_0.txParams.calldata.value.words[1],
                                                    Number(12n));
    await this._mintShieldedToken_0(context,
                                    partialProofData,
                                    this._vaultTokenDomainSeparator_0(tokenOut_0),
                                    ((t1) => {
                                      if (t1 > 18446744073709551615n) {
                                        throw new __compactRuntime.CompactError('erc20-vault.compact line 932 char 58: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                      }
                                      return t1;
                                    })(amountOut_0),
                                    mintNonce_0,
                                    recipient_0);
    const amountIn_0 = this._deserialize_1(serializedOutput_0).amountIn;
    const amountInMaximum_0 = this._abiWordToUint128_0(signatureRequest_0.txParams.calldata.value.words[5]);
    let t_1;
    const change_0 = (t_1 = amountIn_0,
                      (__compactRuntime.assert(amountInMaximum_0 >= t_1,
                                               'result of subtraction would be negative'),
                       amountInMaximum_0 - t_1));
    const tokenIn_0 = ((e, i) => e.slice(i, i+20))(signatureRequest_0.txParams.calldata.value.words[0],
                                                   Number(12n));
    const changeNonce_0 = this._persistentHash_1([mintNonce_0,
                                                  new Uint8Array([99, 104, 97, 110, 103, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])]);
    await this._mintShieldedToken_0(context,
                                    partialProofData,
                                    this._vaultTokenDomainSeparator_0(tokenIn_0),
                                    ((t1) => {
                                      if (t1 > 18446744073709551615n) {
                                        throw new __compactRuntime.CompactError('erc20-vault.compact line 943 char 57: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                      }
                                      return t1;
                                    })(change_0),
                                    changeNonce_0,
                                    recipient_0);
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
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
    signBidirectionalEventMap: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(0n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(0n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'erc20-vault.compact line 50 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(0n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'erc20-vault.compact line 50 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_33.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_5.toValue(0n),
                                                                                                      alignment: _descriptor_5.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(key_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_33.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get mpcResponseKey() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_5.toValue(2n),
                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get signetRequestNonce() {
      return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_5.toValue(3n),
                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get initialized() {
      return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_5.toValue(4n),
                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get vaultEvmAddress() {
      return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_5.toValue(5n),
                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    },
    get evmChainId() {
      return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_5.toValue(6n),
                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get caip2Id() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_5.toValue(7n),
                                                                                                   alignment: _descriptor_5.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    refundCommitment: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(9n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(9n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'erc20-vault.compact line 94 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(9n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'erc20-vault.compact line 94 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(9n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[9];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_0.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get uniswapRouter() {
      return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_5.toValue(10n),
                                                                                                    alignment: _descriptor_5.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    },
    swapEventMap: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(11n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(11n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'erc20-vault.compact line 108 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(11n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'erc20-vault.compact line 108 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_23.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_5.toValue(11n),
                                                                                                      alignment: _descriptor_5.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(key_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[11];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_23.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    swapRefundCommitment: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(12n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(12n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'erc20-vault.compact line 112 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(12n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'erc20-vault.compact line 112 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_5.toValue(12n),
                                                                                                     alignment: _descriptor_5.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[12];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_0.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  callContext: { currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() }
};
const _dummyContract = new Contract({
  callerSecretKey: (...args) => undefined
});
export const pureCircuits = {
  vaultResponseSchema: (...args_0) => {
    if (args_0.length !== 0) {
      throw new __compactRuntime.CompactError(`vaultResponseSchema: expected 0 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    return _dummyContract._vaultResponseSchema_0();
  },
  vaultTokenDomainSeparator: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`vaultTokenDomainSeparator: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const erc20Address_0 = args_0[0];
    if (!(erc20Address_0.buffer instanceof ArrayBuffer && erc20Address_0.BYTES_PER_ELEMENT === 1 && erc20Address_0.length === 20)) {
      __compactRuntime.typeError('vaultTokenDomainSeparator',
                                 'argument 1',
                                 'erc20-vault.compact line 162 char 1',
                                 'Bytes<20>',
                                 erc20Address_0)
    }
    return _dummyContract._vaultTokenDomainSeparator_0(erc20Address_0);
  },
  userCommitment: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`userCommitment: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('userCommitment',
                                 'argument 1',
                                 'erc20-vault.compact line 179 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._userCommitment_0(sk_0);
  },
  withdrawRefundCommitment: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`withdrawRefundCommitment: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    const requestId_0 = args_0[1];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('withdrawRefundCommitment',
                                 'argument 1',
                                 'erc20-vault.compact line 190 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    if (!(requestId_0.buffer instanceof ArrayBuffer && requestId_0.BYTES_PER_ELEMENT === 1 && requestId_0.length === 32)) {
      __compactRuntime.typeError('withdrawRefundCommitment',
                                 'argument 2',
                                 'erc20-vault.compact line 190 char 1',
                                 'Bytes<32>',
                                 requestId_0)
    }
    return _dummyContract._withdrawRefundCommitment_0(sk_0, requestId_0);
  }
};
export const contractReferenceLocations =
  {
   tag: 'publicLedgerArray',
   indices: {
     1: { 
         tag: 'cell',
         valueType: {
                     tag: 'compactValue',
                     descriptor: _descriptor_4,
                     sparseType: { tag: 'contractAddress' }
                    }
        }
   }
  };
export const expectedVk = {
  'approveRouter': '104c5b06f8729201fbbb26b53d97d14848c8f4b8f3d3850f86c02ef7c0eafd29',
  'claim': 'a6368dd449cdeb16b6f675403f2b55a4c0497ce6738853b1af62c54063b224f1',
  'completeSwap': 'fcba225cfe34cc829cf37b177584603240424c4c214b25f55c6156eef6032127',
  'completeWithdraw': 'bf98780cadb6212838dd0cdf580970499663a324004e8859398aa38476da2b9d',
  'deposit': 'a3c84a31dda2e50cf57080fad62ece7d0e12d0612850edd155cfa1c37bec5127',
  'initialize': '98ab78aa5f4a5bf086919a6fb2e188f608c0454e0b58c18d037681c00361fd88',
  'refund': '50fa0cc3e650b821709aa8304236554ef33a0420c38e5522973f78cd2873fb75',
  'swap': 'dfd2840be51d6ac90178c02b9acaaa51627e302555866d95375952217c533af4',
  'withdraw': '407431fd86046b681cfc592f48b22367e0f90327f07698e1e52f2a49a78b42fd',
};

//# sourceMappingURL=index.js.map
