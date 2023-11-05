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
    debounce,
    displayErrorMessage,
    displayPermanentErrorMessage,
    setKeyForFunction,
    getShortenerURL,
} from './common.js';

document.addEventListener('DOMContentLoaded', function() {

    // SHortened Url Service URL
    const shortenedUrl = getShortenerURL();
    console.log("shortenedUrl", shortenedUrl);

    // Submit Login Form
    const makeSubmitBtn = getElFromId('make_btn_url');

    makeSubmitBtn.addEventListener('click', make)
    setKeyForFunction(makeSubmitBtn, 'Enter', make)

    async function make() {
        const makeUrlInput = getElFromId('url_target');
        const makeNicknameInput = getElFromId('url_nickname');
        const makeExpireInput = getElFromId('url_expire');
        const makeAccessInput = getElFromId('url_access');
        const url = makeUrlInput.value;
        const nickname = makeNicknameInput.value;
        const expire = makeExpireInput.value;
        const access = makeAccessInput.value;
        
        if (!url) {
            displayErrorMessage('make-url', 'Please enter your email.');
            return;
        }
        

        const data = setFetchData(
            'post', 
            {
                target_url: url,
                nick_name: nickname,
                expire_at: expire,
                access: access,
            }
        );

        // shortened_url api 호출
        const make_url_response = await fetch(`${shortenedUrl}/shortener/`, data);

        if (make_url_response.status === 200) {
            makeUrlInput.value='';
            makeNicknameInput.value='';
            makeExpireInput.value='';
            makeAccessInput.value='';
        } else if (make_url_response.status === 400) {
            const errorData = await make_url_response.json();
            if (errorData) {
                displayErrorMessage('make-url', errorData);
            }
        }
    }

    async function refreshUrlList() {
        const urlList = getElFromId('url_list');

        const data = setFetchData('get', { });

        const url_list_response = await fetch(`${shortenedUrl}/shortener/`, data);
        if (url_list_response.status === 200) {
            console.log('tomorrow')
        } else if (url_list_response.status === 400) {
            const errorData = await url_list_response.json();
            if (errorData) {
                displayErrorMessage('list-url', errorData);
            }
        }
    }

    // // email 입력 칸에서 Enter 키 입력 시 폼 제출
    // setKeyForFunction(loginEmailInput, 'Enter', login)
    
    // // password 입력 칸에서 Enter 키 입력 시 폼 제출
    // setKeyForFunction(loginPasswordInput, 'Enter', login)

    // make submit 버튼 마우스 오버 시 효과
    imageHover(makeSubmitBtn, '/static/img/icon/submit02.png', '/static/img/icon/submit01.png')

    // // find email 버튼 마우스 오버 시 효과
    // const fineEmailBtn = getElFromId('find_email')
    // imageHover(fineEmailBtn, '/static/img/icon/find_email04.png', '/static/img/icon/find_email03.png')
    
    // // find password 버튼 마우스 오버 시 효과
    // const finePwBtn = getElFromId('find_pw')
    // imageHover(finePwBtn, '/static/img/icon/find_pw06.png', '/static/img/icon/find_pw05.png')

    // // signup 버튼 마우스 오버 시 효과
    // const signupBtn = getElFromId('signup')
    // imageHover(signupBtn, '/static/img/icon/signup03.png', '/static/img/icon/signup02.png')

    // // signup 버튼 클릭 시, 모달 생성
    // signupBtn.addEventListener('click', openModal)
    // setKeyForFunction(signupBtn, "Enter", openModal)

    // async function openModal() {
    //     const signupModal = getElFromId('signup_modal');
    //     signupModal.classList.remove('hidden');
    //     loginEmailInput.value='';
    //     loginPasswordInput.value='';
    //     const signupEmailInput = getElFromId('signup_email');
    //     signupEmailInput.focus();
    // }

    const fp = flatpickr('#url_expire', {
        minDate: "today",
        dateFormat: "Y-m-d",
        static: true,
    });

    const input = getElFromId('url_expire');
    const svg = getElFromId('clearDate');

    if (svg) {
        svg.addEventListener('click', function () {
            input.value = '';
            svg.classList.add('hidden');
        });
    }

    input.addEventListener('input', function () {
        if (input.value) {
            svg.classList.remove('hidden');
        } else {
            svg.classList.add('hidden');
        }
    });
});
