import React from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
// import { AiOutlineWarning } from 'react-icons/ai';

import FarmsList from './farms-list';

const Farms = (props) => {
  return (
    <div>
      <div className='pageHeader my-auto'>Farms</div>

      {/* <div className='mt-5 whaletank-wrapper'>
        <img
          alt=''
          src={require('../../assets/farmsGreen.webp')}
          className='img-fluid'
        />
      </div> */}
      <div className='ml-sm-5 p-sm-5 ml-5 p-1 pb-5'>
        <FarmsList justifyContent='flex-start' />
      </div>
    </div>
  );
};

export default withNamespaces()(withRouter(Farms));
