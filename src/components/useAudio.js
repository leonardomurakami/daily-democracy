import { useState } from 'react';

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));

  const play = () => {
    audio.currentTime = 0;
    audio.play();
  };

  return play;
};

export default useAudio;
