import { useState, useEffect, useCallback } from 'react';
import { Table } from '@arco-design/web-react';
import { generateType, BIP32Type, networkType, getBip49Address, getPublicKey, getPrivateKey } from '@/assets/plugin';

const arrNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const GenerateData = ({ root, network }: { root: BIP32Type; network: networkType }) => {
  const [bitcoinData, setBitcoinData] = useState<generateType[]>([]);
  const handleGenerate = useCallback(() => {
    const arr = arrNum.map((num: number) => {
      const path = `m/0/${num}`;
      const child = root.derivePath(path);
      const item: generateType = {
        key: `${num + 1}`,
        path,
        address: getBip49Address(child, network)!,
        publicKey: getPublicKey(child, network)!,
        privateKey: getPrivateKey(child, network)!
      };
      return item;
    });
    setBitcoinData(arr);
  }, [network, root]);
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);
  const columns = [
    {
      title: 'Index',
      dataIndex: 'key'
    },
    {
      title: 'Path',
      dataIndex: 'path'
    },
    {
      title: 'Address',
      dataIndex: 'address'
    },
    {
      title: 'Public Key',
      dataIndex: 'publicKey'
    },
    {
      title: 'Private Key',
      dataIndex: 'privateKey'
    }
  ];
  return <Table columns={columns} data={bitcoinData} />;
};

export default GenerateData;
