import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom';
import IpfsRouter from 'ipfs-react-router';
import Leftnav from './components/leftnav/leftnav';
import Header from './components/header/header';

import './i18n';

import Account from './components/account/account';
import Home from './components/home/home';
import Farm from './components/farm/farm';
import Hives from './components/hives/hives-list';
import WhaleTank from './components/whalestank/whaletank';
import Stake from './components/stake/stake';

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
} from './constants';

import { injected } from './stores/connectors';

import Store from './stores/store';
const { emitter, dispatcher, store } = Store;

class App extends Component {
  state = {
    account: null,
    headerValue: null,
    themeType: false,
  };

  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue });
  };

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);

    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        injected
          .activate()
          .then((a) => {
            store.setStore({
              account: { address: a.account },
              web3context: { library: { provider: a.provider } },
            });
            emitter.emit(CONNECTION_CONNECTED);
            console.log(a);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
      }
    });
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(
      CONNECTION_DISCONNECTED,
      this.connectionDisconnected
    );
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(
      GET_BALANCES_PERPETUAL_RETURNED,
      this.getBalancesReturned
    );
  }

  getBalancesReturned = () => {
    window.setTimeout(() => {
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} });
    }, 300000);
  };

  configureReturned = () => {
    dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} });
  };

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') });
    dispatcher.dispatch({ type: CONFIGURE, content: {} });
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') });
  };

  render() {
    const { account } = this.state;

    return (
      <div className='dark-mode main-content'>
        <IpfsRouter>
          <Header />
          <Leftnav />
          {!account ? (
            <Account />
          ) : (
            <>
              <Switch>
                <Route path='/stake'>
                  <Stake />
                </Route>
                <Route path='/whaletank'>
                  <WhaleTank />
                </Route>
                <Route path='/hives'>
                  <Hives />
                </Route>
                <Route path='/farm'>
                  <Farm />
                </Route>
                <Route path='/'>
                  <Home />
                </Route>
              </Switch>
            </>
          )}
        </IpfsRouter>
      </div>
    );
  }
}

export default App;
