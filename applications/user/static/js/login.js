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
} from './common.js';

document.addEventListener('DOMContentLoaded', function() {

    // Email Check
    const loginEmailInput = getElFromId('login_email');

    loginEmailInput.addEventListener('input', debounce(existUser, 500));

    async function existUser() {
        const email = loginEmailInput.value;

        if (email) {
            const data = setFetchData("post", { email: email });
            const response = await fetch('/api/user/exist_email', data);

            if (response.status === 200) {
                const responseData = await response.json();
                const userExist = responseData.user_exist;
                displayPermanentErrorMessage(!userExist, "login-email", "Please check your email.")
            } else {
                console.log('API 요청 실패');
            }
        }
    }

    // Password Check
    const loginPasswordInput = getElFromId('login_password');

    loginPasswordInput.addEventListener('input', debounce(correctPassword, 500));

    async function correctPassword() {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        if (email) {
            const data = setFetchData("post", { email: email, password: password });
            const response = await fetch('/api/user/correct_pw', data);

            if (response.status === 200) {
                const responseData = await response.json();
                const passwordCheck = responseData.password_check;
                displayPermanentErrorMessage(!passwordCheck, "login-password", "Please check your password.")
            } else {
                console.log('API 요청 실패');
            }
        }
    }

    // Submit Login Form
    const loginSubmitBtn = getElFromId('login_btn_email');

    loginSubmitBtn.addEventListener('click', login)

    async function login() {
        const loginEmailInput = getElFromId('login_email');
        const loginPasswordInput = getElFromId('login_password');
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        

        if (!email) {
            displayErrorMessage('login-email', 'Please enter your email.');
            return;
        }

        if (!password) {
            displayErrorMessage('login-password', 'Please enter your password.');
            return;
        }

        const data = setFetchData('post', {
            email: email,
            password: password,
        });

        // login api 호출
        const login_response = await fetch('/api/user/auth', data);

        if (login_response.status === 200) {
            location.href = '/';
        } else if (login_response.status === 400) {
            const errorData = await login_response.json();
            console.log('errorData:', errorData);
            if (errorData) {
                if (errorData.email) {
                    displayErrorMessage('login-email', errorData.email);
                }
                if (errorData.password) {
                    displayErrorMessage('login-password', errorData.password);
                }
            }
        }
    }

    // email 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(loginEmailInput, 'Enter', login)
    
    // password 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(loginPasswordInput, 'Enter', login)

    // login submit 버튼 마우스 오버 시 효과
    imageHover(loginSubmitBtn, '/static/img/icon/submit02.png', '/static/img/icon/submit03.png')

    // find email 버튼 마우스 오버 시 효과
    const fineEmailBtn = getElFromId('find_email')
    imageHover(fineEmailBtn, '/static/img/icon/find_email04.png', '/static/img/icon/find_email03.png')
    
    // find password 버튼 마우스 오버 시 효과
    const finePwBtn = getElFromId('find_pw')
    imageHover(finePwBtn, '/static/img/icon/find_pw06.png', '/static/img/icon/find_pw05.png')

    // signup 버튼 마우스 오버 시 효과
    const signupBtn = getElFromId('signup')
    imageHover(signupBtn, '/static/img/icon/signup03.png', '/static/img/icon/signup02.png')

    // signup 버튼 클릭 시, 모달 생성
    signupBtn.addEventListener('click', openModal)
    async function openModal() {
        const signupModal = getElFromId('signup_modal');
        signupModal.classList.remove('hidden');
        loginEmailInput.value='';
        loginPasswordInput.value='';
        const signupEmailInput = getElFromId('signup_email');
        signupEmailInput.focus();
    }
});


