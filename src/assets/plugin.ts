import * as Btc from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1-browserify/lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import { ECPairFactory, ECPairAPI } from 'ecpair';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { Buffer } from 'buffer-browser';

const ECPair: ECPairAPI = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
export type generateType = {
  key: string;
  path: string;
  address: string;
  publicKey: string;
  privateKey: string;
};
export type networkType = Btc.networks.Network;
export type BIP32Type = BIP32Interface;

/**
 * @name: handle
 * @Date: 2024-01-31 17:20:50
 * @description:
 * @param {*} value 128 |  160  | 192 | 224 | 256
 * @return {*}
 */
export function generateMnemonic(value = 128) {
  const stringWords = bip39.generateMnemonic(wordlist, value);
  return stringWords;
}
export function uint8Array(uint8Array: Uint8Array) {
  return Array.prototype.map.call(uint8Array, (x) => ('00' + x.toString(16)).slice(-2)).join('');
}
export const generateRoot = (words: string, network: networkType) => {
  const seedUint8Aarray = bip39.mnemonicToSeedSync(words);
  const arrBuffer = Buffer.from(seedUint8Aarray) as any;
  const root = bip32.fromSeed(arrBuffer, network);
  const rootPriateKey = root.toWIF();
  console.log('🚀 ~ file: Home.tsx:76 ~ handleGenerateWords ~ rootPriateKey:', rootPriateKey);
  const seed = uint8Array(seedUint8Aarray);
  return { root, seed };
};
export function validateMnemonic(words: string) {
  return bip39.validateMnemonic(words, wordlist);
}
/* export function getPrivateKey(node: BIP32Interface) {
  console.log('🚀 ~ file: plugin.ts:5 ~ getPrivateKey ~ node:', node);
  return node.toWIF();
}
export function getPublicKey(node: BIP32Interface) {
  // console.log('🚀 ~ file: GenerateData.tsx:5 ~ getAddress ~ node:', node.publicKey?.toString('hex'));
  return node.publicKey?.toString('hex');
} */
export function getPrivateKey(node: BIP32Interface, network: Btc.networks.Network) {
  const privateKey = ECPair.fromPrivateKey(node.privateKey!, { network });
  return privateKey.toWIF();
}
export function getPublicKey(node: BIP32Interface, network: Btc.networks.Network) {
  const publicKey = ECPair.fromPublicKey(node.publicKey!, { network });
  return publicKey.publicKey.toString('hex');
}
export function getBip32Address(node: BIP32Interface, networks: Btc.networks.Network) {
  // console.log('🚀 ~ file: GenerateBip32.tsx:16 ~ getAddress ~ networks:', networks);
  return Btc.payments.p2pkh({ pubkey: node.publicKey, network: networks }).address;
}
export function getNetwork(val: number) {
  let networks = Btc.networks.bitcoin;
  switch (val) {
    case 1:
      networks = Btc.networks.bitcoin;
      break;
    case 2:
      networks = Btc.networks.testnet;
      break;
    case 3:
      networks = Btc.networks.regtest;
      break;
    default:
      networks = Btc.networks.bitcoin;
      break;
  }
  return networks;
}
export function getCoinType(val: number) {
  let coin_type = 0;
  switch (val) {
    case 1:
      coin_type = 0;
      break;
    case 2 || 3:
      coin_type = 1;
      break;
    default:
      coin_type = 0;
      break;
  }
  return coin_type;
}
export function getBip44Address(node: BIP32Interface, network: Btc.networks.Network) {
  /* https://www.blockvalue.com/blockchain/20191228142231.html */
  //  1 开头的地址，采用 P2PKH ，P2PKH(Pay-to-Pubkey Hash)，支付公钥哈希，即比特币交易输入输出脚本，采用公钥及公钥哈希。 1 开头的传统地址，上线至今，一直被支持，我们可以从它发送 BTC 到下面介绍的多签地址和隔离见证地址。
  const keyhash = Btc.crypto.hash160(node.publicKey);
  console.log('🚀 ~ file: GenerateData.tsx:23 ~ getAddress ~ keyhash:', keyhash);
  /*  const scriptSig = Btc.script.witnessPubKeyHash.output.encode(keyhash);
  const addressBytes = Btc.crypto.hash160(scriptSig);
  const outputScript = Btc.script.scriptHash.output.encode(addressBytes);
  const address = Btc.address.fromOutputScript(outputScript); */
  return Btc.payments.p2pkh({ pubkey: node.publicKey, network }).address; // p2pkh = 44
}
export function getBip49Address(node: BIP32Interface, network: Btc.networks.Network) {
  // https://github.com/peli-pro/coldcard_address_generator/blob/master/coldcard_address_generator_node.js
  /* https://www.blockvalue.com/blockchain/20191228142231.html */
  /* 多钱地址 3开头的地址，比如 3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX。2012年的比特币改进提案中，新增 P2SH 的地址。
P2SH (Pay-to-Script-Hash)，支付脚本哈希，即比特币交易输入输出脚本，采用赎回脚本及赎回脚本哈希。其地址结构类似于 P2PKH，但它支持比传统地址更复杂的功能。P2SH 脚本函数最常用于 multisig 地址，这些地址可以指定多重数字签名来授权事务。举个例子：某个3开头的地址由三人控制，其中，任意两人同意，便可发起转账。 */
  const keyhash = Btc.crypto.hash160(node.publicKey);
  console.log('🚀 ~ file: GenerateData.tsx:23 ~ getAddress ~ keyhash:', keyhash);
  /* const scriptSig = Btc.script.witnessPubKeyHash.output.encode(keyhash);
  const addressBytes = Btc.crypto.hash160(scriptSig);
  const outputScript = Btc.script.scriptHash.output.encode(addressBytes);
  const address = Btc.address.fromOutputScript(outputScript); */
  return Btc.payments.p2sh({
    redeem: Btc.payments.p2wpkh({
      pubkey: node.publicKey,
      network
    }),
    network
  }).address; // p2sh = 49 以bc开头的地址
}
export function getBip84Address(node: BIP32Interface, network: Btc.networks.Network) {
  /* https://www.blockvalue.com/blockchain/20191228142231.html */
  // bc1 开头的地址，是由新的隔离见证脚本生成的地址（P2WPKH 或 P2WSH），是纯正的隔离见证地址。它采用 Bech32 编码，其风格和 P2PKH 和 P2SH（即 1开头和 3开头）风格的地址完全不同。 由于使用 bc1 前缀，它比上面两种地址要长，由42个符号组成
  return Btc.payments.p2wpkh({ pubkey: node.publicKey, network }).address; // p2wpkh = 84 以bc开头的地址
}

/* function getAddress(node: BIP32Interface) {
  /// https://www.blockvalue.com/blockchain/20191228142231.html
  // 多钱地址 3开头的地址，比如 3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX。2012年的比特币改进提案中，新增 P2SH 的地址。P2SH (Pay-to-Script-Hash)，支付脚本哈希，即比特币交易输入输出脚本，采用赎回脚本及赎回脚本哈希。其地址结构类似于 P2PKH，但它支持比传统地址更复杂的功能。P2SH 脚本函数最常用于 multisig 地址，这些地址可以指定多重数字签名来授权事务。举个例子：某个3开头的地址由三人控制，其中，任意两人同意，便可发起转账。
  const keyhash = Btc.crypto.hash160(node.publicKey);
  console.log('🚀 ~ file: GenerateData.tsx:23 ~ getAddress ~ keyhash:', keyhash);
  return Btc.payments.p2sh({
    redeem: Btc.payments.p2wpkh({
      pubkey: node.publicKey
    })
  }).address; // p2sh = 49 以bc开头的地址
}
 */
