import axios from 'axios';

// eslint-disable-next-line no-warning-comments
// TODO: Separate to @aapokiiso/fillarivahti-http-api-client

export default axios.create({
    baseURL: process.env.CAPACITY_ENPOINT_URL,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
    },
});
