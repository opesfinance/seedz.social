import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import Video from '../utils/video';

import './whaletank.scss';

const WhaleTank = (props) => {
  const [videos, setVideos] = useState([]);
  const [channelName, setChannelName] = useState();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCfQoY9QU7bsgb94NuTf_DwA`
        ).then((response) => response.json());

        if (!data.items) throw new Error();

        setVideos(data.items);
        setChannelName(data.items[0].author);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div>
      <div className='pageHeader my-auto'>Whale Tank</div>

      <div className='mt-5 whaletank-wrapper'>
        {/* <img
          alt=''
          src={require('../../assets/whaletank-comingsoon.png')}
          className='img-fluid'
        /> */}
        <div className='ml-sm-5 p-sm-5 ml-5 p-1 pb-5'>
          <div className='row'>
            <div className='col-md-11 col-sm-11 col-xs-12'>
              <h1>{channelName}</h1>
              <p>
                Venture capitalists take on the risk of funding high-risk
                start-ups in the hopes that some of the firms they sustain will
                certainly become successful. Due to the fact that startups deal
                with high uncertainty, VC investments have high rates of
                failing. The start-ups are normally based upon an ingenious
                innovation or company model and they are generally from the high
                modern technology markets.
              </p>
            </div>
          </div>
          <div className='videos'>
            {videos.map((video) => (
              <Video key={video.guid} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withNamespaces()(withRouter(WhaleTank));
