import axios from "axios";

const send = async ({method='', path='', data={},} = {}) => {

    const commonUrl = "http://localhost:3000/api";

    const url = commonUrl + path;

    const getToken = localStorage.getItem('authToken');

    const headers = {
        'content-Type' : 'application/json',
        'x-Auth-Token' : getToken,
    }

    const options = {
        method,
        url,
        headers,
        data
    }

    try {
        const response = await axios(options);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

const getApi = ({path='',} = {}) => {
    return send({method: 'GET', path});
}
const putApi = ({path='', data={}} = {}) => {
    return send({method: 'PUT', path});
}
const postApi = ({path='', data={}} = {}) => {
    return send({method: 'PSOT', path});
}
const delApi = ({path='', data={}} = {}) => {
    return send({method: 'DELETE', path});
}

export {
    getApi,
    putApi,
    postApi,
    delApi,
}