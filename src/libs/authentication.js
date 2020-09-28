import axios from "axios";

const host = 'http://127.0.0.1:8000/';
const clientPeerUrl = host + 'auth/users/me/';

export function getClientPeer(token) {
    return axios.get(clientPeerUrl, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
}