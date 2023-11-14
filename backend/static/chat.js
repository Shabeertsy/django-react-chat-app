console.log('working');

var mapPeers = {}
var inputUsername = document.querySelector('#username-inp')
var btnJoin = document.querySelector('#join')
var username;

const iceServers = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
            ],
        },
    ],
}


const bandwidth=75


// const rtcConfig = {
//     iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:global.stun.twilio.com:3478' }],

//     iceCandidatePoolSize: 1,
//     sdpSemantics: "unified-plan",
//     // Limit video and audio bandwidth
//     peerConnection: {
//         // Video
//         maxBitrate: 7, // 1000 kbps (1 Mbps)
//         // Audio
//         audio: {
//             maxBitrate: 64, // 64 kbps
//         },
//     },
// };




function webSocketMessage(event) {
    var parseData = JSON.parse(event.data)
    var peerUserName = parseData['peer']
    var action = parseData['action']

    if (username == peerUserName) {
        return
    }

    var receiver_channel_name = parseData['message']['receiver_channel_name']
    if (action == 'new-peer') {
        createOffer(peerUserName, receiver_channel_name)
        return;
    }
    if (action == 'new-offer') {
        var offer = parseData['message']['sdp']
        createAnswer(offer, peerUserName, receiver_channel_name)
        return;

    }
    if (action == 'new-answer') {
        var answer = parseData['message']['sdp']

        var peer = mapPeers[peerUserName][0]
        peer.setRemoteDescription(answer)
        return
    }
}



function createOffer(peerUserName, receiver_channel_name) {
    console.log('create offer');

    var peer = new RTCPeerConnection(iceServers)
    addLocalTracks(peer)
    var dc = peer.createDataChannel('channel')

    dc.addEventListener('open', () => {
        console.log('connection opened for datachannel')
    })

    dc.addEventListener('message', dcOnMessage)

    var remoteVideo = createvideo(peerUserName)
    setOnTrack(peer, remoteVideo)

    mapPeers[peerUserName] = [peer, dc]
    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectionState = peer.iceConnectionState

        if (iceConnectionState === 'failed' || iceConnectionState === 'disconnected' || iceConnectionState === "closed") {
            delete mapPeers[peerUserName]
            if (iceConnectionState != 'closed') {
                peer.close()
            }
            removeVideo(remoteVideo)
        }
    })
    console.log('action', peer.localDescription);

    const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
    };

    peer.createOffer(offerOptions).then(o => {
        o.sdp = setBandwidthConstraints(o.sdp, bandwidth);
        console.log('local discp set success', o.sdp);

        return peer.setLocalDescription(o)
    }).then(() => {
    })


    peer.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
            console.log('new ice candidate', event.candidate);
            return
        }
        sendSignal('new-offer', {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name
        })
        console.log('channel_name', receiver_channel_name)

    })

}


function setBandwidthConstraints(sdp, bandwidth) {
    let modifier = 'AS';
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
        bandwidth = (bandwidth >>> 0) * 1000;
        modifier = 'TIAS';
    }

    const lines = sdp.split('\n');
    let newSDP = '';
    let foundBandwidth = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].indexOf('b=' + modifier + ':') !== -1) {
            // Update the bandwidth line
            lines[i] = 'b=' + modifier + ':' + bandwidth;
            foundBandwidth = true;
        }
        newSDP += lines[i] + '\n';
    }
    if (!foundBandwidth) {
        newSDP = newSDP.replace(/(c=IN IP4 .*)\r\n/, '$1\r\nb=' + modifier + ':' + bandwidth + '\r\n');
    }

    return newSDP;
}



function removeVideo(video) {
    var videoWrapper = video.parentNode
    videoWrapper.parentNode.removeChild(videoWrapper)
}


function createAnswer(offer, peerUserName, receiver_channel_name) {
    console.log('create answer');
    var peer = new RTCPeerConnection(iceServers)
    addLocalTracks(peer)
    var dc = peer.createDataChannel('channel');
    peer.addEventListener('datachannel', e => {
        peer.dc = e.channel
        peer.dc.addEventListener('open', () => {
            console.log('connection opened 2')
        })

        peer.dc.addEventListener('message', dcOnMessage)

        mapPeers[peerUserName] = [peer, peer.dc]
    })


    dc.addEventListener('message', dcOnMessage)
    var remoteVideo = createvideo(peerUserName)
    setOnTrack(peer, remoteVideo)

    mapPeers[peerUserName] = [peer, dc]
    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectionState = peer.iceConnectionState

        if (iceConnectionState === 'failed' || iceConnectionState === 'disconnected' || iceConnectionState === "closed") {
            delete mapPeers[peerUserName]
            if (iceConnectionState != 'closed') {
                peer.close()
            }
            removeVideo(remoteVideo)
        }
    })

    peer.setRemoteDescription(offer).then(() => {
        console.log('remote discription set success for ,', peerUserName);

        return peer.createAnswer()

    }).then(answer => {
        console.log('answer created ')
        peer.setLocalDescription(answer)
    })


    peer.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
            console.log(' answer new ice candidate', JSON.stringify(peer, event.localDescription));
            return
        }
        sendSignal('new-answer', {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name
        })
    })

}




