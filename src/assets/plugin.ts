import * as Btc from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1-browserify/lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import { ECPairFactory, ECPairAPI } from 'ecpair';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { Buffer } from 'buffer-browser';
import bs58 from 'bs58check';

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
export type versionBytesType = { xpub: string; xprv: string };
export function address() {
  // Account Extended Public Key
  const ypub1 =
    'ypub6YJi2DgcQRoQU9f1ZBiDpyF53tnGVcDzcTyRZyz7XpbPHTpqftGgS14jKgKNJvV9wiGjYDExsVsgf3f3ajAHQRSm5nFoTHD3o7WcpYUhmcm';
  const network = Btc.networks.bitcoin;

  let data = bs58.decode(ypub1);
  data = data.slice(4);
  data = Buffer.concat([Buffer.from('0488b21e', 'hex'), data]);
  const xpub1 = bs58.encode(data);
  console.log('🚀 ~ file: Home.tsx:66 ~ xpub1:', xpub1);
  console.log(bip32.fromBase58(xpub1, network));
  const p2wpkh = Btc.payments.p2wpkh({
    pubkey: bip32.fromBase58(xpub1, network).derive(0).derive(0).publicKey,
    network
  });
  const payment = Btc.payments.p2sh({ redeem: p2wpkh, network });

  const addressString = payment.address;
  console.log(`the addressString is ${addressString}`);
}
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
export function toUint8Array(hex: string) {
  const typedArray = new Uint8Array(
    hex.match(/[\da-f]{2}/gi)!.map(function (h) {
      return parseInt(h, 16);
    })
  );
  const buffer = typedArray;
  return buffer;
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
export function getExtendedPrivateKey(masterNode: BIP32Interface, path: string) {
  console.log('🚀 ~ file: plugin.ts:56 ~ getExtendedPrivateKey ~ path:', path);
  const account = masterNode.derivePath(path);
  console.log('🚀 ~ file: plugin.ts:67 ~ getExtendedPrivateKey ~ account:', account);
  const xpub = account.neutered().toBase58();
  console.log('🚀 ~ file: plugin.ts:58 ~ getExtendedKey ~ xpub:', xpub);
  return xpub;
}
// https://electrum.readthedocs.io/en/latest/xpub_version_bytes.html
export function getVersionBytes(networkType = 1, bipType = 2) {
  let versionBytes = { xpub: '0488b21e', xprv: '0488ade4' };
  if (networkType !== 1) {
    switch (bipType) {
      case 2:
        versionBytes = { xpub: '043587cf', xprv: '04358394' };
        break;
      case 3:
        versionBytes = { xpub: '044a5262', xprv: '044a4e28' };
        break;
      case 4:
        versionBytes = { xpub: '045f1cf6', xprv: '045f18bc' };
        break;
      default:
        versionBytes = { xpub: '0488b21e', xprv: '0488ade4' };
        break;
    }
  } else {
    switch (bipType) {
      case 2:
        versionBytes = { xpub: '0488b21e', xprv: '0488ade4' };
        break;
      case 3:
        versionBytes = { xpub: '049d7cb2', xprv: '049d7878' };
        break;
      case 4:
        versionBytes = { xpub: '04b24746', xprv: '04b2430c' };
        break;
      default:
        versionBytes = { xpub: '0488b21e', xprv: '0488ade4' };
        break;
    }
  }
  return versionBytes;
}
export function getPubPrv(xpub: string, versionBytes: string) {
  console.log('🚀 ~ file: plugin.ts:122 ~ getPubPrv ~ versionBytes:', versionBytes);
  console.log('🚀 ~ file: plugin.ts:122 ~ getPubPrv ~ xpub:', xpub);
  const versionPub = bs58.decode(xpub);
  const decodePub = Buffer.concat([Buffer.from(versionBytes, 'hex'), versionPub.slice(4)]);
  const resultPub = bs58.encode(decodePub);
  console.log('🚀 ~ file: plugin.ts:127 ~ getPubPrv ~ resultPub:', resultPub);
  return resultPub;
}
export function getExtendedKey(masterNode: BIP32Interface, path: string, versionBytes: versionBytesType) {
  const account = masterNode.derivePath(path);
  const xprv = account.toBase58();
  const xpub = account.neutered().toBase58();
  /* const xpub =
    'xpub6C9cpFM4j5ETyzTf2GkBdiJBw4SCGNZZEBz6YmNu8PF6qCi8z5D9k33bnJWcpNpq6n3P66bFZArxM75qwVLbQRJ3h7EP3PrtAPGfyXtsE2G';
  const bin_xpub: Uint8Array = bs58.decode(xpub);
  console.log('🚀 ~ file: Home.tsx:30 ~ bin_xpub:', bin_xpub);
  const sixth = uint8Array(bin_xpub);
  console.log('🚀 ~ file: Home.tsx:33 ~ sixth:', sixth);
  const silce = sixth.slice(8);
  console.log('🚀 ~ file: Home.tsx:35 ~ silce:', `0488b21e${silce}`);
  const str = toUint8Array(`049d7cb2${silce}`);
  console.log('🚀 ~ file: Home.tsx:38 ~ str:', str);
  const ypub = bs58.encode(Buffer.from(str));
  console.log('🚀 ~ file: Home.tsx:34 ~ ypub:', ypub.length, ypub); */
  console.log('🚀 ~ file: plugin.ts:146 ~ getExtendedKey ~ versionBytes:', versionBytes);
  const resultPub = getPubPrv(xpub, versionBytes.xpub);
  const resultPrv = getPubPrv(xprv, versionBytes.xprv);
  return { resultPub, resultPrv };
}
export function getPrivateKey(masterNode: BIP32Interface, network: Btc.networks.Network) {
  const privateKey = ECPair.fromPrivateKey(masterNode.privateKey!, { network });
  return privateKey.toWIF();
}
export function getPublicKey(masterNode: BIP32Interface, network: Btc.networks.Network) {
  // console.log('🚀 ~ file: plugin.ts:60 ~ getPublicKey ~ network:', network);
  const publicKey = ECPair.fromPublicKey(masterNode.publicKey!, { network });
  return publicKey.publicKey.toString('hex');
}
export function getBip32Address(masterNode: BIP32Interface, networks: Btc.networks.Network) {
  // console.log('🚀 ~ file: GenerateBip32.tsx:16 ~ getAddress ~ networks:', networks);
  return Btc.payments.p2pkh({ pubkey: masterNode.publicKey, network: networks }).address;
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
export function getBip44Address(masterNode: BIP32Interface, network: Btc.networks.Network) {
  //  1 开头的地址，采用 P2PKH ，P2PKH(Pay-to-Pubkey Hash)，支付公钥哈希，即比特币交易输入输出脚本，采用公钥及公钥哈希。 1 开头的传统地址，上线至今，一直被支持，我们可以从它发送 BTC 到下面介绍的多签地址和隔离见证地址。
  const keyhash = Btc.crypto.hash160(masterNode.publicKey);
  console.log('🚀 ~ file: GenerateData.tsx:23 ~ getAddress ~ keyhash:', keyhash);
  /*  const scriptSig = Btc.script.witnessPubKeyHash.output.encode(keyhash);
  const addressBytes = Btc.crypto.hash160(scriptSig);
  const outputScript = Btc.script.scriptHash.output.encode(addressBytes);
  const address = Btc.address.fromOutputScript(outputScript); */
  return Btc.payments.p2pkh({ pubkey: masterNode.publicKey, network }).address; // p2pkh = 44
}
export function getBip49Address(masterNode: BIP32Interface, network: Btc.networks.Network) {
  /* 多钱地址 3开头的地址，比如 3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX。2012年的比特币改进提案中，新增 P2SH 的地址。
P2SH (Pay-to-Script-Hash)，支付脚本哈希，即比特币交易输入输出脚本，采用赎回脚本及赎回脚本哈希。其地址结构类似于 P2PKH，但它支持比传统地址更复杂的功能。P2SH 脚本函数最常用于 multisig 地址，这些地址可以指定多重数字签名来授权事务。举个例子：某个3开头的地址由三人控制，其中，任意两人同意，便可发起转账。 */
  // const keyhash = Btc.crypto.hash160(masterNode.publicKey);
  //  console.log('🚀 ~ file: GenerateData.tsx:23 ~ getAddress ~ keyhash:', keyhash);
  /* const scriptSig = Btc.script.witnessPubKeyHash.output.encode(keyhash);
  const addressBytes = Btc.crypto.hash160(scriptSig);
  const outputScript = Btc.script.scriptHash.output.encode(addressBytes);
  const address = Btc.address.fromOutputScript(outputScript); */
  return Btc.payments.p2sh({
    redeem: Btc.payments.p2wpkh({
      pubkey: masterNode.publicKey,
      network
    }),
    network
  }).address; // p2sh = 49 以bc开头的地址
}
export function fromCharCode(hex: string) {
  const trimedStr = hex.trim();
  let hexFront = '';
  let hexEnd = '';
  const rawStr = trimedStr.substring(0, 2).toLowerCase() === '0x' ? trimedStr.substring(2) : trimedStr;
  let text = rawStr;
  if (rawStr.length > 130) {
    hexFront = rawStr.substring(0, 128);
    const textLength = hexFront.substring(64);
    const len = parseInt(textLength, 16) * 2;
    hexEnd = trimedStr.substring(130);
    text = hexEnd.substring(0, len);
  } else {
    const arrStr = [];
    for (let i = 0; i < rawStr.length; i += 2) {
      const item = rawStr.substring(i, i + 2);
      if (item !== '00') {
        arrStr.push(item);
      }
    }
    console.log(arrStr);
    text = arrStr.join('');
  }
  const len = text.length;
  if (len % 2 !== 0) {
    return '';
  }
  let curCharCode;
  const resultStr = [];
  for (let i = 0; i < len; i += 2) {
    curCharCode = parseInt(text.substring(i, i + 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  console.log(resultStr.join(''), resultStr.join('').length);
  return resultStr.join('').trim();
}
export function getBip84Address(masterNode: BIP32Interface, network: Btc.networks.Network) {
  // bc1 开头的地址，是由新的隔离见证脚本生成的地址（P2WPKH 或 P2WSH），是纯正的隔离见证地址。它采用 Bech32 编码，其风格和 P2PKH 和 P2SH（即 1开头和 3开头）风格的地址完全不同。 由于使用 bc1 前缀，它比上面两种地址要长，由42个符号组成
  return Btc.payments.p2wpkh({ pubkey: masterNode.publicKey, network }).address; // p2wpkh = 84 以bc开头的地址
}

/* function getAddress(masterNode: BIP32Interface) {
  // 多钱地址 3开头的地址，比如 3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX。2012年的比特币改进提案中，新增 P2SH 的地址。P2SH (Pay-to-Script-Hash)，支付脚本哈希，即比特币交易输入输出脚本，采用赎回脚本及赎回脚本哈希。其地址结构类似于 P2PKH，但它支持比传统地址更复杂的功能。P2SH 脚本函数最常用于 multisig 地址，这些地址可以指定多重数字签名来授权事务。举个例子：某个3开头的地址由三人控制，其中，任意两人同意，便可发起转账。
  const keyhash = Btc.crypto.hash160(masterNode.publicKey);
  console.log('🚀 ~ file: GenerateData.tsx:23 ~ getAddress ~ keyhash:', keyhash);
  return Btc.payments.p2sh({
    redeem: Btc.payments.p2wpkh({
      pubkey: masterNode.publicKey
    })
  }).address; // p2sh = 49 以bc开头的地址
}
 */
