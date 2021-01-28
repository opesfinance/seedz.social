import React from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import './whaletank.scss';

const WhaleTank = (props) => {
  return (
    <div>
      <div className='pageHeader my-auto'>Whale Tank</div>

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