function createvideo(peerUserName) {
    var videoContainer = document.querySelector('#videocontainer')

    var remoteVideo = document.createElement('video')

    remoteVideo.id = peerUserName + 'video'
    remoteVideo.autoplay = true
    remoteVideo.playsInline = true

    var videoWrapper = document.createElement('div')

    remoteVideo.style.width = '300px';
    remoteVideo.style.height = '100%';

    videoWrapper.style.border = '1px solid #ccc';
    videoWrapper.style.margin = '10px';
    videoWrapper.style.borderRadius = '4px';


    videoContainer.appendChild(videoWrapper)
    videoWrapper.appendChild(remoteVideo)
    return remoteVideo

}



function setOnTrack(peer, remoteVideo) {
    var remoteStream = new MediaStream()
    console.log('remote ', remoteStream.getVideoTracks());

    remoteVideo.srcObject = remoteStream
    peer.addEventListener('track', (event) => {
        remoteStream.addTrack(event.track, remoteStream)

    })

}


var messageList = document.querySelector('#message-list')
function dcOnMessage(event) {
    var message = event.data
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(message))
    messageList.appendChild(li)
    console.log('data channel on message')


}


function addLocalTracks(peer) {
    localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream)
    })
    return
}



btnJoin.addEventListener('click', () => {
    username = inputUsername.value

    console.log('username', username);

    if (username == "") {
        return
    }

    inputUsername.value = ''
    inputUsername.disabled = true
    inputUsername.style.visibility = 'hidden'

    btnJoin.disabled = true
    btnJoin.style.visibility = 'hidden'

    var labelUsername = document.querySelector('#username')

    labelUsername.innerHTML = username

    var loc = window.location
    var wsStart = 'ws://'
    if (loc.protocol == 'https:') {
        wsStart = 'wss://'
    }

    const roomName = JSON.parse(document.getElementById('room-name').textContent)
    pathname = `${loc.pathname + roomName}`

    var endPoint = wsStart + loc.host + pathname
    console.log('end', endPoint);
    webSocket = new WebSocket(endPoint)


    webSocket.addEventListener('open', (e) => {
        console.log('connection opened');
        sendSignal('new-peer', {})

    })

    webSocket.addEventListener('message', webSocketMessage)

    webSocket.addEventListener('close', (e) => {
        console.log('connection closed');
    })


    webSocket.addEventListener('error', (e) => {
        console.log('error occured ');
    })

})


var localStream = new MediaStream();
const constraints = {
    'video': true,
    'audio': false,
}


const localVideo = document.querySelector('#local-stream')
const btnToggleAudio = document.querySelector('#audio-off')
const btnToggleVideo = document.querySelector('#video-off')


var getUserMedia = navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    localStream = stream
    localVideo.srcObject = localStream
    localVideo.muted = true
    var audioTracks = stream.getAudioTracks()
    var videoTracks = stream.getVideoTracks()

    audioTracks[0].enabled = true
    videoTracks[0].enabled = true

    btnToggleAudio.addEventListener('click', () => {
        audioTracks[0].enabled = !audioTracks[0].enabled;

        if (audioTracks[0].enabled) {
            btnToggleAudio.innerHTML = 'Audio muted'
            return
        }
        btnToggleAudio.innerHTML = 'Audio unmuted'

    })

    btnToggleVideo.addEventListener('click', () => {
        videoTracks[0].enabled = !videoTracks[0].enabled;

        if (videoTracks[0].enabled) {
            btnToggleVideo.innerHTML = 'video off'
            return
        }
        btnToggleVideo.innerHTML = 'vido on'

    })


}).catch(error => {
    console.log('error for media', error);
})



function sendSignal(action, message) {
    var jsonStr = JSON.stringify(
        {
            'message': message,
            'peer': username,
            'action': action,
        }
    )

    webSocket.send(jsonStr)
}


var sendMsg = document.querySelector('#send-msg')
var msgInput = document.querySelector('#msg-inp')


sendMsg.addEventListener('click', sendMsgOnClick)

function sendMsgOnClick() {
    console.log('dc', getDataChannels());
    var message = msgInput.value
    var li = document.createElement('li')
    li.appendChild(document.createTextNode('me : ' + message))
    messageList.appendChild(li)


    var dataChannels = getDataChannels()
    message = username + ' : ' + message

    for (index in dataChannels) {
        dataChannels[index].send(message)
    }
    msgInput.value = ''

}



function getDataChannels() {
    var dataChannels = []

    for (peerUserName in mapPeers) {
        var dataChannel = mapPeers[peerUserName][1]
        dataChannels.push(dataChannel)
    }
    return dataChannels

}