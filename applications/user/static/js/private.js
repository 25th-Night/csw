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
    createNewElement,
    setElementText,
    addChildToTarget,
    setAttributeToElement,
    removeAttributeToElement,
    copyTextToClipboard,
    popUpConfirm,
    formatDateToCustomFormat,
} from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    // Shortener 서비스 URL
    const ShortenerUrl = getShortenerURL();

    // URL PATH 링크 추가
    const urlPathDiv = getElFromSel(".url-path");
    urlPathDiv.addEventListener("click", () => {
        const url = `${ShortenerUrl}${urlPath}`;
        copyTextToClipboard(url);
    });

    // login 버튼
    const loginBtn = getElFromId("login_btn");

    // login 버튼 클릭 - 모달 생성
    if (loginBtn) {
        loginBtn.addEventListener("click", openModal);
        imageHover(loginBtn, "/static/img/icon/login02.png", "/static/img/icon/login03.png");
    }

    async function openModal() {
        const loginModal = getElFromId("login_modal");
        loginModal.classList.remove("hidden");
        const loginEmailInput = getElFromId("login_email");
        const loginPasswordInput = getElFromId("login_password");
        loginEmailInput.value = "";
        loginPasswordInput.value = "";
        loginEmailInput.focus();
    }

    // Email Check
    const loginEmailInput = getElFromId("login_email");

    if (loginEmailInput) {
        loginEmailInput.addEventListener("input", debounce(existUser, 500));
        setKeyForFunction(loginEmailInput, "Enter", login);
    }

    async function existUser() {
        const loginEmailInput = getElFromId("login_email");
        const email = loginEmailInput.value;

        if (email) {
            const data = setFetchData("post", { email: email });
            const response = await fetch("/api/user/exist_email", data);

            if (response.status === 200) {
                const responseData = await response.json();
                const userExist = responseData.user_exist;
                displayPermanentErrorMessage(!userExist, "login-email", "Please check your email.");
            } else {
                console.log("API request failed");
            }
        }
    }

    // Password Check
    const loginPasswordInput = getElFromId("login_password");

    if (loginPasswordInput) {
        loginPasswordInput.addEventListener("input", debounce(correctPassword, 500));
        setKeyForFunction(loginPasswordInput, "Enter", login);
    }

    async function correctPassword() {
        const loginEmailInput = getElFromId("login_email");
        const loginPasswordInput = getElFromId("login_password");
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        if (email) {
            const data = setFetchData("post", { email: email, password: password });
            const response = await fetch("/api/user/correct_pw", data);

            if (response.status === 200) {
                const responseData = await response.json();
                const passwordCheck = responseData.password_check;
                displayPermanentErrorMessage(passwordCheck, "login-password", passwordCheck);
            } else {
                console.log("API request failed");
            }
        }
    }

    // Submit Login Form
    const loginSubmitBtn = getElFromId("login_btn_email");

    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener("click", login);
        setKeyForFunction(loginSubmitBtn, "Enter", login);
        imageHover(
            loginSubmitBtn,
            "/static/img/icon/submit02.png",
            "/static/img/icon/submit03.png"
        );
    }

    async function login() {
        const loginEmailInput = getElFromId("login_email");
        const loginPasswordInput = getElFromId("login_password");
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        if (!email) {
            displayErrorMessage("login-email", "Please enter your email.");
            return;
        }

        if (!password) {
            displayErrorMessage("login-password", "Please enter your password.");
            return;
        }

        const data = setFetchData("post", {
            email: email,
            password: password,
        });

        // login api 호출
        const login_response = await fetch("/api/user/auth", data);

        if (login_response.status === 200) {
            location.reload();
        } else if (login_response.status === 400) {
            const errorData = await login_response.json();
            console.log("errorData:", errorData);
            if (errorData) {
                if (errorData.email) {
                    displayErrorMessage("login-email", errorData.email);
                }
                if (errorData.password) {
                    displayErrorMessage("login-password", errorData.password);
                }
            }
        }
    }

    // x 버튼 클릭 시 모달창 닫기
    const closeModalBtn = getElFromId("login_btn_close");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    // Esc 입력 시 모달창 닫기
    setKeyForFunction(window, "Escape", closeModal);

    async function closeModal() {
        const loginModal = getElFromId("login_modal");
        loginModal.classList.add("hidden");
        const loginEmailInput = getElFromId("login_email");
        const loginPasswordInput = getElFromId("login_password");
        loginEmailInput.value = "";
        loginPasswordInput.value = "";

        const accessCodeInput = getElFromId("url_access_code");
        accessCodeInput.focus();
    }

    // 로그아웃 버튼
    const logoutBtn = getElFromId("logout_btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
        imageHover(logoutBtn, "/static/img/icon/exit03.png", "/static/img/icon/exit04.png");
    }

    async function logout() {
        const data = setFetchData("delete", {});

        const logout_response = await fetch("/api/user/auth", data);

        if (logout_response.status == 202) {
            location.reload();
        } else if (logout_response.status == 400) {
            console.log(logout_response);
        }
    }

    // Submit 버튼
    const submitBtn = getElFromId("submit_btn_url");
    imageHover(submitBtn, "/static/img/icon/submit02.png", "/static/img/icon/submit03.png");
    setKeyForFunction(submitBtn, "Enter", requestAccess);

    submitBtn.addEventListener("click", requestAccess);

    async function requestAccess() {
        const accessCodeInput = getElFromId("url_access_code");
        const accessCode = accessCodeInput.value;
        const data = setFetchData("post", { access_code: accessCode });

        const access_response = await fetch(`${ShortenerUrl}${urlPath}`, data);
        if (access_response.status == 200) {
            const urlData = await access_response.json();
            let targetUrl = urlData.target_url;
            if (!targetUrl.startsWith("https://")) {
                targetUrl = "https://" + targetUrl;
            }
            console.log("targetUrl", targetUrl);
            window.location.href = targetUrl;
        } else if (access_response.status != 200) {
            const errorData = await access_response.json();
            if (errorData) {
                displayErrorMessage("access-code", errorData.detail);
            }
        }
    }

    const accessCodeInput = getElFromId("url_access_code");
    setKeyForFunction(accessCodeInput, "Enter", requestAccess);

    // x 버튼 클릭 시 브라우저 닫기
    const closeBrowserBtn = getElFromSel(".close-browser-btn");
    closeBrowserBtn.addEventListener("click", () => {
        window.close();
    });
});
