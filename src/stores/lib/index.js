import config from '../../config';

// get balances: =============================================================
// _getERC20Balance
// _getstakedBalance
// _getRewardsAvailable
// _getUniswapLiquidity
// _getBalancerLiquidity
// _getRatePerWeek
// _getBonusAvailable

export const _getERC20Balance = async (web3, asset, account, callback) => {
  let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address);

  try {
    var balance = await erc20Contract.methods
      .balanceOf(account.address)
      .call({ from: account.address });
    balance = parseFloat(balance) / 10 ** asset.decimals;
    // console.log(
    //   'balance ---',
    //   parseFloat(balance) / 10,
    //   balance,
    //   asset.decimals
    // );
    if (callback && typeof callback === 'function') {
      callback(null, parseFloat(balance));
    } else {
      return parseFloat(balance);
    }
  } catch (ex) {
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      console.log(ex);
      throw ex;
    }
  }
};

export const _getstakedBalance = async (web3, asset, account, callback) => {
  let erc20Contract = new web3.eth.Contract(
    asset.rewardsABI,
    asset.rewardsAddress
  );

  try {
    let id = asset?.selectedNftId >= 0 ? asset.selectedNftId : account.address;
    // console.log('entra a balance -----', id);

    let balance = await erc20Contract.methods
      // .balanceOf(4)
      .balanceOf(id)
      .call({ from: account.address });
    balance = parseFloat(balance) / 10 ** asset.decimals;
    // console.log('balance -----', balance);
    if (callback && typeof callback === 'function') {
      callback(null, parseFloat(balance));
    } else {
      return parseFloat(balance);
    }

    // }
  } catch (ex) {
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      throw ex;
    }
  }

  // si si tiene nft, entonces [4, 10, 3]
  // seleccionado ENV: 10
};

export const _getRewardsAvailable = async (web3, asset, account, callback) => {
  let erc20Contract = new web3.eth.Contract(
    asset.rewardsABI,
    asset.rewardsAddress
  );
  let id = account.address;
  if (asset.isSuper) {
    if (!asset.nftIds?.length || asset.selectedNftId < 0) return 0;
    id = asset.selectedNftId;
  }
  // console.log('id ====', id);
  try {
    var earned = await erc20Contract.methods
      .earned(id)
      .call({ from: account.address });
    earned = parseFloat(earned) / 10 ** asset.decimals;
    if (callback && typeof callback === 'function') {
      callback(null, parseFloat(earned));
    } else {
      return parseFloat(earned);
    }
  } catch (ex) {
    console.log(ex);
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      throw ex;
    }
    // return callback(ex);
  }
};

export const _getUniswapLiquidity = async (callback) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var graphql = JSON.stringify({
      query:
        '{\n pair(id: "0x75f89ffbe5c25161cbc7e97c988c9f391eaefaf9"){\n     reserveUSD\n}\n}',
      variables: {},
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    };

    const response = await fetch(
      'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
      requestOptions
    );
    const myJson = await response.json();
    // console.log(myJson.data.pair.reserveUSD);

    let res = parseFloat(myJson.data.pair.reserveUSD).toFixed(2);
    if (callback && typeof callback === 'function') {
      callback(null, res);
    } else {
      return res;
    }
  } catch (ex) {
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      throw ex;
    }
  }
};

export const _getBalancerLiquidity = async (callback) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var graphql = JSON.stringify({
      query:
        '{\n pool(id: "0x5b2dc8c02728e8fb6aea03a622c3849875a48801"){\n     liquidity\n}\n}',
      variables: {},
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    };

    const response = await fetch(
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-beta',
      requestOptions
    );
    const myJson = await response.json();
    // console.log(myJson.data.pool.liquidity);
    let res = parseFloat(myJson.data.pool.liquidity).toFixed(2);
    if (callback && typeof callback === 'function') {
      callback(null, res);
    } else {
      return res;
    }
  } catch (ex) {
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      throw ex;
    }
  }
};

export const _getRatePerWeek = async (web3, asset, account, callback) => {
  let contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress);

  try {
    var rate = await contract.methods
      .currentReward()
      .call({ from: account.address });
    rate = parseFloat(rate) / 10 ** asset.decimals;
    if (callback && typeof callback === 'function') {
      callback(null, rate);
    } else {
      return rate;
    }
  } catch (ex) {
    console.log(ex);
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      throw ex;
    }
    // callback(null, ex);
  }
};

export const _getBonusAvailable = async (web3, asset, account, callback) => {
  let contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress);

  try {
    var beastmodes = await contract.methods
      .timeLockLevel()
      .call({ from: account.address });
    beastmodes = parseFloat(beastmodes[1]);

    if (callback && typeof callback === 'function') {
      callback(null, beastmodes);
    } else {
      return beastmodes;
    }
  } catch (ex) {
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      throw ex;
    }
    // callback(null, ex);
  }
};

