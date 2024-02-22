import { useState, useEffect, useCallback } from 'react';
import { Table } from '@arco-design/web-react';
import { generateType, BIP32Type, networkType, getBip84Address, getPublicKey, getPrivateKey } from '@/assets/plugin';

const purpose = 84;
const arrNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const GenerateData = ({ root, network, coinType }: { root: BIP32Type; network: networkType; coinType: number }) => {
  const [bitcoinData, setBitcoinData] = useState<generateType[]>([]);
  const handleGenerate = useCallback(() => {
    if (root) {
      const arr = arrNum.map((num: number) => {
        const path = `m/${purpose}'/${coinType}'/0'/0/${num}`;
        const child = root.derivePath(path);
        const item: generateType = {
          key: `${num + 1}`,
          path,
          address: getBip84Address(child, network)!,
          publicKey: getPublicKey(child, network)!,
          privateKey: getPrivateKey(child, network)!
        };
        return item;
      });
      setBitcoinData(arr);
    }
  }, [coinType, network, root]);
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
  return <Table columns={columns} data={bitcoinData} noDataElement="没有数据" />;
};

export default GenerateData;
