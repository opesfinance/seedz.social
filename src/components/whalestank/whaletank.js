import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { CONFIGURE_RETURNED } from '../../constants';
import Store from '../../stores/store';
import './whaletank.scss';

const { emitter, store } = Store;

const WhaleTank = (props) => {
  const account = store.getStore('account');
  const themeType = store.getStore('themeType');
  // const activeClass = store.getStore('activeClass');

  // no logic implemented yet.
  // useEffect(() => {
  //   emitter.on(CONFIGURE_RETURNED, configureReturned);

  //   return () => {
  //     emitter.removeListener(CONFIGURE_RETURNED, configureReturned);
  //   };
  // }, []);

  // componentWillMount() {
  //   emitter.on(CONFIGURE_RETURNED, this.configureReturned);
  // }

  // componentWillUnmount() {
  //   emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
  // }

  // const configureReturned = useCallback(() => setLoading(false));

  return (
    <div>
      <div className='pageHeader my-auto'>WhaleTank</div>

      <div className='mt-5 whaletank-wrapper'>
        <img
          alt=''
          src={require('../../assets/whaletank-comingsoon.png')}
          className='img-fluid'
        />
      </div>
    </div>
  );
};

export default withNamespaces()(withRouter(WhaleTank));
