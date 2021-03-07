const styles = (theme) => ({
  root: {
    flex: 1,
    height: 'auto',
    display: 'flex',
    position: 'relative',
  },
  contentContainer: {
    margin: 'auto',
    textAlign: 'center',
    padding: '5px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  cardContainer: {
    marginTop: '60px',
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  unlockCard: {
    padding: '24px',
  },
  buttonText: {
    marginLeft: '12px',
    fontWeight: '700',
  },
  instruction: {
    maxWidth: '400px',
    marginBottom: '32px',
    marginTop: '32px',
  },
  actionButton: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '3rem',
    border: '1px solid #E1E1E1',
    fontWeight: 100,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    },
  },
  connect: {
    width: '100%',
  },
  closeIcon: {
    position: 'fixed',
    right: '12px',
    top: '12px',
    cursor: 'pointer',
  },
});

export default styles;