// boost balances: ===========================================================
// _getBoosters
// _getBoosterCost
// _getBoostTokenBalance
// _getboostedBalances
// _getBoosterPrice
// _getNextBoostTime
// _getETHPrice

export const _getBoosters = async (web3, asset, account, callback) => {
  let boostContract = new web3.eth.Contract(
    asset.rewardsABI,
    asset.rewardsAddress
  );

  try {
    var balance = await boostContract.methods
      .numBoostersBought(
        asset?.selectedNftId >= 0 ? asset.selectedNftId : account.address
      )
      .call({ from: account.address });
    balance = parseFloat(balance);

    if (callback && typeof callback === 'function') {
      callback(null, balance);
    } else {
      return balance;
    }
  } catch (ex) {
    console.log(ex);
    if (callback && typeof callback === 'function') {
      return callback(ex);
    } else {
      throw ex;
    }
  }
};

export const _getBoosterCost = async (web3, asset, account, callback) => {
  let boostContract = new web3.eth.Contract(
    asset.rewardsABI,
    asset.rewardsAddress
  );

  let id = account.address;
  if (asset.isSuper) {
    if (!asset.nftIds?.length || asset.selectedNftId < 0) return 0;
    id = asset.selectedNftId;
  }

  try {
    let balance = await boostContract.methods
      .getBoosterPrice(id)
      .call({ from: account.address });
    // console.log(balance);
    // console.log(balance[0]);
    // console.log(balance[1]);

    let boostInfo = [
      parseFloat(balance[0]) / 10 ** asset.decimals,
      parseFloat(balance[1]) / 10 ** asset.decimals,
    ];

    if (callback && typeof callback === 'function') {
      callback(null, boostInfo);
    } else {
      return boostInfo;
    }
  } catch (ex) {
    if (callback && typeof callback === 'function') {
      return callback(ex);
    } else {
      throw ex;
    }
  }
};

export const _getBoostTokenBalance = async (web3, asset, account, callback) => {
  try {
    let balance = await web3.eth.getBalance(account.address);

    let boostInfo = parseFloat(balance) / 10 ** asset.decimals;
    if (callback && typeof callback === 'function') {
      callback(null, boostInfo);
    } else {
      return boostInfo;
    }
  } catch (ex) {
    console.log(ex);
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      throw ex;
    }
  }
};

export const _getboostedBalances = async (web3, asset, account, callback) => {
  let boostContract = new web3.eth.Contract(
    asset.rewardsABI,
    asset.rewardsAddress
  );

  try {
    let balance = await boostContract.methods
      .boostedBalances(
        asset?.selectedNftId >= 0 ? asset.selectedNftId : account.address
      )
      .call({ from: account.address });
    // console.log(balance);

    let boostInfo = parseFloat(balance) / 10 ** asset.decimals;
    if (callback && typeof callback === 'function') {
      callback(null, boostInfo);
    } else {
      return boostInfo;
    }
  } catch (ex) {
    console.log(ex);
    if (callback && typeof callback === 'function') {
      return callback(ex);
    } else {
      throw ex;
    }
  }
};

export const _getBoosterPrice = async (callback) => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD'
    );
    const myJson = await response.json();
    // console.log(myJson.ethereum.usd);
    var balance = parseFloat(myJson.ethereum.usd);

    if (callback && typeof callback === 'function') {
      callback(null, balance);
    } else {
      return balance;
    }
  } catch (ex) {
    if (callback && typeof callback === 'function') {
      return callback(ex);
    } else {
      throw ex;
    }
  }
};

export const _getNextBoostTime = async (web3, asset, account, callback) => {
  let boostTokenContract = new web3.eth.Contract(
    asset.rewardsABI,
    asset.rewardsAddress
  );
  // console.log('>>>>>>> NEXT BOOST TIME');
  try {
    var time = await boostTokenContract.methods
      .nextBoostPurchaseTime(
        asset?.selectedNftId >= 0 ? asset.selectedNftId : account.address
      )
      .call({ from: account.address });
    // console.log(time);
    // console.log(new Date().getTime() / 1000);
    var boostInfo = parseInt(time);

    if (callback && typeof callback === 'function') {
      callback(null, boostInfo);
    } else {
      return boostInfo;
    }
  } catch (ex) {
    console.log(ex);
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      return ex;
    }
  }
};

export const _getETHPrice = async (callback) => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD'
    );
    const myJson = await response.json();
    var balance = parseFloat(myJson.ethereum.usd);
    if (callback && typeof callback === 'function') {
      callback(null, parseFloat(balance));
    } else {
      return parseFloat(balance);
    }
  } catch (ex) {
    if (callback && typeof callback === 'function') {
      callback(ex);
    } else {
      throw ex;
    }
    // return callback(ex);
  }
};
