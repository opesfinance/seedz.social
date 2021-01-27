import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { AiOutlineWarning } from 'react-icons/ai';

import HivesList from './hives-list';

const Hives = (props) => {
  return (
    <div className='p-5 ml-5'>
      <h1 className='text-center'>Hives</h1>

      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <div className='alert alert-success' role='alert'>
            <AiOutlineWarning /> Bonus only applies on your first stake.
          </div>
        </div>
      </div>

      <HivesList />
    </div>
  );
};

export default withNamespaces()(withRouter(Hives));
