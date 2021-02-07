const styles = (theme) => ({
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.2rem',
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px',
    marginBottom: '5px',
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer',
  },

  voteLockMessage: {
    margin: '20px',
  },
});

export default styles;
