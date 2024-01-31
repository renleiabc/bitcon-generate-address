import { useState, useEffect, useCallback } from 'react';
import { Table } from '@arco-design/web-react';
import { generateType, BIP32Type, getBip32Address, getPublicKey, getPrivateKey, networkType } from '@/assets/plugin';

const arrNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const GenerateData = ({ root, network }: { root: BIP32Type; network: networkType }) => {
  console.log('🚀 ~ file: GenerateBip32.tsx:45 ~ GenerateData ~ network:', network);
  console.log('🚀 ~ file: GenerateData.tsx:9 ~ GenerateData ~ root:', root.toWIF());
  const [bitcoinData, setBitcoinData] = useState<generateType[]>([]);
  const handleGenerate = useCallback(() => {
    const arr = arrNum.map((num: number) => {
      // 通过这种分层（树状结构）推导出来的秘钥，通常用路径来表示，每个级别之间用斜杠 / 来表示，由主私钥衍生出的私钥起始以“m”打头。因此，第一个母密钥生成的子私钥是m/0。第一个公共钥匙是M/0。第一个子密钥的子密钥就是m/0/1，以此类推
      const path = `m/0/${num}`;
      const child = root.derivePath(path);
      const item: generateType = {
        key: `${num + 1}`,
        path,
        address: getBip32Address(child, network)!,
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
