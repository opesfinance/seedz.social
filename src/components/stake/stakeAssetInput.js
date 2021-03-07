const React = require('react');
// THIS COMPONENT IS NOT USED YET
import { Typography, TextField, InputAdornment } from '@material-ui/core';

const stakeAssetInput = (props) => {
  const { classes } = props; // ni recibe props???
  // const amount = state[asset.id + '_' + type];
  // let amountError = state[asset.id + '_' + type + '_error'];

  return (
    <div className={classes.valContainer} key={asset.id + '_' + type}>
      <Row>
        <Col lg='8' md='8' sm='10' xs='12'>
          {type === 'stake' && (
            <Typography
              onClick={() => {
                setAmount(
                  asset.id,
                  type,
                  asset
                    ? (
                        Math.floor(asset.balance * 1000000000) / 1000000000
                      ).toFixed(9)
                    : 0
                );
              }}
              className='pool-max-balance text-right'
            >
              {'Use Max Balance'}
            </Typography>
          )}
          {type === 'unstake' && (
            <Typography
              onClick={() => {
                setAmount(
                  asset.id,
                  type,
                  asset
                    ? (
                        Math.floor(asset.stakedBalance * 1000000000) /
                        1000000000
                      ).toFixed(9)
                    : 0
                );
              }}
              className='pool-max-balance text-right'
            >
              {'Use Max Balance'}
            </Typography>
          )}
        </Col>
      </Row>
      <Row>
        <Col lg='8' md='12' sm='12' xs='12'>
          <TextField
            disabled={loading}
            className={
              amountStakeError && fieldId === asset.id + '_' + type
                ? 'border-btn-error mb-1'
                : 'border-btn mb-1'
            }
            inputRef={(input) =>
              input &&
              fieldId === asset.id + '_' + type &&
              amountStakeError &&
              input.focus()
            }
            id={'' + asset.id + '_' + type}
            value={amount}
            error={amountError}
            onChange={onChange}
            placeholder='0.0000000'
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <Typography variant='h6'>{asset.symbol}</Typography>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment
                  position='end'
                  className={classes.inputAdornment}
                >
                  <div className={classes.assetIcon}>
                    <img
                      alt=''
                      src={require('../../assets/logos/' +
                        asset.symbol +
                        '.png')}
                      height='30px'
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </Col>

        <Col className='text-center'>
          <div
            className={
              'pool-' +
              type +
              '-button d-flex align-items-center justify-content-center'
            }
            onClick={onUnstake}
          >
            {type}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default stakeAssetInput;
