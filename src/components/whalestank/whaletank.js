import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { CONFIGURE_RETURNED } from '../../constants';
import Store from '../../stores/store';
import './whaletank.scss';

const { emitter, store } = Store;

class WhaleTank extends Component {
  constructor(props) {
    super();

    const account = store.getStore('account');
    const themeType = store.getStore('themeType');
    const activeClass = store.getStore('activeClass');

    this.state = {
      activeClass: activeClass,
      account: account,
      themeType: themeType,
    };
  }

  componentWillMount() {
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
  }

  configureReturned = () => {
    this.setState({ loading: false });
  };

  render() {
    return (
      <div>
        <div className='pageHeader my-auto'>WhaleTank</div>

        <div className='mt-5 whaletank-wrapper'>
          <img
            alt=''
            src={require('../../assets/whaletank-comingsoon.png')}
            style={{ width: '65%' }}
          />
        </div>
      </div>
    );
  }
}

export default withNamespaces()(withRouter(WhaleTank));
