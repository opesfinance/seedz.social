const rewardsMapper = (rewards) => {
  // let result = rewards.flatMap((rp) => {
  //   return {
  //     ...rp,
  //     hiveId: rp.id,
  //     ...rp.tokens[0],
  //     ratePerWeek: rp.ratePerWeek,
  //     socialLinks: rp.socialLinks,
  //   };
  // });
  // console.log(result);
  return rewards.map((rp) => {
    return {
      ...rp,
      data: rp,
      hiveId: rp.id,
      id: rp.id,
      acronym: rp.tokens[0].symbol,
      name: rp.tokens[0].name,
      address: rp.tokens[0].rewardsAddress,
      // inPool: rp.tokens[0].inPool,
      beastBonus: rp.tokens[0].beastModeBonus || 0,
      bonusReductionIn: rp.tokens[0].bonusReductionIn || 0,
      weeklyRewards: rp.tokens[0].ratePerWeek,
      myBeastModes: rp.tokens[0].currentActiveBooster,
      myRewards: rp.tokens[0].rewardsAvailable,
      symbol: rp.tokens[0].symbol,
      imageLogo: rp.tokens[0].imageLogo,
      rewardsSymbol: rp.tokens[0].rewardsSymbol,
      stakedBalance: rp.tokens[0].stakedBalance,
      balance: rp.tokens[0].balance,
      costBooster: rp.tokens[0].costBooster,
      costBoosterUSD: rp.tokens[0].costBoosterUSD,
      timeToNextBoost: rp.tokens[0].timeToNextBoost,
      currentBoosterStakeValue: rp.tokens[0].currentBoosterStakeValue,
      stakeValueNextBooster: rp.tokens[0].stakeValueNextBooster,
      liquidityLink: rp.tokens[0].liquidityLink,
      tokenAddress: rp.tokens[0].tokenAddress,
      tokenSymbol: rp.tokens[0].tokenSymbol,
      ethPrice: rp.tokens[0].ethPrice,
      boostBalance: rp.tokens[0].boostBalance,
      disableStake: rp.tokens[0].disableStake,
      socialLinks: rp.socialLinks,
      token: { ...rp.tokens[0], hiveId: rp.id },
    };
  });
  // console.log(result);

  // return result;
};

export default rewardsMapper;
