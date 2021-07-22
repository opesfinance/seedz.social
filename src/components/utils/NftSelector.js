import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Store from '../../stores/store';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';

const { store } = Store;
let nftId = -2;

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
    nftId = selectedId;
  }, [selectedId]);

  useEffect(() => {
    getNFTs().then((ids) => {
      setNftsIds(ids);
      let account = store.getStore('account');
      if (!account) return;
      let selectedId = Number(
        localStorage.getItem(`${account.address}/${pool.address}/nftId`)
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
    <>
      <Select
        options={nftsIds.map((id) => ({
          value: id >= 0 ? id : -2,
          label: id >= 0 ? `nft #${id}` : 'new NFT',
        }))}
        onChange={onChangeNft}
        value={{
          value: selectedId >= 0 ? selectedId : -2,
          label: selectedId >= 0 ? `nft #${selectedId}` : 'new NFT',
        }}
      />
    </>
  );
};

export default NftSelector;

export const ConfirmNft = ({ onContinue, onCancel, show = true }) => {
  const [open, setOpen] = useState(show);

  const nftOption = nftId >= 0 ? `nft #${nftId}` : 'new NFT';

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>
        Do you want to continue with {nftOption}
      </DialogTitle>
      {/* <DialogContent>
  <DialogContentText id="alert-dialog-description">
    
  </DialogContentText>
</DialogContent> */}
      <DialogActions>
        <Button onClick={onCancel} color='primary'>
          Cancel
        </Button>
        <Button onClick={onContinue} color='primary' autoFocus>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
