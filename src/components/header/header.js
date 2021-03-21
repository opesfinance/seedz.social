import React from 'react';
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
class Header extends React.Component {
  constructor(props) {
    super(props);
    const account = store.getStore('account');
    const themeType = store.getStore('themeType');
    const activeClass = store.getStore('activeClass');

    this.state = {
      activeClass,
      loading: false,
      account: account,
      assets: store.getStore('assets'),
      modalOpen: false,
      themeType: themeType,
    };
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(
      CONNECTION_DISCONNECTED,
      this.connectionDisconnected
    );
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') });
  };

  configureReturned = () => {
    //.this.props.history.push('/')
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account'), loading: false });
  };

  errorReturned = (error) => {
    //TODO: handle errors
  };

  renderModal = () => {
    return (
      <UnlockModal
        closeModal={this.closeModal}
        modalOpen={this.state.modalOpen}
      />
    );
  };

  unlockClicked = () => {
    this.setState({ modalOpen: true, loading: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false, loading: false });
  };

  render() {
    const { account, modalOpen } = this.state;
    var address = null;
    if (account.address) {
      address =
        account.address.substring(0, 6) +
        '...' +
        account.address.substring(
          account.address.length - 4,
          account.address.length
        );
    }
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
              <Link to='/#' onClick={this.unlockClicked}>
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
              <Button className='btn btn-primary' onClick={this.unlockClicked}>
                Connect Wallet
              </Button>
            )}
          </div>
          {/* <Navbar.Collapse className='justify-content-end'>
          </Navbar.Collapse> */}
        </nav>

        {modalOpen && this.renderModal()}
      </>
    );
  }
}

export default Header;
