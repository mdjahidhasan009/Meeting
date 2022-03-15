import React, { useEffect, useRef, useState, createRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useHistory } from "react-router-dom";
// import M from "materialize-css";

import Video from './Video';

const Room = (props) => {
    const [ peers, setPeers ] = useState([]); //state for rendering and also have stream of peers
    const socketRef = useRef(); //own socket
    const userVideo = useRef(); //for display own video
    const webcamStream = useRef(); //own webcam stream
    const messageRef = createRef(); //message input
    const peersRef = useRef([]); //collection of peers who are currently connect to a room
    const screenCaptureStream = useRef(); //screen capture stream
    const roomId = props.match.params.roomId; //joined room id
    const [ isVideoMuted, setIsVideoMuted ] = useState(false);
    const [ isAudioMuted, setIsAudioMuted ] = useState(false);
    const [ messages, setMessages ] = useState([]); //all messages state after joining the room
    const history = useHistory();

    useEffect(() => {
        connectToSocketAndWebcamStream().then(() => {
            socketRef.current.emit("joinRoom", roomId); //sending to the server that an user joined to a room
            //server send array of socket id of other user of same room so that new user can connect with other user via
            //simple-peer for video transmission and message will be served using socket io
            socketRef.current.on("usersInRoom", users => {
                const peers = [];
                users.forEach(otherUserSocketId => {
                    //creating connection between two user via simple-peer for video
                    const peer = createPeer(otherUserSocketId, socketRef.current.id, webcamStream.current);
                    peersRef.current.push({
                        peerId: otherUserSocketId,
                        peer
                    });
                    peers.push({
                        peerId: otherUserSocketId,
                        peer
                    });
                })
                setPeers(peers);
            })

            //a new user joined at same room send signal,callerId(simple-peer) and stream to server and server give it to
            //us to create peer between two peer and connect
            socketRef.current.on("userJoined", payload => {
                let peer;
                if(screenCaptureStream.current) peer = addPeer(payload.signal, payload.callerId, screenCaptureStream.current);
                else peer = addPeer(payload.signal, payload.callerId, webcamStream.current);
                peersRef.current.push({
                    peerId: payload.callerId,
                    peer
                });
                const peerObj = {
                    peer,
                    peerId: payload.callerId
                };

                setPeers(users => [...users, peerObj]);
            });

            //receiving signal of other peer who is trying to connect and adding its signal at peersRef
            socketRef.current.on("takingReturnedSignal", payload => {
                const item = peersRef.current.find(p => p.peerId === payload.id);
                item.peer.signal(payload.signal);
            });

            //receiving message of an user and adding this at message state
            socketRef.current.on('receiveMessage', payload => {
                setMessages(messages => [...messages, payload]);
            });

            //user left and server send its peerId to disconnect from that peer
            socketRef.current.on('userLeft', id => {
                const peerObj = peersRef.current.find(p => p.peerId === id);
                if(peerObj) peerObj.peer.destroy(); //cancel connection with disconnected peer
                const peers = peersRef.current.filter(p => p.peerId !== id);
                peersRef.current = peers;
                setPeers(peers);
            });
        });
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        //checking is user logged in or not(if user has no token means not logged in)
        // const token = localStorage.getItem('Token');
        // if(!token) {
        //     M.toast({ html: 'Login first', classes:'red'});
        //     history.push('/login');
        // }
        //eslint-disable-next-line
    }, []);

    const connectToSocketAndWebcamStream = async() => {
        //connecting to server using socket
        socketRef.current = io.connect(process.env.REACT_APP_BASE_URL, {
            query: {
                token: localStorage.getItem('Token')
            }
        });
        webcamStream.current = await getWebcamStream();
        userVideo.current.srcObject = webcamStream.current;
        if(!webcamStream.current.getAudioTracks()[0].enabled) webcamStream.current.getAudioTracks()[0].enabled = true;
    }

    //taking video(webcam) and audio of device
    const getWebcamStream = async () => {
        return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }

    function createPeer(userIdToSendSignal, callerId, stream) {
        //if initiator is true then newly created peer will send a signal to other peer it those two peers accept signal
        // then connection will be established between those two peers
        //trickle for enable/disable trickle ICE candidates
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: "stun:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683"
                    },
                    {
                        urls: "turn:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683"
                    }
                ]
            },
            stream //My own stream of video and audio
        });

        //sending signal to second peer and if that receive than other(second) peer also will send an signal to this peer
        peer.on("signal", signal => {
            socketRef.current.emit("sendingSignal", { userIdToSendSignal: userIdToSendSignal, callerId: callerId, signal });
        })
        return peer;
    }

    //after receiving of others user's signal adding to peer array and returning own signal to other user
    function addPeer(incomingSignal, callerId, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });

        //other peer give its signal in signal object and this peer returning its own signal
        peer.on("signal", signal => {
            socketRef.current.emit("returningSignal", { signal, callerId: callerId });
        });
        peer.signal(incomingSignal);
        return peer;
    }

    const shareScreen = async () => {
        //getting screen video
        screenCaptureStream.current = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
        const screenCaptureVideoStreamTrack = screenCaptureStream.current.getVideoTracks()[0]; //taking video track of stream
        //replacing video track of each peer connected with getDisplayMedia video track and audio will remain as it is
        //as all browser does not return audio track with getDisplayMedia
        // peers.map(peer => {
        //     peer.peer.replaceTrack(
        //         peer.peer.streams[0].getVideoTracks()[0],
        //         screenCaptureVideoStreamTrack,
        //         peer.peer.streams[0]
        //     )
        // })

        peers.map(peer => (
            peer.peer.replaceTrack(
                peer.peer.streams[0].getVideoTracks()[0],
                screenCaptureVideoStreamTrack,
                peer.peer.streams[0]
            )
        ))
        //destroying previous stream video track
        const previousWebcamStream = userVideo.current.srcObject;
        const previousWebcamStreamTracks = previousWebcamStream.getTracks();
        previousWebcamStreamTracks.forEach(function(track) {
            if(track.kind === 'video')  track.stop();
        });
        userVideo.current.srcObject = screenCaptureStream.current;

        //When user will stop share then own video(of webcam) will appears
        screenCaptureStream.current.getVideoTracks()[0].addEventListener('ended', () => {
            startWebCamVideo();
            setIsAudioMuted(false);
            setIsVideoMuted(false);
        });
    }

    const startWebCamVideo = async () => {
        //destroying previous stream(webcam stream)
        const previousWebcamStream = webcamStream.current;
        const previousWebcamStreamTracks = previousWebcamStream.getTracks();
        previousWebcamStreamTracks.forEach(track => {
            track.stop();
        });
        //destroying previous stream(screen capture stream)
        const previousScreenCaptureStream = screenCaptureStream.current;
        const previousScreenCaptureStreamTracks = previousScreenCaptureStream.getTracks();
        previousScreenCaptureStreamTracks.forEach(track => {
            track.stop();
        });

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
        userVideo.current.srcObject = newWebcamStream;
        webcamStream.current = newWebcamStream;
        screenCaptureStream.current = null;
    }

    const sendMessage = (e) => {
        e.preventDefault();
        //sending message text with roomId to sever it will send message along other data to all connected user of current room
        if(socketRef.current) {
            socketRef.current.emit('sendMessage', {
                roomId,
                message: messageRef.current.value
            })
            messageRef.current.value = "";
        }
    }

    //Mute or unmute audio
    const muteOrUnmuteAudio = () => {
        if(!isAudioMuted) {
            webcamStream.current.getAudioTracks()[0].enabled = false;
            setIsAudioMuted(true);
        } else {
            webcamStream.current.getAudioTracks()[0].enabled = true;
            setIsAudioMuted(false);
        }
    }

    //stop or play video
    const playOrStopVideo = () => {
        if(!isVideoMuted) {
            userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
            setIsVideoMuted(true);
        } else {
            userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
            setIsVideoMuted(false);
        }
    }

    const leaveMeeting = () => {
        history.push('/');
    };

    return (
        <>
            <div className="room row">
                <div className="col s10 p0">
                    <div className="main__videos">
                        <div id="video-grid">
                            <video muted ref={userVideo} autoPlay playsInline />
                                {peers.map((peer) => (
                                    <Video controls key={peer.peerId} peer={peer} />
                                ))}
                        </div>
                    </div>
                    <div className="main__controls">
                        <div className="main__controls__block">
                            <div onClick={muteOrUnmuteAudio} className="main__controls__button main__mute__button">
                                {isAudioMuted
                                    ? <i className="unmute fas fa-microphone-slash" />
                                    : <i className="fas fa-microphone" />
                                }
                                {isAudioMuted
                                    ? <span>Unmute</span>
                                    : <span>Mute</span>
                                }
                            </div>
                            <div onClick={playOrStopVideo} className="main__controls__button main__video-grid_button">
                                {isVideoMuted
                                    ? <i className="stop fas fa-video-slash" />
                                    : <i className="fas fa-video" />
                                }
                                {isVideoMuted
                                    ? <span>Play Video</span>
                                    : <span>Stop Video</span>
                                }
                            </div>
                        </div>
                        <div onClick={shareScreen} className="main__controls__block">
                            <div className="main__controls__button">
                                <i className="fas fa-shield-alt" />
                                <span>Share Screen</span>
                            </div>
                        </div>
                        <div onClick={leaveMeeting} className="main__controls__block">
                            <div className="main__controls__button">
                                <span className="leave_meeting">Leave Meeting</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s2 p0 main__right">
                    <div className="main__header">
                        <h6>Chat</h6>
                    </div>
                    <div className="main__chat__window">
                        <ul className="messages">
                            {messages.map((message, index) => (
                                <p key={index}>{message.name}({message.username}):{message.message}</p>
                            ))}
                        </ul>
                    </div>
                    <form  onSubmit={sendMessage} className="main__message__container">
                        <input ref={messageRef} id="chat_message" type="text" placeholder="Type message here..." />
                        <i onClick={sendMessage} className="fa fa-paper-plane" />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Room;
