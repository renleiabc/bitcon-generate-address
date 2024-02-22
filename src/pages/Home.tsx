import { Button, Input, Space, Select, Message, Tabs, Typography } from '@arco-design/web-react';
import { useState } from 'react';
import GenerateBip32 from '@/componments/GenerateBip32';
import GenerateBip44 from '@/componments/GenerateBip44';
import GenerateBip49 from '@/componments/GenerateBip49';
import GenerateBip84 from '@/componments/GenerateBip84';
import GenerateBip141 from '@/componments/GenerateBip141';
// import * as xpubLib from '@swan-bitcoin/resultPub-lib';
import {
  getExtendedKey,
  getNetwork,
  getCoinType,
  networkType,
  generateRoot,
  generateMnemonic,
  validateMnemonic,
  uint8Array,
  toUint8Array,
  getPubPrv,
  getVersionBytes
} from '@/assets/plugin';
import { BIP32Interface } from 'bip32';
import bs58 from 'bs58check';
console.log('🚀 ~ file: Home.tsx:27 ~ bs58:', bs58);

const TextArea = Input.TextArea;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const xpub =
  'xpub69YEYMZpStccnvvNhzX6EyWEQ8LNkD7j1kZ1GdyyjF91kQ7E9T6FjgT1qJaKEWgk7s3izgnTmoXnGwQHbmUWkL5EC5B3ATgtvJ1sLTCS4ZM';
