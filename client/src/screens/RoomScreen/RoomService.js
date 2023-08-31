import io from "socket.io-client";
import Peer from "simple-peer";
import {addPeer, createPeer} from "./RoomUtils";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const RoomService = {
  connectToSocketAndWebcamStream: async (token) => {
    const socket = io.connect(BASE_URL, {
      query: {
        token: token
      }
    });

    const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    return { socket, webcamStream };
  },


  setupSocketListeners: (socket, webcamStream, setPeers, screenCaptureStream, currentPeers, setMessages, roomId) => {
    socket.emit("joinRoom", roomId); //sending to the server that a user joined to a room

    //server send array of socket id's of other user of same room so that new user can connect with other user via
    //simple-peer for video transmission and message will be served using socket io
    socket.on("usersInRoom", users => { //triggered in server and here receiving it
        const tempPeers = [];
        console.log('usersInRoom', users, webcamStream);
        users.forEach(otherUserSocketId => {
          //creating connection between two user via simple-peer for video
          const peer = createPeer(otherUserSocketId, socket.id, webcamStream, socket);
          currentPeers.push({
            peerId: otherUserSocketId,
            peer
          });
          tempPeers.push({
            peerId: otherUserSocketId,
            peer
          });
        })
        setPeers(tempPeers);
      })

      //a new user joined at same room send signal,callerId(simple-peer) and stream to server and server give it to
      //us to create peer between two peer and connect
      socket.on("userJoined", payload => {
        let peer;
        if(screenCaptureStream) peer = addPeer(payload.signal, payload.callerId, screenCaptureStream, socket);
        else peer = addPeer(payload.signal, payload.callerId, webcamStream, socket);
        currentPeers.push({
          peerId: payload.callerId,
          peer
        });
        const peerObj = {
          peer,
          peerId: payload.callerId,
        };

        setPeers(users => [...users, peerObj]);
      });

      //receiving signal of other peer who is trying to connect and adding its signal at peersRef
      socket.on("takingReturnedSignal", payload => {
        const item = currentPeers.find(p => p.peerId === payload.id);
          item.peer.signal(payload.signal);
      });

      //receiving message of an user and adding this at message state
      socket.on('receiveMessage', payload => {
        setMessages(messages => [...messages, payload]);
      });

      //user left and server send its peerId to disconnect from that peer
      socket.on('userLeft', id => {
        const peerObj = currentPeers.find(p => p.peerId === id);
        if(peerObj?.peer) peerObj.peer.destroy(); //cancel connection with disconnected peer
        const peers = currentPeers.filter(p => p.peerId !== id);
        currentPeers = peers;
        setPeers(peers);
      });

      socket.on('disconnect', (payload) => {
        //destroying previous stream(webcam stream)
        const previousWebcamStream = webcamStream;
        const previousWebcamStreamTracks = previousWebcamStream.getTracks();
        previousWebcamStreamTracks.forEach(track => {
          track.stop();
        });

        //destroying previous stream(screen capture stream)
        const previousScreenCaptureStream = screenCaptureStream;
        if(previousScreenCaptureStream) {
          const previousScreenCaptureStreamTracks = previousScreenCaptureStream.getTracks();
          previousScreenCaptureStreamTracks.forEach(track => {
            track.stop();
          });
        }
      });
  },
};

export default RoomService;
