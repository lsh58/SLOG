import {writable, get} from 'svelte/store';
import {getApi, putApi, delApi, postApi} from './service/api';
import {router} from 'tinro';

function setCurrentArticlesPage() {
  const {subscribe, update, set} = writable(1);

  const resetPage = () => set(1);

  const increPage = () => {
    update(data => (data = data + 1));
    articles.fetchArticles();
  };

  return {
    subscribe,
    resetPage,
    increPage
  };
}
function setArticles() {
  let initValues = {
    articleList: [],
    totalPage: 0,
    menuPopup: '',
    editMode: ''
  };

  let values = {...initValues};

  const {subscribe, update, set} = writable(values);

  const fetchArticles = async () => {
    const currentPage = get(currentArticlesPage);

    try {
      let path = '/articles/${currentPage}';

      const options = {
        path
      };

      const getDatas = await getApi(options);

      const newData = {
        articleList: getDatas.articles,
        totalPage: getDatas.totalPage
      };

      update(datas => {
        const newArticles = [...datas.articleList, ...newData.articleList];

        if (currentPage === 1) {
          datas.articleList = newData.articleList;
          datas.totalPage = newData.totalPage;
        }

        datas.articleList = newArticles;
        datas.totalPage = newData.totalPage;
        loadingArticles.turnOffLoading();

        return datas;
      });
    } catch (error) {
      throw error;
    }
  };

  const resetArticles = () => {
    let resetValue = {...initValues};

    set(resetValue);

    currentArticlesPage.resetPage();

    articlePageLock.set(false);
  };

  const addArticle = async content => {
    try {
      const options = {
        path: '/article',
        data: {
          content
        }
      };

      const newArticle = await postApi(options);

      update(datas => {
        datas.articleList = [newArticle, ...datas.articleList];
        return datas;
      });

      return;
    } catch (error) {
      throw error;
    }
  };

  const openMenuPopup = _id => {
    update(datas => {
      datas.menuPopup = _id;
      return datas;
    });
  };

  const closeMenuPopup = () => {
    update(datas => {
      datas.menuPopup = '';
      return datas;
    });
  };

  const openEditModeArticle = _id => {
    articles.closeMenuPopup();

    update(datas => {
      datas.editMode = _id;
      return datas;
    });
  };

  const closeEditModeArticle = () => {
    update(datas => {
      datas.editMode = '';
      return datas;
    });
  };

  const updateArticle = async article => {
    try {
      const updateData = {
        _id: article._id,
        content: article.content
      };

      const options = {
        path: '/article',
        data: updateData
      };

      const updateArticle = await putApi(options);

      update(datas => {
        const setDatas = datas.articleList.map(article => {
          if (article._id === updateArticle._id) {
            article = updateArticle;
          }
          return article;
        });

        datas.articleList = setDatas;
        return datas;
      });

      articles.closeEditModeArticle();
      alert('수정 완료');
    } catch (error) {
      alert('수정 중에 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const deleteArticle = async _id => {
    try {
      const options = {
        path: '/article/' + _id
      };

      await delApi(options);

      update(datas => {
        const setDatas = datas.articleList.filter(
          article => article._id !== _id
        );
        datas.articleList = setDatas;
        return datas;
      });
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return {
    subscribe,
    fetchArticles,
    resetArticles,
    addArticle,
    openMenuPopup,
    closeMenuPopup,
    openEditModeArticle,
    closeEditModeArticle,
    updateArticle,
    deleteArticle
  };
}
function setLoadingArticle() {
  const {subscribe, set} = writable(false);

  const turnOnLoading = () => {
    set(true);
    articlePageLock.set(true);
  };

  const turnOffLoading = () => {
    set(false);
    articlePageLock.set(false);
  };

  return {
    subscribe,
    turnOnLoading,
    turnOffLoading
  };
}
function setArticleMode() {}
function setComments() {}
function setAuth() {
  let initValues = {
    _id: '',
    email: ''
  };

  let values = {...initValues};

  const {subscribe, set, update} = writable(values);

  const isLogin = async () => {
    try {
      const getUserInfo = await getApi({path: '/user'});
      set(getUserInfo);
    } catch (error) {
      auth.resetUserInfo();
      authToken.resetAuthToken();
    }
  };

  const resetUserInfo = () => {
    const newValues = {...initValues};
    set(newValues);
  };

  const register = async (email, password) => {
    try {
      const options = {
        path: '/users',
        data: {
          email,
          password
        }
      };

      await postApi(options);
      alert('가입이 완료되었습니다.');
      router.goto('/login');
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return {
    subscribe,
    isLogin,
    resetUserInfo,
    register
  };
}
function setAuthToke() {
  const token = localStorage.getItem('authToken');

  const {subscribe, set} = writable(token);

  const login = async (email, password) => {
    try {
      const options = {
        path: '/login',
        data: {
          email,
          password
        }
      };

      const response = await postApi(options);
      const token = response.authToken;

      localStorage.setItem('authToken', token);
      set(token);
      router.goto('./articles');
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const logout = async () => {
    try {
      const options = {
        path: '/logout'
      };
      await postApi(options);
      authToken.resetAuthToken();
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };
  const resetAuthToken = () => {
    set('');
    localStorage.removeItem('authToken');
  };

  return {
    subscribe,
    login,
    logout,
    resetAuthToken
  };
}

export const currentArticlesPage = setCurrentArticlesPage();
export const articles = setArticles();
export const loadingArticles = setLoadingArticle();
export const articlePageLock = writable(false);
export const articleContent = setCurrentArticlesPage();
export const articleMode = setArticleMode();
export const comments = setComments();
export const auth = setAuth();
export const authToken = setAuthToke();
