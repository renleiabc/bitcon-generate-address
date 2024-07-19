import { BIP32Type, generateType, getBip86Address, getPrivateKey, getPublicKey, networkType } from '@/assets/plugin';
import { Table } from '@arco-design/web-react';
import { useCallback, useEffect, useState } from 'react';
//  bc1p address
const purpose = 86;
const arrNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const GenerateData49 = ({ root, network, coinType }: { root: BIP32Type; network: networkType; coinType: number }) => {
  const [bitcoinData, setBitcoinData] = useState<generateType[]>([]);
  const handleGenerate = useCallback(() => {
    if (root) {
      const arr = arrNum.map((num: number) => {
        const path = `m/${purpose}'/${coinType}'/0'/0/${num}`;
        const child = root.derivePath(path);
        const item: generateType = {
          key: `${num + 1}`,
          path,
          address: getBip86Address(child, network)!,
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
  return <Table columns={columns} data={bitcoinData} />;
};

export default GenerateData49;
