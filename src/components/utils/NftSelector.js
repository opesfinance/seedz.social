import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Store from '../../stores/store';
import { GET_BALANCES_RETURNED } from '../../constants/constants';

const { store, dispatcher, emitter } = Store;

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

  useEffect(() => {
    store.tokenNFTs(pool).then(({ nftIds, selectedId }) => {
      const options = nftIds.map((id) => {
        return {
          value: id ? id : -2,
          label: id ? `nft #${id}` : 'new NFT',
        };
      });
      setNftOptions(options);
      setSelectedNftOption(
        options.find(({ value }) => value == +selectedId) ||
          options[options.length - 1]
      );
    });
  }, []);

  const onChangeNft = (el) => {
    setSelectedNftOption(el);
    store.saveNFTId(pool, 0, el.value);
    onChange(el);
  };

  return (
    <Select
      value={selectedNftOption}
      options={nftOptions}
      onChange={onChangeNft}
    />
  );
};

export default NftSelector;
