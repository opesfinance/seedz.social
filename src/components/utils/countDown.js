import React, { useEffect, useState } from 'react';
import moment from 'moment';

import Store from '../../stores/store';
const { store } = Store;

export default function CountDown(props) {
  const [timeForReduction, setTimeForReduction] = useState('');

  useEffect(() => {
    let interval = setInterval(() => {
      const timestamp = props.timestamp | store.store.startBeastReductionTimestamp
      const startBeastReduction = moment.unix(timestamp);
      const diffDays = moment().diff(startBeastReduction, 'days');
      const nextReduction = startBeastReduction.add(diffDays + 1, 'days');
      let diff = moment.utc(nextReduction.diff(moment())).format('HH:mm:ss');
      setTimeForReduction(props.pool.disableStake ? 0 : `${diff}`);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [props.id]);

  return <span>{timeForReduction}</span>;
}
