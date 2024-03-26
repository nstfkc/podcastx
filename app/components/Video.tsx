import Player from "react-player";
import { useEffect, useRef, useState } from "react";

const ads = [
  {
    id: "1",
    timeStamp: 5,
  },
  {
    id: "2",
    timeStamp: 10,
  },
  {
    id: "3",
    timeStamp: 30,
  },
  {
    id: "4",
    timeStamp: 60,
  },
];

export const Video = () => {
  const videoRef = useRef<Player>(null);
  const [isReady, setIsReady] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const playedSeconds = useRef<null | number>(null);
  const playedAds = useRef<string[]>([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleOnEnded = () => {
    if (showAd) {
      setShowAd(false);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <div className="container max-w-xl mx-auto py-8">
      <div className="relative w-screen md:w-[600px]">
        {showAd && (
          <button
            onClick={() => setShowAd(false)}
            className="absolute top-0 right-0 z-[100] border border-gray-100 px-4 py-2"
          >
            Skip ad
          </button>
        )}
        <Player
          width="100%"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          ref={videoRef}
          url={`/podcast/api?ad=${showAd}`}
          controls
          playing={playing}
          onReady={() => {
            if (!showAd) {
              if (playedSeconds.current) {
                videoRef.current?.seekTo(playedSeconds.current);
                setPlaying(true);
                playedSeconds.current = null;
              }
            }
          }}
          onEnded={handleOnEnded}
          onProgress={(state) => {
            const ad = ads
              .filter((ad) => !playedAds.current.includes(ad.id))
              .find((ad) => ad.timeStamp === Math.floor(state.playedSeconds));

            if (ad) {
              playedSeconds.current = state.playedSeconds;
              setShowAd(true);
              playedAds.current.push(ad.id);
            }
          }}
        />
      </div>
      <div className="px-4">
        Ads will be shown at{" "}
        {ads
          .map((ad) => {
            return `${ad.timeStamp}th`;
          })
          .join(", ")}{" "}
        seconds
        <div>Press skip button to skip the ads</div>
      </div>
    </div>
  );
};
