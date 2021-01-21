import React, { useEffect, useRef } from 'react';

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
        //eslint-disable-next-line
    }, []);

    return (
        <video playsInline autoPlay ref={ref} />
    );
}

export default Video;
