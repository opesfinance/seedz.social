import React, { useEffect } from 'react';

const ImportScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://s3.tradingview.com/tv.js');
    // script.src = 'https://s3.tradingview.com/tv.js';
    // script.async = true;
    script.addEventListener('load', () => {
      new window.TradingView.widget({
        width: 980,
        height: 610,
        symbol: 'UNISWAP:YFUWPE',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_b8cc9',
        autosize: true,
      });
    });

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  // <script
  //   type='text/javascript'
  //   src='https://s3.tradingview.com/tv.js'
  // ></script>
  return (
    <div className='tradingview-widget-container'>
      <div id='tradingview_b8cc9'></div>
      <div className='tradingview-widget-copyright'>
        <a
          href='https://www.tradingview.com/symbols/YFUWPE/?exchange=UNISWAP'
          rel='noopener'
          target='_blank'
        >
          <span className='blue-text'>YFUWPE Chart</span>
        </a>{' '}
        by TradingView
      </div>
    </div>
  );
};
export default ImportScript;
