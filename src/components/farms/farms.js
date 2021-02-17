import React from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { AiOutlineWarning } from 'react-icons/ai';

import FarmsList from './farms-list';

const Farms = (props) => {
  return (
    <div>
      <div className='pageHeader my-auto'>Farms</div>

      <div className='mt-5 whaletank-wrapper'>
        <img
          alt=''
          src={require('../../assets/farmsGreen.webp')}
          className='img-fluid'
        />
      </div>
      {/*<div className='p-5 ml-5'>
        <div className='row'>
          <div className='col-md-6 offset-md-3'></div>
        </div>

        <FarmsList />
      </div>*/}
    </div>
  );
};

export default withNamespaces()(withRouter(Farms));
