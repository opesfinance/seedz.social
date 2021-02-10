import React, { useState, useEffect, useCallback } from 'react';

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

  const farms = farmPools.map((p) => {
    return (
      <>
        <Farm pool={p} />
      </>
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
