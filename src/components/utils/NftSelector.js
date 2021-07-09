import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Store from '../../stores/store';
const { store } = Store;

const NftSelector = ({ onChange, pool }) => {
  const [nftOptions, setNftOptions] = useState([
    {
      value: -2,
      label: 'new NFT',
    },
  ]);

  const [selectedNftOption, setSelectedNftOption] = useState({
    value: -2,
    label: 'new NFT',
  });

  const getNFTs = async () => {
    var nftIdsResult = [''];
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
    getNFTs().then((nfts) => {
      setNftOptions(
        nfts.map((id) => {
          return {
            value: id ? id : -2,
            label: id ? `nft #${id}` : 'new NFT',
          };
        })
      );

      let nftId = store.loadNFTId(pool.address);
      setSelectedNftOption(
        nftOptions.find(
          ({ value }, ix) => value === nftId || ix === nftOptions.length - 1
        )
      );
    });
  }, []);

  const onChangeNft = (el) => {
    store.saveNFTId(pool.address, el.value);
    const pools = [...store.getStore('rewardPools')];
    let currentPool = pools.find(({ id }) => pool.id === id);
    if (currentPool) {
      currentPool.tokens[0].selectedNftId = +el.value;
    }
    let p = { ...pool };
    p.token.selectedNftId = el.value;
    store.setStore({ rewardPools: pools });
    if (+el.value >= 0)
      dispatcher.dispatch({ type: GET_BALANCES, content: {} });
    onChangeNft(el);
  };

  return (
    <Select
      options={nftOptions}
      onChange={onChange}
      defaultValue={selectedNftOption}
    />
  );
};

export default NftSelector;
