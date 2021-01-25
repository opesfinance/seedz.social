import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import './hives.scss';

import {
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BOOSTEDBALANCES_RETURNED,
} from '../../constants/constants';

import Store from '../../stores/store';
import Hive from './hive';

const { emitter, dispatcher, store } = Store;

const Hives = (props) => {
  const account = store.getStore('account');
  // const rewardPools = store.getStore('rewardPools');
  // themeType activeClass should be retrieved from React context
  const themeType = store.getStore('themeType');
  const activeClass = store.getStore('activeClass');

  console.log('themeType -----------', themeType); // why is this #true?

  const [rewardPools, setRewardPools] = useState(store.getStore('rewardPools'));
  console.log('rewardPools -----------', rewardPools); // why is this #true?

  const [loading, setLoading] = useState(!(account && rewardPools));

  dispatcher.dispatch({ type: GET_BALANCES, content: {} });

  useEffect(() => {
    emitter.on(CONFIGURE_RETURNED, configureReturned);
    emitter.on(GET_BALANCES_RETURNED, balancesReturned);
    emitter.on(GET_BOOSTEDBALANCES_RETURNED, balancesReturned);

    return () => {
      emitter.removeListener(CONFIGURE_RETURNED, configureReturned);
      emitter.removeListener(GET_BALANCES_RETURNED, balancesReturned);
      emitter.removeListener(GET_BOOSTEDBALANCES_RETURNED, balancesReturned);
    };
  }, []);

  const balancesReturned = useCallback(() => {
    const rewardPools = store.getStore('rewardPools');
    setRewardPools(rewardPools);
  }, []);

  // this is not used and does the same logic as balancesReturned
  // const boostInfoReturned = useCallback(() => {
  //   const rewardPools = store.getStore('rewardPools');
  //   setRewardPools(rewardPools);
  // });

  const configureReturned = useCallback(() => setLoading(false));

  const dummyHivesData = [
    {
      acronym: 'BPT',
      address: 'aaw98eyna0wznxvz87597zs9z7d6v08zds078v',
      inPool: '406.23BPT',
      beastBonus: '32,128',
      bonusReductionIn: '20',
      weeklyRewards: '15,323',
      myBeastModes: '26',
      myRewards: '23,913',
    },
    {
      acronym: 'BPT',
      address: 'aa78698av7s078ayv6v08zds078v',
      inPool: '406.23BPT',
      beastBonus: '32,128',
      bonusReductionIn: '20',
      weeklyRewards: '15,323',
      myBeastModes: '26',
      myRewards: '23,913',
    },
  ];

  const hives = dummyHivesData.map((h) => {
    return (
      <Hive
        key={h.address}
        acronym={h.acronym}
        address={h.address}
        inPool={h.inPool}
        beastBonus={h.beastBonus}
        bonusReductionIn={h.bonusReductionIn}
        weeklyRewards={h.weeklyRewards}
        myBeastModes={h.myBeastModes}
        myRewards={h.myRewards}
      />
    );
  });

  return (
    <div className='p-5 ml-5'>
      <h1 className='text-center'>Hives</h1>
      <div className='hives-wrapper'>{hives}</div>
    </div>
  );
};

export default withNamespaces()(withRouter(Hives));
