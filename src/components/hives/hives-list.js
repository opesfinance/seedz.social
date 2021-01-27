import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { AiOutlineWarning } from 'react-icons/ai';

import './hives-list.scss';

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
  // const rewardPools = store.getStore('rewardPools');
  // themeType activeClass should be retrieved from React context
  // const themeType = store.getStore('themeType');
  // const activeClass = store.getStore('activeClass');

  // console.log('themeType -----------', themeType); // why is this #true?

  const [rewardPools, setRewardPools] = useState(store.getStore('rewardPools'));
  const [account, setAccount] = useState(store.getStore('account'));
  console.log('rewardPools -----------', rewardPools); // why is this #true?

  const [loading, setLoading] = useState(!(account && rewardPools));

  useEffect(() => {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} });
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
      <div className='col-md-3' key={h.address}>
        <Hive
          acronym={h.acronym}
          address={h.address}
          inPool={h.inPool}
          beastBonus={h.beastBonus}
          bonusReductionIn={h.bonusReductionIn}
          weeklyRewards={h.weeklyRewards}
          myBeastModes={h.myBeastModes}
          myRewards={h.myRewards}
        />
      </div>
    );
  });

  return (
    <div className='p-5 ml-5'>
      <h1 className='text-center'>Hives</h1>

      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <div className='alert alert-success' role='alert'>
            <AiOutlineWarning /> A simple success alert—check it out!
          </div>
        </div>
      </div>

      <div className='row hives-wrapper'>{hives}</div>
    </div>
  );
};

export default withNamespaces()(withRouter(Hives));
