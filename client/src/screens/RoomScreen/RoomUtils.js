import Peer from "simple-peer";

export const addPeer = (incomingSignal, callerId, stream, socket) => {
  const peer = new Peer({
                          initiator: false,
                          trickle: false,
                          stream
                        });

  //other peer give its signal in signal object and this peer returning its own signal
  peer.on("signal", signal => {
    socket.emit("returningSignal", { signal, callerId: callerId });
  });
  peer.signal(incomingSignal);
  return peer;
};

export const startWebCamVideo = async (peers, userVideo, webcamStream, screenCaptureStream) => {
  const newWebcamStream = await getWebcamStream(); //getting webcam video and audio
  const videoStreamTrack = newWebcamStream.getVideoTracks()[0]; //taking video track of stream
  const audioStreamTrack = newWebcamStream.getAudioTracks()[0]; //taking audio track of stream
  //replacing all video track of all peer connected to this peer
  peers.map(peer => {
    //replacing video track
    peer.peer.replaceTrack(
        peer.peer.streams[0].getVideoTracks()[0],
        videoStreamTrack,
        peer.peer.streams[0]
    );
    //replacing audio track
    peer.peer.replaceTrack(
        peer.peer.streams[0].getAudioTracks()[0],
        audioStreamTrack,
        peer.peer.streams[0]
    );
  });
  userVideo.srcObject = newWebcamStream;
  webcamStream = newWebcamStream;
  screenCaptureStream = null;
};

export const shareScreen = async (peers, screenCaptureStream, webcamStream, currentPeers, userVideo, setIsAudioMuted, setIsVideoMuted) => {
  //getting screen video
  screenCaptureStream.current = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
  //taking video track of stream
  const screenCaptureVideoStreamTrack = screenCaptureStream.current.getVideoTracks()[0];
debugger
  //replacing video track of each peer connected with getDisplayMedia video track and audio will remain as it is
  //as all browser does not return audio track with getDisplayMedia
  currentPeers.map(peer => (
      peer.peer.replaceTrack(
          peer.peer.streams[0].getVideoTracks()[0],
          screenCaptureVideoStreamTrack,
          peer.peer.streams[0]
      )
  ))
  //destroying previous stream video track
  const previousWebcamStream = userVideo.srcObject;
  const previousWebcamStreamTracks = previousWebcamStream.getTracks();
  previousWebcamStreamTracks.forEach(function(track) {
    if(track.kind === 'video')  track.stop();
  });
  userVideo.srcObject = screenCaptureStream.current;

  //When user will stop share then own video(of webcam) will appears
  screenCaptureStream.current.getVideoTracks()[0].addEventListener('ended', () => {
    startWebCamVideo(peers, userVideo, webcamStream, screenCaptureStream);
    setIsAudioMuted(false);
    setIsVideoMuted(false);
  });
}

export const muteOrUnmuteAudio = (webcamStream, isAudioMuted, setIsAudioMuted) => {
  if(!webcamStream) return;

  if(!isAudioMuted) {
    webcamStream.getAudioTracks()[0].enabled = false;
    setIsAudioMuted(true);
  } else {
    webcamStream.getAudioTracks()[0].enabled = true;
    setIsAudioMuted(false);
  }
};

export const playOrStopVideo = (userVideo, isVideoMuted, setIsVideoMuted) => {
  if(!userVideo) return;

  if(!isVideoMuted) {
    userVideo.getVideoTracks()[0].enabled = false;
    setIsVideoMuted(true);
  } else {
    userVideo.getVideoTracks()[0].enabled = true;
    setIsVideoMuted(false);
  }
};

export const sendMessage = (e, socket, roomId, message) => {
  e.preventDefault();
  //sending message text with roomId to sever it will send message along other data to all connected user of current room
  if(socket) {
  socket.emit('sendMessage', {
    roomId,
    message: message.value
  })
  message.value = "";
}
}

export const createPeer = (userIdToSendSignal, mySocketId, stream, socket) => {
  //if initiator is true then newly created peer will send a signal to other peer it those two peers accept signal
  // then connection will be established between those two peers
  //trickle for enable/disable trickle ICE candidates
  const peer = new Peer({
    initiator: true,
    trickle: false,
    config: {
      iceServers: [
        {
          urls: process.env.REACT_APP_GOOGLE_STUN_SERVER
        },
        {
          urls: process.env.REACT_APP_TURN_SERVER1_NAME,
          username: process.env.REACT_APP_TURN_SERVER1_USERNAME,
          credential: process.env.REACT_APP_TURN_SERVER1_PASSWORD
        },
        {
          urls: process.env.REACT_APP_TURN_SERVER2_NAME,
          username: process.env.REACT_APP_TURN_SERVER2_USERNAME,
          credential: process.env.REACT_APP_TURN_SERVER2_PASSWORD
        }
      ]
    },
    stream //My own stream of video and audio
  });

  //sending signal to second peer and if that receive than other(second) peer also will send an signal to this peer
  peer.on("signal", signal => {
    socket.emit("sendingSignal", { userIdToSendSignal: userIdToSendSignal, callerId: mySocketId, signal });
  })
  return peer;
};

export const getWebcamStream = async () => {
  return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
};