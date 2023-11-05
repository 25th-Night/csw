import {
    getElFromSel,
    getElsFromSel,
    getElFromId,
    makeElementHidden,
    makeElementShow,
    removeElement,
    createNode,
    appendTag,
    insertAfter,
    removeAllNode,
    getCookie,
    setFetchData,
    redirectLogin,
    imageHover,
} from './common.js';

document.addEventListener('DOMContentLoaded', function() {
    const urlBtn = getElFromId('header_url_btn');
    const jdBtn = getElFromId('header_jd_btn');
    const loginBtn = getElFromId('header_login_btn');
    const myInfoBtn = getElFromId('header_my_info_btn');

    // url, jd 버튼 마우스 오버 시 효과
    imageHover(urlBtn, '/static/img/icon/url06.png', '/static/img/icon/url05.png')
    imageHover(jdBtn, '/static/img/icon/job-post02.png', '/static/img/icon/job-post01.png')

    if (loginBtn) {
        // login 버튼 마우스 오버 시 효과
        imageHover(loginBtn, '/static/img/icon/login02.png', '/static/img/icon/login01.png')
    }

    if (myInfoBtn) {
        myInfoBtn.addEventListener('click', logout)
    
        async function logout() {
    
            const data = setFetchData("delete", {})
    
            const logout_response = await fetch('/api/user/auth', data)
    
            if(logout_response.status == 202) {
                location.href = '/'
            } else if (logout_response.status == 400) {
                console.log(logout_response);
            }
        }

        // logout 버튼 마우스 오버 시 효과
        imageHover(myInfoBtn, '/static/img/icon/user02.png', '/static/img/icon/user01.png')
    }
});


