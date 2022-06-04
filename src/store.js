import { writable, get } from "svelte/store";
import {getApi, putApi, delApi, postApi} from "./service/api";
import { router } from "tinro";

function setCurrentArticlesPage() {}
function setArticles() {}
function setLoadingArticle() {}
function setArticleContent() {}
function setArticleMode() {}
function setComments() {}
function setAuth() {

    let initValues = {
        _id : '',
        email : '',
    }

    let values = {...initValues}

    const {subscribe, set, update} =  writable(values);

    const isLogin = async () => {

        try {
            const getUserInfo = await getApi({path: '/user'});
            set(getUserInfo);
        }
        catch(error) {
            auth.resetUserInfo();
            authToken.resetAuthToken();
        }
    }

    const resetUserInfo = () =>{
        const newValues = {...initValues}
        set(newValues);
    }

    const register = async (email, password) => {
        try {
            const options = {
                path: '/users',
                data: {
                    email,
                    password
                }
            }

            await postApi(options);
            alert('가입이 완료되었습니다.');
            router.goto('/login');
        }
        catch(error) {
            alert('오류가 발생했습니다. 다시 시도해 주세요.');
        }
    }

    return {
        subscribe,
        isLogin,
        resetUserInfo,
        register
    }
}
function setAuthToke() {

    const token = localStorage.getItem('authToken');

    const { subscribe, set } = writable(token);

    const login = async (email,password) => {
        try {
            const options = {
                path: '/login',
                data: {
                    email,
                    password
                }
            }

            const response  = await postApi(options);
            const token = response.authToken;

            localStorage.setItem('authToken', token);
            set(token);
            router.goto('./articles');
        }
        catch(error) {
            alert('오류가 발생했습니다. 다시 시도해 주세요.');
        }
    }

    const logout = async() => {
        try {
            const options = {
                path: '/logout'
            }
            await postApi(options);
            authToken.resetAuthToken();
        }
        catch(error) {
            alert('오류가 발생했습니다. 다시 시도해 주세요.');
        }
    }
    const resetAuthToken = () => {
        set('');
        localStorage.removeItem('authToken');
    }

    return {
        subscribe,
        login,
        logout,
        resetAuthToken
    }
}

export const currentArticlesPage = setCurrentArticlesPage();
export const articles = setArticles();
export const loadingArticles = setLoadingArticle();
export const articlePageLock = setArticleContent();
export const articleContent = setCurrentArticlesPage();
export const articleMode = setArticleMode();
export const comments = setComments();
export const auth = setAuth();
export const authToken = setAuthToke();
