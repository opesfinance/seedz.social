const rewardsMapper = (rewards) => {
  let result = rewards
    .flatMap((rp) => {
      return {
        hiveId: rp.id,
        ...rp.tokens[0],
        ratePerWeek: rp.ratePerWeek,
        socialLinks: rp.socialLinks,
      };
    })
    .map((t) => {
      return {
        hiveId: t.hiveId,
        id: t.id,
        acronym: t.symbol,
        name: t.name,
        address: t.rewardsAddress,
        inPool: t.inPool,
        beastBonus: t.beastModeBonus || 0,
        bonusReductionIn: t.bonusReductionIn || 0,
        weeklyRewards: t.ratePerWeek,
        myBeastModes: t.currentActiveBooster,
        myRewards: t.rewardsAvailable,
        symbol: t.symbol,
        imageLogo: t.imageLogo,
        rewardsSymbol: t.rewardsSymbol,
        stakedBalance: t.stakedBalance,
        balance: t.balance,
        costBooster: t.costBooster,
        costBoosterUSD: t.costBoosterUSD,
        timeToNextBoost: t.timeToNextBoost,
        currentBoosterStakeValue: t.currentBoosterStakeValue,
        stakeValueNextBooster: t.stakeValueNextBooster,
        liquidityLink: t.liquidityLink,
        tokenAddress: t.tokenAddress,
        tokenSymbol: t.tokenSymbol,
        ethPrice: t.ethPrice,
        boostBalance: t.boostBalance,
        disableStake: t.disableStake,
        socialLinks: t.socialLinks,
        token: t,
      };
    });

  return result;
};

export default rewardsMapper;
