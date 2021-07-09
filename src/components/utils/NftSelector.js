import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Store from '../../stores/store';
const { store } = Store;

const NftSelector = (props) => {
  const nftOptions = props.ids.map((id) => {
    return {
      value: id ? id : -2,
      label: id ? `nft #${id}` : 'new NFT',
    };
  });
  const [selectedNftOption, setSelectedNftOption] = useState(
    nftOptions[nftOptions.length - 1]
  );

  useEffect(() => {
    let nftId = store.loadNFTId(props.match.params.address);
    setSelectedNftOption(
      nftOptions.find(
        ({ value }, ix) => value === nftId || ix === nftOptions.length - 1
      )
    );
  }, []);

  const onChangeNft = (el) => {
    store.saveNFTId(props.match.params.address, el.value);
    props.onChangeNft(el);
  };

  return (
    <Select
      options={nftOptions}
      onChange={onChangeNft}
      defaultValue={selectedNftOption}
    />
  );
};

export default NftSelector;
