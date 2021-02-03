import React, { useState, useEffect, useCallback } from 'react';

import './hives-list.scss';

import {
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BOOSTEDBALANCES_RETURNED,
  GET_BOOSTEDBALANCES,
} from '../../constants/constants';

import Store from '../../stores/store';
import Hive from './hive';

const { emitter, dispatcher, store } = Store;

const HivesList = (props) => {
  // const rewardPools = store.getStore('rewardPools');
  // themeType activeClass should be retrieved from React context
  // const themeType = store.getStore('themeType');
  // const activeClass = store.getStore('activeClass');

  //console.log('themeType -----------', themeType); // why is this #true?

  const [rewardPools, setRewardPools] = useState(store.getStore('rewardPools'));
  const [account, setAccount] = useState(store.getStore('account'));
  // console.log('rewardPools -----------', JSON.stringify(rewardPools)); // why is this #true?

  const [loading, setLoading] = useState(!(account && rewardPools));

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
    const rewardPools = store.getStore('rewardPools');
    setRewardPools(rewardPools);
  }, []);

  const configureReturned = useCallback(() => setLoading(false));

  const hives = rewardPools
    .flatMap((rp) => rp.tokens[0])
    .map((t) => {
      return (
        <div className='col-md-3' key={t.rewardsAddress}>
          <Hive
            acronym={t.symbol}
            name={t.name}
            address={t.rewardsAddress}
            inPool={t.inPool}
            beastBonus={t.beastBonus || 0}
            bonusReductionIn={t.bonusReductionIn || 0}
            weeklyRewards={t.poolRatePerWeek}
            myBeastModes={t.currentActiveBooster}
            myRewards={t.rewardsAvailable}
            symbol={t.symbol}
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
          />
        </div>
      );
    });

  return (
    <div
      className='row hives-wrapper'
      style={{
        justifyContent: props.justifyContent ? props.justifyContent : 'center',
      }}
    >
      {hives}
    </div>
  );
};

export default HivesList;
