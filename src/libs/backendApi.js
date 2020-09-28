import axios from "axios";
import setting from "@/settings/setting";

function buildConfig() {
    return {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
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

export default {
    authenticate,
    getSelfUser,
    getUserProfile,
    getApplications,
    getApplication,
    createApplication,
    deactivateApplication,
    getTopics
}