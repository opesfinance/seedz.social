import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { CONFIGURE_RETURNED } from '../../constants/constants';
// import Footer from '../footer/footer';
import Store from '../../stores/store';
const { emitter, store } = Store;

const Farm = () => {
  const account = store.getStore('account');
  const themeType = store.getStore('themeType');
  const activeClass = store.getStore('activeClass');
  // constructor(props) {
  //   super();
  const [rewardPools, setRewardPools] = useState(store.getStore('rewardPools'));
  const [loading, setLoading] = useState(!(account && rewardPools));

  useEffect(() => {
    emitter.on(CONFIGURE_RETURNED, configureReturned);

    return () => {
      emitter.removeListener(CONFIGURE_RETURNED, configureReturned);
    };
  }, []);

  const configureReturned = useCallback(() => setLoading(false));

  return (
    <div>
      <div className='pageHeader my-auto'>Farm</div>
      <div className='p-5 ml-5 text-center '>
        <div className='mt-5 whaletank-wrapper'>
          <img
            alt=''
            src={require('../../assets/farmsGreen.webp')}
            style={{ width: '65%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default withNamespaces()(withRouter(Farm));
