import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1-browserify/lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import { ECPairFactory, ECPairAPI } from 'ecpair';
import * as Btc from 'bitcoinjs-lib';
import { Space } from '@arco-design/web-react';
import { networks, script, opcodes, payments, Psbt } from 'bitcoinjs-lib';

const network = networks.testnet;
console.log('🚀 ~ file: GenerateEcpair.tsx:10 ~ network:', network);
const locking_script = script.compile([opcodes.OP_ADD, script.number.encode(5), opcodes.OP_EQUAL]);
const p2wsh = payments.p2wsh({ redeem: { output: locking_script, network }, network });
console.log(p2wsh.address);
function getAddress(node: BIP32Interface) {
  return Btc.payments.p2pkh({ pubkey: node.publicKey }).address;
}
const GenerateData = () => {
  const bip32 = BIP32Factory(ecc);
  const words = 'digital gauge mixture party federal slot hip language large sail erode priority';
  const seedUint8Aarray = bip39.mnemonicToSeedSync(words);
  const root = bip32.fromSeed(seedUint8Aarray);
  const ECPair: ECPairAPI = ECPairFactory(ecc);
  console.log('🚀 ~ file: GenerateData.tsx:9 ~ GenerateData ~ root:', root.toWIF());
  const child1 = root.derivePath("m/44'/0'/0'/0/0");
  const publicKey = child1.publicKey.toString('hex');
  console.log('🚀 ~ file: GenerateData1.tsx:15 ~ GenerateData ~ publicKey:', publicKey);
  const pri = ECPair.fromPrivateKey(child1.privateKey!, { network });
  const privateKey = pri.toWIF();
  console.log('🚀 ~ file: GenerateData1.tsx:18 ~ GenerateData ~ privateKey:', privateKey);
  const pub = ECPair.fromPublicKey(child1.publicKey!, { network });
  console.log('🚀 ~ file: GenerateData.tsx:25 ~ GenerateData ~ pub:', pub.publicKey.toString('hex'));
  const address = getAddress(child1);
  console.log('🚀 ~ file: GenerateData1.tsx:25 ~ GenerateData ~ address:', address);
  return (
    <div>
      <Space className="flex mb-2">
        <div>privateKey:{privateKey}</div>
      </Space>
      <Space className="flex mb-2">
        <div>publicKey:{publicKey}</div>
      </Space>
      <Space className="flex mb-2">
        <div>address:{address}</div>
      </Space>
    </div>
  );
};
export default GenerateData;
