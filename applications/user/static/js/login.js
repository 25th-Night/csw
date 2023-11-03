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
    function debounce(func, delay) {
        let timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
    }

    // Email Check
    const emailInput = getElFromId('login_email');

    emailInput.addEventListener('input', debounce(checkUser, 500));

    async function checkUser() {
        const email = emailInput.value;

        if (email) {
            const data = setFetchData("post", { email: email });
            const response = await fetch('/api/user/check_email', data);

            if (response.status === 200) {
                const responseData = await response.json();
                const userExist = responseData.user_exist;
                const emailError = getElFromSel(".email-error");

                if (userExist) {
                    emailError.classList.add("hidden");
                    emailError.textContent = "";
                } else {
                    emailError.classList.remove("hidden");
                    emailError.textContent = "Please check your email.";
                }
            } else {
                console.log('API 요청 실패');
            }
        }
    }

    // Password Check
    const passwordInput = getElFromId('login_password');

    passwordInput.addEventListener('input', debounce(checkPassword, 500));

    async function checkPassword() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email) {
            const data = setFetchData("post", { email: email, password: password });
            const response = await fetch('/api/user/check_pw', data);

            if (response.status === 200) {
                const responseData = await response.json();
                const passwordCheck = responseData.password_check;
                const passwordError = getElFromSel(".password-error");

                if (passwordCheck) {
                    passwordError.classList.add("hidden");
                    passwordError.textContent = "";
                } else {
                    passwordError.classList.remove("hidden");
                    passwordError.textContent = "Please check your password.";
                }
            } else {
                console.log('API 요청 실패');
            }
        }
    }

    // Submit Login Form
    const loginSubmitBtn = getElFromId('login_btn_email');

    loginSubmitBtn.addEventListener('click', login)

    async function login() {
        const emailInput = getElFromId('login_email');
        const passwordInput = getElFromId('login_password');
        const email = emailInput.value;
        const password = passwordInput.value;

        // 입력 필드의 값이 없을 경우 에러 메시지 표시
        const displayErrorMessage = (inputField, errorMessage) => {
            const errorElement = getElFromSel(`.${inputField}-error`);
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('hidden');
            setTimeout(() => {
                errorElement.classList.add('hidden');
                errorElement.textContent = '';
            }, 3000);
        };

        if (!email) {
            displayErrorMessage('email', 'Please enter your email.');
            return;
        }

        if (!password) {
            displayErrorMessage('password', 'Please enter your password.');
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
                    displayErrorMessage('email', errorData.email);
                }
                if (errorData.password) {
                    displayErrorMessage('password', errorData.password);
                }
            }
        }
    }

    // login submit 버튼 마우스 오버 시 효과
    imageHover(loginSubmitBtn, '/static/img/icon/submit02.png', '/static/img/icon/submit01.png')
});


