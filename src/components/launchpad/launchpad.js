import React from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
// import { AiOutlineWarning } from 'react-icons/ai';

import SuperHivesList from './superhives-list';

const Launchpad = (props) => {
  return (
    <div>
      <div className='pageHeader my-auto'>Super Hives / LaunchPad</div>

      <div className='ml-sm-5 p-sm-5 ml-5 p-1 pb-5'>
        <SuperHivesList justifyContent='flex-start' />
      </div>
    </div>
  );
};

export default withNamespaces()(withRouter(Launchpad));
