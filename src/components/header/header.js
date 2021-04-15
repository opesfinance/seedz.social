import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import UnlockModal from '../unlock/unlockModal.jsx';
import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE_RETURNED,
} from '../../constants/constants';

import { Button } from 'react-bootstrap';

import Store from '../../stores/store';
const { emitter, store } = Store;

const Header = (props) => {
  const [account, setAccount] = useState(store.getStore('account'));
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    emitter.on(ERROR, errorReturned);
    emitter.on(CONNECTION_CONNECTED, connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, connectionDisconnected);

    return () => {
      emitter.removeListener(ERROR, errorReturned);
      emitter.removeListener(CONNECTION_CONNECTED, connectionConnected);
      emitter.removeListener(CONNECTION_DISCONNECTED, connectionDisconnected);
    };
  }, [props]);

  const connectionConnected = () => setAccount(store.getStore('account'));

  const connectionDisconnected = () => setAccount(store.getStore('account'));

  const errorReturned = (error) => {
    //TODO: handle errors
  };

  const closeModal = () => setModalOpen(false);

  const renderModal = (
    <UnlockModal closeModal={closeModal} modalOpen={modalOpen} />
  );

  const unlockClicked = () => {
    setModalOpen(true);
    // this.setState({ modalOpen: true, loading: true });
  };

  const address = account?.address
    ? account.address.substring(0, 6) +
      '...' +
      account.address.substring(
        account.address.length - 4,
        account.address.length
      )
    : null;

  return (
    <>
      <nav className='navbar navbar-expand-lg fixed-top'>
        <Link to='/' className='navbar-brand'>
          <img
            className='navbar-logo'
            src={require('../../assets/empty.png')}
            height='30'
            alt='Bees Social'
          />
        </Link>

        <div>
          {address && (
            <Link to='/#' onClick={unlockClicked}>
              <img
                alt=''
                src={require('../../assets/wallet-logo.png')}
                height='30'
              />
              &nbsp;
              <span className='text-purple'>{address}</span>
            </Link>
          )}
          {!address && (
            <Button className='btn btn-primary' onClick={unlockClicked}>
              Connect Wallet
            </Button>
          )}
        </div>
        {/* <Navbar.Collapse className='justify-content-end'>
        </Navbar.Collapse> */}
      </nav>

      {modalOpen && renderModal}
    </>
  );
};

export default Header;
