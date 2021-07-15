import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Store from '../../stores/store';
import { GET_BALANCES_RETURNED } from '../../constants/constants';

const { store, dispatcher, emitter } = Store;

const NftSelector = ({ onChange, pool }) => {
  const [nftsIds, setNftsIds] = useState([-2]);
  const [selectedId, setSelectedId] = useState(-2);

  const getNFTs = async () => {
    var nftIdsResult = [-1];
    try {
      let walletNftQty = await store.walletNftQty(pool.token.stakeNFT);

      for (var i = 0; i < walletNftQty; i++) {
        nftIdsResult.push(
          await store.tokenOfOwnerByIndex(i, pool.token.stakeNFT)
        );
      }
    } catch (error) {
      console.error(error);
    }
    return nftIdsResult;
  };

  useEffect(() => {
    getNFTs().then((ids) => {
      setNftsIds(ids);
      let account = store.getStore('account');
      if (!account) return;
      let selectedId = localStorage.getItem(
        `${account.address}/${pool.address}/nftId`
      );
      if (
        !(ids.includes(selectedId) || ids.includes(+selectedId)) ||
        ids.length === 0
      )
        setSelectedId(-2);
      else setSelectedId(selectedId);
    });
  }, []);

  const onChangeNft = (el) => {
    setSelectedId(+el.value);
    store.saveNFTId(pool, +el.value);
    onChange(el);
  };

  return (
    <Select
      options={nftsIds.map((id) => ({
        value: id > 0 ? id : -2,
        label: id > 0 ? `nft #${id}` : 'new NFT',
      }))}
      onChange={onChangeNft}
      value={{
        value: selectedId > 0 ? selectedId : -2,
        label: selectedId > 0 ? `nft #${selectedId}` : 'new NFT',
      }}
    />
  );
};

export default NftSelector;
