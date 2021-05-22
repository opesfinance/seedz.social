import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import Web3 from 'web3';
import Store from '../../stores/store';
import {
  DialogContent,
  Dialog,
  DialogTitle,
  Typography,
  CircularProgress,
} from '@material-ui/core';

const { store } = Store;

const NetworkAlert = (props) => {
  const [isMainnet, setIsMainnet] = useState(true); // es cierto por vacuidad
  const [open, setOpen] = React.useState(true);

  const web3 = new Web3(store.getStore('web3context').library.provider);

  const checkMainnet = async (version) => {
    const net = web3?.eth?.net;
    if (!net) setIsMainnet(true);
    else setIsMainnet((await net.getNetworkType()) === 'main');
  };

  useEffect(() => {
    checkMainnet();
    const { ethereum } = window;
    if (ethereum) ethereum.on('chainChanged', checkMainnet);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {isMainnet ? (
        ''
      ) : (
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle align='center'>
              <CircularProgress size={100} />
              <Typography variant='h3'>Wrong Network</Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant='subtitle1'>
                Change network to Mainnet
              </Typography>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default withNamespaces()(NetworkAlert);
