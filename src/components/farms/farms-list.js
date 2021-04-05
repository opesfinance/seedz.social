import React, { useState, useEffect, useCallback } from 'react';
import rewardsMapper from '../utils/rewardsMapper';

import './farms-list.scss';

import {
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BOOSTEDBALANCES_RETURNED,
  GET_BOOSTEDBALANCES,
} from '../../constants/constants';

import Store from '../../stores/store';
import Farm from './farm';

const { emitter, dispatcher, store } = Store;

const FarmsList = (props) => {
  const [farmPools, setFarmPools] = useState(store.getStore('farmPools'));
  const [account, setAccount] = useState(store.getStore('account'));
  const [loading, setLoading] = useState(!(account && farmPools));

  useEffect(() => {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} });
    dispatcher.dispatch({ type: GET_BOOSTEDBALANCES, content: {} });
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
    const farmPools = store.getStore('farmPools');
    setFarmPools(farmPools);
  }, []);

  const configureReturned = useCallback(() => setLoading(false));

  /*const farms = farmPools.map((p) => {
    console.log(p);
    return (
      <div key={p.id} className='col-lg-3 col-md-4 col-sm-6'>
        <Farm pool={p} />
      </div>
    );
  });*/

  const farms = rewardsMapper(farmPools).map((t) => {
    return (
      <div className='col-lg-3 col-md-4 col-sm-6' key={t.address}>
        <Farm
          acronym={t.symbol}
          name={t.name}
          address={t.address}
          inPool={t.inPool}
          beastBonus={t.beastBonus || 0}
          bonusReductionIn={t.bonusReductionIn || 0}
          weeklyRewards={t.weeklyRewards}
          myBeastModes={t.myBeastModes}
          myRewards={t.myRewards}
          symbol={t.symbol}
          // ratePerWeek={t.ratePerWeek}
          rewardsSymbol={t.rewardsSymbol}
          stakedBalance={t.stakedBalance}
          costBooster={t.costBooster}
          costBoosterUSD={t.costBoosterUSD}
          timeToNextBoost={t.timeToNextBoost}
          currentBoosterStakeValue={t.currentBoosterStakeValue}
          stakeValueNextBooster={t.stakeValueNextBooster}
          liquidityLink={t.liquidityLink}
          tokenAddress={t.tokenAddress}
          tokenSymbol={t.tokenSymbol}
          ethPrice={t.ethPrice}
          boostBalance={t.boostBalance}
          disableStake={t.disableStake}
          token={t.token}
        />
      </div>
    );
  });

  return (
    <div
      className='row farms-wrapper'
      style={{
        justifyContent: props.justifyContent ? props.justifyContent : 'center',
      }}
    >
      {farms}
    </div>
  );
};

export default FarmsList;
