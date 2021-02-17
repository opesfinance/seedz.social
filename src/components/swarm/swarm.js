import React from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import './swarm.scss';

const WhaleTank = (props) => {
  return (
    <div>
      <div className='pageHeader my-auto'>Swarm</div>

      <div className='mt-5 whaletank-wrapper'>
        <img
          alt=''
          src={require('../../assets/swarm-coming-soon.webp')}
          className='img-fluid'
        />
      </div>
    </div>
  );
};

export default withNamespaces()(withRouter(WhaleTank));
