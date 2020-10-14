import axios from "axios";
import setting from "@/settings/setting";

function buildConfig(contentType) {
    let res = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
    if (contentType) {
        res.headers['Content-Type'] = contentType;
    }
    return res;
}

function getSelfUser() {
    return axios.get(setting.host + 'auth/users/me/', buildConfig())
}

function getUserProfile(userId) {
    return axios.get(setting.host + 'api/profile/' + userId, buildConfig())
}

function authenticate(login, password) {
    return axios.post(setting.host + 'auth/jwt/create', {
        username: login,
        password: password
    })
}

function getApplications() {
    return axios.get(setting.host + 'api/application', buildConfig())
}


function getApplication(applicationId) {
    return axios.get(setting.host + 'api/application/' + applicationId, buildConfig())   ;
}

function getApplicationPosition(id) {
    return axios.get(setting.host + "api/application/"+id+"/position", buildConfig())   ;
}

function createApplication(topicId) {
    return axios.post(setting.host + 'api/application',
        {'topic_id': topicId},
        buildConfig());
}

function deactivateApplication(applicationId) {
    return axios.put(setting.host + 'api/application/' + applicationId,
        {'is_active': false},
        buildConfig());
}

function getTopics() {
    return axios.get(setting.host + 'api/topics', buildConfig());
}

function createConclusion(applicationId, text, images, final) {
    let data = new FormData();
    data.append('imgs', JSON.stringify(images));
    data.append('cons_text', text)
    data.append('application_id', applicationId)
    data.append('final', final)
    return axios.post(setting.host +'api/img_test', data, buildConfig('multipart/form-data'));
}

function getCurrentConclusion(id) {
    console.log("Выполнение запроса... получение заключения с id")
    console.log(id)
    return axios.get(setting.host + 'api/conclusions/'+id, buildConfig())
}

export default {
    authenticate,
    getSelfUser,
    getUserProfile,
    getApplications,
    getApplication,
    createApplication,
    deactivateApplication,
    getTopics,
    createConclusion,
    getCurrentConclusion,
    getApplicationPosition
}