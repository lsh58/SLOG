import { writable, get } from "svelte/store";
import {getApi, putApi, delApi, postApi} from "./service/api";
import { router } from "tinro";

function setCurrentArticlesPage() {}
function setArticles() {}
function setLoadingArticle() {}
function setArticleContent() {}
function setArticleMode() {}
function setComments() {}
function setAuth() {}
function setAuthToke() {}

export const currentArticlesPage = setCurrentArticlesPage();
export const articles = setArticles();
export const loadingArticles = setLoadingArticle();
export const articlePageLock = setArticleContent();
export const articleContent = setCurrentArticlesPage();
export const articleMode = setArticleMode();
export const comments = setComments();
export const auth = setAuth();
export const authToken = setAuthToke();
