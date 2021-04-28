import React, { useEffect } from 'react';

const ImportScript = () => {
  const style = localStorage.getItem('theme');
  const tvkTheme = style && style == 'dark-mode' ? 'dark' : 'light';
  useEffect(() => {
    const script = document.createElement('script');
    // script.setAttribute('src', 'https://s3.tradingview.com/tv.js');
    script.src = 'https://s3.tradingview.com/tv.js';

    script.async = true;
    script.type = 'text/javascript';

    script.onload = () => {
      new window.TradingView.MediumWidget({
        symbols: [
          ['WPE/USD', '1/UNISWAP:WETHWPE*BINANCE:ETHUSDT|3M'],
          ['ETH', 'BINANCE:ETHUSDT|12M'],
          ['YFU/USD', 'UNISWAP:YFUWPE/UNISWAP:WETHWPE*BINANCE:ETHUSDT|3M'],
          ['STR/USD', 'UNISWAP:STRWPE/UNISWAP:WETHWPE*BINANCE:ETHUSDT|3M'],
          ['PIXEL/USD', 'UNISWAP:PIXELWPE/UNISWAP:WETHWPE*BINANCE:ETHUSDT|3M'],
          ['LIFT/USD', 'UNISWAP:LIFTWPE/UNISWAP:WETHWPE*BINANCE:ETHUSDT|3M'],
        ],
        chartOnly: false,
        width: '100%',
        height: '100%',
        locale: 'en',
        colorTheme: tvkTheme == 'light' ? 'light' : 'dark',
        gridLineColor: '#2A2E39',
        trendLineColor: '#1976D2',
        fontColor: '#787B86',
        underLineColor: 'rgba(55, 166, 239, 0.15)',
        isTransparent: false,
        autosize: true,
        container_id: 'tradingview_5039e',
      });
    };

    // document.body.appendChild(script);
    document.getElementsByTagName('head')[0].appendChild(script);
    return () => {
      // document.body.removeChild(script);
      document.getElementsByTagName('head')[0].appendChild(script);
    };
  }, []);
  // <script
  //   type='text/javascript'
  //   src='https://s3.tradingview.com/tv.js'
  // ></script>
  return (
    <div className='tradingview-widget-container'>
      <div id='tradingview_5039e'></div>
      <div className='tradingview-widget-copyright'>
        <a href='https://www.tradingview.com/' rel='noopener' target='_blank'>
          <span className='blue-text'>Bees Social</span>
        </a>{' '}
        by TradingView
      </div>
    </div>
  );
};
export default ImportScript;
