import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import * as ecc from 'tiny-secp256k1-browserify/lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import { Button, Input, Space, Select, Message, Tabs, Typography } from '@arco-design/web-react';
import { useState } from 'react';
import { Buffer } from 'buffer-browser';
import * as Btc from 'bitcoinjs-lib';
import { ECPairFactory, ECPairAPI } from 'ecpair';
import GenerateBip32 from '@/componments/GenerateBip32';
import GenerateBip44 from '@/componments/GenerateBip44';
import GenerateBip49 from '@/componments/GenerateBip49';
import GenerateBip84 from '@/componments/GenerateBip84';
import GenerateBip141 from '@/componments/GenerateBip141';
import { getNetwork, getCoinType, networkType } from '@/assets/plugin';

const ECPair: ECPairAPI = ECPairFactory(ecc);
console.log('🚀 ~ file: Home.tsx:17 ~ ECPair:', ECPair);
const TextArea = Input.TextArea;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const bip32 = BIP32Factory(ecc);
console.log('🚀 ~ file: Home.tsx:22 ~ bip32:', bip32);
const style = {
  textAlign: 'center' as const,
  marginTop: 20
};
function uint8Array(uint8Array: Uint8Array) {
  return Array.prototype.map.call(uint8Array, (x) => ('00' + x.toString(16)).slice(-2)).join('');
}
const Home = () => {
  const [value, setValue] = useState(128);
  const [words, setWords] = useState('');
  const [seedHex, setSeedHex] = useState('');
  const [seedXprv, setSeedXprv] = useState('');
  const [type, setType] = useState(1);
  const [network, setNetwork] = useState<networkType>(Btc.networks.bitcoin);
  const [coinType, setCoinType] = useState(0);
  const [root, setRoot] = useState<null | BIP32Interface>(null);
  const bitcoinNetwork = [
    {
      value: 1,
      label: 'BTC - Bitcoin'
    },
    {
      value: 2,
      label: 'BTC - Bitcoin Testnet'
    },
    {
      value: 3,
      label: 'BTC - Bitcoin RegTest'
    }
  ];
  const options = [
    {
      value: 128,
      label: 12
    },
    {
      value: 160,
      label: 15
    },
    {
      value: 192,
      label: 18
    },
    {
      value: 224,
      label: 21
    },
    {
      value: 256,
      label: 24
    }
  ];
  const handleGenerateWords = (words: string, network: networkType) => {
    const seedUint8Aarray = bip39.mnemonicToSeedSync(words);
    const arrBuffer = Buffer.from(seedUint8Aarray) as any;
    const root = bip32.fromSeed(arrBuffer, network);
    console.log('🚀 ~ file: Home.tsx:77 ~ handleGenerateWords ~ root:', root);
    const rootPriateKey = root.toWIF();
    console.log('🚀 ~ file: Home.tsx:76 ~ handleGenerateWords ~ rootPriateKey:', rootPriateKey);
    setRoot(root);
    setSeedHex(uint8Array(seedUint8Aarray));
    setSeedXprv(root.toBase58());
  };
  const handleChange = (value: number) => {
    console.log('🚀 ~ file: Home.tsx:34 ~ handleChange ~ value:', value);
    setValue(value);
    const stringWords = bip39.generateMnemonic(wordlist, value);
    setWords(stringWords);
    handleGenerateWords(stringWords, network);
  };
  const handleGenerate = () => {
    const boo = bip39.validateMnemonic(words, wordlist);
    if (!boo) {
      Message.error({
        content: `The mnemonic words are not standardized`,
        showIcon: true
      });
    } else {
      handleGenerateWords(words, network);
    }
  };
  const handleTextArea = (val: string) => {
    setWords(val);
  };
  const handleTabsChange = (key: string) => {
    console.log('🚀 ~ file: Home.tsx:80 ~ handleTabsChange ~ key:', key);
  };
  const handleNetworkChange = (val: number) => {
    if (words) {
      const network = getNetwork(val);
      const coinType = getCoinType(val);
      setType(val);
      setNetwork(network);
      setCoinType(coinType);
      handleGenerateWords(words, network);
    }
  };
  return (
    <div className="w-full my-5">
      <Typography.Title style={style}>Bitcoin generate address</Typography.Title>
      <Space className="flex mb-2">
        <Typography.Text className="mb-2">Mnemonic:</Typography.Text>
        <Select placeholder="Please select" style={{ width: 154 }} value={value} onChange={handleChange}>
          {options.map(({ value, label }: { value: number; label: number }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Space>
      <Space className="flex mb-2">
        <Typography.Text className="mb-2">Network:</Typography.Text>
        <Select placeholder="Please select" style={{ width: 200 }} value={type} onChange={handleNetworkChange}>
          {bitcoinNetwork.map(({ value, label }: { value: number; label: string }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Space>
      <Space direction="vertical" className="flex mb-2">
        <Typography.Text style={style}>Mnemonic Words</Typography.Text>
        <TextArea
          placeholder="Please enter Mnemonic Words"
          style={{ minHeight: 64, width: '100%', flex: 1 }}
          value={words}
          allowClear
          onChange={(value: string) => handleTextArea(value)}
        />
      </Space>
      <Space className="flex mb-2">
        <Button type="primary" onClick={handleGenerate}>
          Generate
        </Button>
      </Space>
      <Space className="flex mb-2">
        <Typography.Text>BIP39 Seed:</Typography.Text>
        <Typography.Text>{seedHex}</Typography.Text>
      </Space>
      <Space className="flex mb-2">
        <Typography.Text>BIP32 Root Key:</Typography.Text>
        <Typography.Text>{seedXprv}</Typography.Text>
      </Space>
      <Tabs key="card" tabPosition="top" onChange={handleTabsChange}>
        <TabPane key="1" title="BIP32">
          {root ? <GenerateBip32 root={root} network={network}></GenerateBip32> : ''}
        </TabPane>
        <TabPane key="2" title="BIP44">
          {root ? <GenerateBip44 root={root} network={network} coinType={coinType}></GenerateBip44> : ''}
        </TabPane>
        <TabPane key="3" title="BIP49">
          {root ? <GenerateBip49 root={root} network={network} coinType={coinType}></GenerateBip49> : ''}
        </TabPane>
        <TabPane key="4" title="BIP84">
          {root ? <GenerateBip84 root={root} network={network} coinType={coinType}></GenerateBip84> : ''}
        </TabPane>
        <TabPane key="5" title="BIP141">
          {root ? <GenerateBip141 root={root} network={network}></GenerateBip141> : ''}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Home;
