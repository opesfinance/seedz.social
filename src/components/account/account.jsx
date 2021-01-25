import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { ERROR } from '../../constants';

import Store from '../../stores/store';
const { emitter, store } = Store;

class Account extends Component {
  constructor(props) {
    super();

    const account = store.getStore('account');
    const themeType = store.getStore('themeType');
    const activeClass = store.getStore('activeClass');

    this.state = {
      activeClass: activeClass,
      loading: false,
      account: account,
      assets: store.getStore('assets'),
      modalOpen: false,
      themeType: themeType,
    };
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
  }

  errorReturned = (error) => {
    //TODO: handle errors
  };

  render() {
    return (
      <div className='p-5 ml-5 text-center'>
        <h1>GET THE POWER YOU DESERVE</h1>
        <h4>The fairest distribution model the world has ever seen.</h4>
        <h6>
          Yield Farmers can now utilize the most valuable asset in the world to
          gain themselves an inside position on the next Mega-Corporation we
          build.
        </h6>
      </div>
    );
  }
}

export default Account;