const bin_xpub: Uint8Array = bs58.decode(xpub);
console.log('🚀 ~ file: Home.tsx:30 ~ bin_xpub:', bin_xpub);
const sixth = uint8Array(bin_xpub);
console.log('🚀 ~ file: Home.tsx:33 ~ sixth:', sixth);
const silce = sixth.slice(8);
const str = toUint8Array(`049d7cb2${silce}`);
console.log('🚀 ~ file: Home.tsx:38 ~ str:', str);
const ypub = bs58.encode(str);
console.log('🚀 ~ file: Home.tsx:34 ~ ypub:', ypub.length, ypub);
const style = {
  textAlign: 'center' as const,
  marginTop: 20
};
const arrKey = ['2', '3', '4'];
const Home = () => {
  const [value, setValue] = useState(128);
  const [words, setWords] = useState('');
  const [seedHex, setSeedHex] = useState('');
  const [seedXprv, setSeedXprv] = useState('');
  const [type, setType] = useState(1);
  const [network, setNetwork] = useState<networkType>(getNetwork(1));
  const [coinType, setCoinType] = useState(0);
  const [firstPath, setFirstPath] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const [pathAccount, setPathAccount] = useState('');
  const [pairAccount, setPairAccount] = useState({ resultPub: '', resultPrv: '' });
  const [pariChild, setPariChild] = useState({ resultPub: '', resultPrv: '' });
  const [isAccount, setIsAccount] = useState(false);
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
    const { root, seed } = generateRoot(words, network);
    console.log('🚀 ~ file: Home.tsx:73 ~ handleGenerateWords ~ root:', root);
    setRoot(root);
    setSeedHex(seed);
    setSeedXprv(root.toBase58());
    const versionBytes = getVersionBytes(type, 2);
    setPariChild(getExtendedKey(root!, `m/0`, versionBytes));
  };
  const handleMnemonicChange = (value: number) => {
    setValue(value);
    const stringWords = generateMnemonic(value);
    setWords(stringWords);
    handleGenerateWords(stringWords, network);
    setActiveTab('1');
    setFirstPath('m/0');
  };
  const handleGenerate = () => {
    const boo = validateMnemonic(words);
    if (!boo) {
      Message.error({
        content: `The mnemonic words are not standardized`,
        showIcon: true
      });
    } else {
      handleGenerateWords(words, network);
      setActiveTab('1');
      setFirstPath('m/0');
    }
  };
  const handleTextArea = (val: string) => {
    setWords(val);
  };
  const handleTabsChange = (key: string) => {
    setActiveTab(key);
    setIsAccount(arrKey.some((item) => item === key));
    if (root) {
      console.log('🚀 ~ file: Home.tsx:114 ~ handleTabsChange ~ key:', key);
      console.log('🚀 ~ file: Home.tsx:80 ~ handleTabsChange ~ key:', typeof key);
      const coinType = getCoinType(type);
      let versionBytes = getVersionBytes(type, 2);
      switch (key) {
        case '1':
          setFirstPath(`m/0`);
          versionBytes = getVersionBytes(type, 2);
          setPariChild(getExtendedKey(root!, `m/0`, versionBytes));
          setSeedXprv(getPubPrv(root!.toBase58(), versionBytes.xprv));
          break;
        case '2':
          setPathAccount(`m/44'/${coinType}'/0'`);
          setFirstPath(`m/44'/${coinType}'/0'/0`);
          versionBytes = getVersionBytes(type, 2);
          setPairAccount(getExtendedKey(root!, `m/44'/${coinType}'/0'`, versionBytes));
          setPariChild(getExtendedKey(root!, `m/44'/${coinType}'/0'/0`, versionBytes));
          setSeedXprv(getPubPrv(root!.toBase58(), versionBytes.xprv));
          break;
        case '3':
          setPathAccount(`m/49'/${coinType}'/0'`);
          setFirstPath(`m/49'/${coinType}'/0'/0`);
          versionBytes = getVersionBytes(type, 3);
          setPairAccount(getExtendedKey(root!, `m/49'/${coinType}'/0'`, versionBytes));
          setPariChild(getExtendedKey(root!, `m/49'/${coinType}'/0'/0`, versionBytes));
          setSeedXprv(getPubPrv(root!.toBase58(), versionBytes.xprv));
          break;
        case '4':
          setPathAccount(`m/84'/${coinType}'/0'`);
          setFirstPath(`m/84'/${coinType}'/0'/0`);
          versionBytes = getVersionBytes(type, 4);
          setPairAccount(getExtendedKey(root!, `m/84'/${coinType}'/0'`, versionBytes));
          setPariChild(getExtendedKey(root!, `m/84'/${coinType}'/0'/0`, versionBytes));
          setSeedXprv(getPubPrv(root!.toBase58(), versionBytes.xprv));
          break;
        case '5':
          setFirstPath(`m/0`);
          versionBytes = getVersionBytes(type, 3);
          setPariChild(getExtendedKey(root!, `m/0`, versionBytes));
          setSeedXprv(getPubPrv(root!.toBase58(), versionBytes.xprv));
          break;
        default:
          break;
      }
    }
  };
  const handleNetworkChange = (val: number) => {
    if (words) {
      const network = getNetwork(val);
      const coinType = getCoinType(val);
      setType(val);
      setNetwork(network);
      setCoinType(coinType);
      handleGenerateWords(words, network);
      setActiveTab('1');
      setFirstPath('m/0/0');
      setFirstPath(`m/0`);
      const versionBytes = getVersionBytes(type, 2);
      setPariChild(getExtendedKey(root!, `m/0`, versionBytes));
    }
  };
  return (
    <div className="w-full my-5">
      <Typography.Title style={style}>Bitcoin generate address</Typography.Title>
      <Space className="flex mb-2">
        <Typography.Text className="mb-2">Mnemonic:</Typography.Text>
        <Select placeholder="Please select" style={{ width: 154 }} value={value} onChange={handleMnemonicChange}>
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
      {isAccount && (
        <>
          <Space className="flex mb-2">
            <Typography.Text type="warning">
              The account extended keys can be used for importing to most BIP44 compatible wallets, such as mycelium or
              electrum.
            </Typography.Text>
          </Space>
          <Space className="flex mb-2">
            <Typography.Text>Account Derivation Path:</Typography.Text>
            <Typography.Text>{pathAccount}</Typography.Text>
          </Space>
          <Space className="flex mb-2">
            <Typography.Text>Account Extended Private Key:</Typography.Text>
            <Typography.Text>{pairAccount.resultPrv}</Typography.Text>
          </Space>
          <Space className="flex mb-2">
            <Typography.Text>Account Extended Public Key:</Typography.Text>
            <Typography.Text>{pairAccount.resultPub}</Typography.Text>
          </Space>
          <Space className="flex mb-2">
            <Typography.Text type="warning">
              The BIP32 derivation path and extended keys are the basis for the derived addresses.
            </Typography.Text>
          </Space>
        </>
      )}
      <Space className="flex mb-2">
        <Typography.Text>BIP32 Derivation Path:</Typography.Text>
        <Typography.Text>{firstPath}</Typography.Text>
      </Space>
      <Space className="flex mb-2">
        <Typography.Text>BIP32 Extended Public Key:</Typography.Text>
        <Typography.Text>{pariChild.resultPrv}</Typography.Text>
      </Space>
      <Space className="flex mb-2">
        <Typography.Text>BIP32 Extended Public Key:</Typography.Text>
        <Typography.Text>{pariChild.resultPub}</Typography.Text>
      </Space>
      <Tabs key="card" activeTab={activeTab} tabPosition="top" onChange={handleTabsChange}>
        <TabPane key="1" title="BIP32">
          {<GenerateBip32 root={root!} network={network}></GenerateBip32>}
        </TabPane>
        <TabPane key="2" title="BIP44">
          {Number(activeTab) === 2 ? (
            <GenerateBip44 root={root!} network={network} coinType={coinType}></GenerateBip44>
          ) : (
            ''
          )}
        </TabPane>
        <TabPane key="3" title="BIP49">
          {<GenerateBip49 root={root!} network={network} coinType={coinType}></GenerateBip49>}
        </TabPane>
        <TabPane key="4" title="BIP84">
          {<GenerateBip84 root={root!} network={network} coinType={coinType}></GenerateBip84>}
        </TabPane>
        <TabPane key="5" title="BIP141">
          {<GenerateBip141 root={root!} network={network}></GenerateBip141>}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Home;
