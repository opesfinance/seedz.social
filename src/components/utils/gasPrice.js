import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GasPrice(props) {
  const [gasPrice, setGasPrice] = useState(10);

  async function getGasPrice(source) {
    try {
      let {
        data,
      } = await axios.get(
        'https://ethgasstation.info/api/ethgasAPI.json?api-key=3f07e80ab9c6bdd0ca11a37358fc8f1a291551dd701f8eccdaf6eb8e59be',
        { cancelToken: source.token }
      );

      setGasPrice(data.fastest);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    getGasPrice(source);
    let interval = setInterval(() => {
      getGasPrice(source);
    }, 5000);
    return () => {
      source.cancel('');
      clearInterval(interval);
    };
  }, [props.id]);

  return (
    <span>
      <img
        alt=''
        className='mr-2'
        src={require('../../assets/fuel.png')}
        height='20'
      />
      {gasPrice / 10} gwei
    </span>
  );
}
