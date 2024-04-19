/* eslint-disable */
import React, { useRef, useState } from 'react';
import {updateSecondsWatched} from "../../../slices/curriculum"
import {useDispatch} from "react-redux"
interface VideoPlayerProps {
    userActivityId: string;
    secondsIn: number;
    videoUrl: string;
  }
const VideoPlayer: React.FC<VideoPlayerProps> = ({userActivityId, secondsIn, videoUrl}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [watchedSeconds, setWatchedSeconds] = useState<number>(secondsIn);
  const [startTimeInSeconds, setStartTimeInSeconds] = useState<number | ''>(secondsIn);
  const dispatch = useDispatch();
  const handleTimeUpdate = () => {
    if (videoRef.current && Math.round(videoRef.current.currentTime) !== watchedSeconds) {
      setWatchedSeconds(Math.round(videoRef.current.currentTime));
      dispatch(updateSecondsWatched(userActivityId, Math.round(videoRef.current.currentTime)) as any)
    }
  };

  React.useEffect(() => {
    if (typeof startTimeInSeconds === 'number' && startTimeInSeconds >= 0) {
        videoRef.current!.currentTime = startTimeInSeconds;
        videoRef.current!.play();
      } else {
        console.log(startTimeInSeconds)
        alert('Invalid start time.');
      }
  }, [secondsIn])
  return (
    <div>
      <video
        ref={videoRef}
        controls
        width={"100%"}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;