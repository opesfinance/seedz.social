import React, { useState, useEffect, useCallback } from 'react';
import rewardsMapper from '../utils/rewardsMapper';

import './superhives-list.scss';

import {
  // CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BOOSTEDBALANCES_RETURNED,
  GET_BOOSTEDBALANCES,
  GET_REWARDS_RETURNED,
  STAKE_RETURNED,
} from '../../constants/constants';

import Store from '../../stores/store';
import Hive from '../hives/hive';

const { emitter, dispatcher, store } = Store;

const SuperHivesList = (props) => {
  // const rewardPools = store.getStore('rewardPools');
  // themeType activeClass should be retrieved from React context
  // const themeType = store.getStore('themeType');
  // const activeClass = store.getStore('activeClass');

  //console.log('themeType -----------', themeType); // why is this #true?

  const [rewardPools, setRewardPools] = useState(
    store.getStore('rewardPools').filter(({ isSuperHive }) => isSuperHive)
  );
  // const [account, _] = useState(store.getStore('account'));
  // console.log('rewardPools -----------', JSON.stringify(rewardPools)); // why is this #true?

  // const [loading, setLoading] = useState(!(account && rewardPools));

  useEffect(() => {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} });
    dispatcher.dispatch({ type: GET_BOOSTEDBALANCES, content: {} });
    // emitter.on(CONFIGURE_RETURNED, configureReturned);
    emitter.on(GET_BALANCES_RETURNED, balancesReturned);
    emitter.on(GET_REWARDS_RETURNED, balancesReturned);
    emitter.on(GET_BOOSTEDBALANCES_RETURNED, balancesReturned);
    emitter.on(STAKE_RETURNED, balancesReturned);

    return () => {
      // emitter.removeListener(CONFIGURE_RETURNED, configureReturned);
      emitter.removeListener(GET_REWARDS_RETURNED, balancesReturned);
      emitter.removeListener(GET_BALANCES_RETURNED, balancesReturned);
      emitter.removeListener(GET_BOOSTEDBALANCES_RETURNED, balancesReturned);
      emitter.removeListener(STAKE_RETURNED, balancesReturned);
    };
  }, []);

  // const showHash = (txHash) => {};

  const balancesReturned = useCallback(async () => {
    const rewardPools = store
      .getStore('rewardPools')
      .filter(({ isSuperHive }) => isSuperHive);

    // i think this should be in an upper level. though only being used here
    const assetsOut = store.getStore('lpTokens');

    let promises = assetsOut.map((assetOut) => store.getLpPrice(assetOut));
    await Promise.all(promises);

    // console.log(rewardPools);

    setRewardPools(rewardPools);
  }, []);

  // const configureReturned = useCallback(() => setLoading(false));

  const hives = rewardsMapper(rewardPools).map((t) => {
    return (
      <div className='col-lg-3 col-md-4 col-sm-6' key={t.address}>
        <Hive
          data={t}
          acronym={t.symbol}
          name={t.name}
          address={t.address}
          // inPool={t.inPool}
          beastBonus={t.beastBonus || 0}
          bonusReductionIn={t.bonusReductionIn || 0}
          weeklyRewards={t.weeklyRewards}
          myBeastModes={t.myBeastModes}
          myRewards={t.myRewards}
          symbol={t.symbol}
          // ratePerWeek={t.ratePerWeek}
          rewardsSymbol={t.rewardsSymbol}
          // stakedBalance={t.stakedBalance}
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
      className='row hives-wrapper'
      style={{
        justifyContent: props.justifyContent ? props.justifyContent : 'center',
      }}
    >
      {hives.reverse()}
    </div>
  );
};

export default SuperHivesList;
