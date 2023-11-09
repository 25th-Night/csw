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
} from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    const signupEmailInput = getElFromId("signup_email");
    const signupFullnameInput = getElFromId("signup_fullname");
    const signupPhoneInput = getElFromId("signup_phone");
    const signupPasswordInput = getElFromId("signup_password");
    const signupPasswordConfirmInput = getElFromId("signup_password_confirm");

    // Email Check
    if (signupEmailInput) {
        signupEmailInput.addEventListener(
            "input",
            debounce(() => {
                notExistUser("exist_email", { email: signupEmailInput.value }, "signup-email");
            }, 500)
        );
    }

    async function notExistUser(endpoint, dict, inputField) {
        if (Object.values(dict)[0]) {
            const data = setFetchData("post", dict);
            const response = await fetch(`/api/user/${endpoint}`, data);

            if (response.status === 200) {
                const responseData = await response.json();
                const userExist = responseData.user_exist;
                displayPermanentErrorMessage(userExist, inputField, `Already in use.`);
            } else {
                console.log("API request failed");
            }
        }
    }

    // Phone Check
    if (signupPhoneInput) {
        signupPhoneInput.addEventListener(
            "input",
            debounce(() => {
                checkPhone("check_phone", { phone: signupPhoneInput.value });
            }, 500)
        );
    }

    async function checkPhone(endpoint, dict) {
        if (Object.values(dict)[0]) {
            const data = setFetchData("post", dict);
            const response = await fetch(`/api/user/${endpoint}`, data);

            if (response.status === 200) {
                const responseData = await response.json();
                const userExist = responseData.user_exist;
                const phoneFormat = responseData.phone_format;
                const errorElement = getElFromSel(`.signup-phone-error`);

                if (userExist) {
                    errorElement.textContent = "Already in use.";
                    errorElement.classList.remove("hidden");
                } else if (!phoneFormat) {
                    errorElement.textContent = 'Format: "010-1234-1234"';
                    errorElement.classList.remove("hidden");
                } else {
                    errorElement.classList.add("hidden");
                    errorElement.textContent = "";
                }
            } else {
                console.log("API request failed");
            }
        }
    }

    // Password Format
    if (signupPasswordInput) {
        signupPasswordInput.addEventListener(
            "input",
            debounce(() => {
                formatPassword(signupPasswordInput.value, "signup-password");
            }, 500)
        );
    }

    async function formatPassword(password, inputField) {
        if (password) {
            const data = setFetchData("post", { password: password });
            const response = await fetch("/api/user/format_pw", data);

            if (response.status === 200) {
                const responseData = await response.json();
                const passwordCheck = responseData.password_format;
                displayPermanentErrorMessage(
                    !passwordCheck,
                    inputField,
                    "Enter at least 8 chars with at least 1 letter, 1 number, 1 special char(@$!%*#?&)"
                );
            } else {
                console.log("API request failed");
            }
        }
    }

    // PasswordConfirm Check - Format & Match
    signupPasswordConfirmInput.addEventListener(
        "input",
        debounce(() => {
            formatPasswordConfirm(
                signupPasswordInput.value,
                signupPasswordConfirmInput.value,
                "signup-password-confirm"
            );
        }, 500)
    );

    async function formatPasswordConfirm(password, password_confirm, inputField) {
        if (password_confirm) {
            const data = setFetchData("post", { password: password_confirm });
            const response = await fetch("/api/user/format_pw", data);

            if (response.status === 200) {
                const responseData = await response.json();
                const passwordCheck = responseData.password_format;
                displayPermanentErrorMessage(
                    !passwordCheck,
                    inputField,
                    "Enter at least 8 chars with at least 1 letter, 1 number, 1 special char(@$!%*#?&)"
                );
            } else {
                console.log("API request failed");
            }
        } else if (password && password_confirm && password != password_confirm) {
            displayPermanentErrorMessage(
                password != password_confirm,
                inputField,
                "Password not matched."
            );
        }
    }

    // Submit Signup Form
    const signupSubmitBtn = getElFromId("signup_btn_email");

    signupSubmitBtn.addEventListener("click", signup);

    async function signup() {
        const email = signupEmailInput.value;
        const fullname = signupFullnameInput.value;
        const phone = signupPhoneInput.value;
        const password = signupPasswordInput.value;
        const passwordConfirm = signupPasswordConfirmInput.value;

        if (!email) {
            displayErrorMessage("signup-email", "Please enter your email.");
            return;
        }

        if (!fullname) {
            displayErrorMessage("signup-fullname", "Please enter your name.");
            return;
        }

        if (!phone) {
            displayErrorMessage("signup-phone", "Please enter your phone.");
            return;
        }

        if (!password) {
            displayErrorMessage("signup-password", "Please enter your password.");
            return;
        }

        if (!passwordConfirm) {
            displayErrorMessage("signup-password-confirm", "Please enter your password again.");
            return;
        }

        const data = setFetchData("post", {
            email: email,
            phone: phone,
            fullname: fullname,
            password: password,
            password_confirm: passwordConfirm,
        });

        // signup api 호출
        const signup_response = await fetch("/api/user/signup", data);

        if (signup_response.status === 200) {
            location.href = "/";
        } else if (signup_response.status === 400) {
            const errorData = await signup_response.json();
            console.log("errorData:", errorData);
            if (errorData) {
                if (errorData.email) {
                    displayErrorMessage("signup-email", errorData.email);
                }
                if (errorData.fullname) {
                    displayErrorMessage("signup-fullname", errorData.fullname);
                }
                if (errorData.phone) {
                    displayErrorMessage("signup-phone", errorData.phone);
                }
                if (errorData.password) {
                    displayErrorMessage("signup-password", errorData.password);
                }
                if (errorData.password_confirm) {
                    displayErrorMessage("signup-password", errorData.password_confirm);
                }
            }
        }
    }

    // email 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(signupEmailInput, "Enter", signup);

    // fullname 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(signupFullnameInput, "Enter", signup);

    // phone 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(signupPhoneInput, "Enter", signup);

    // password 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(signupPasswordInput, "Enter", signup);

    // password_confirm 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(signupPasswordConfirmInput, "Enter", signup);

    // signup submit 버튼 마우스 오버 시 효과
    imageHover(signupSubmitBtn, "/static/img/icon/submit02.png", "/static/img/icon/submit03.png");

    // x 버튼 클릭 시 모달창 닫기
    const closeModalBtn = getElFromId("signup_btn_close");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    // Esc 입력 시 모달창 닫기
    setKeyForFunction(window, "Escape", closeModal);

    async function closeModal() {
        const signupModal = getElFromId("signup_modal");
        signupModal.classList.add("hidden");
        signupEmailInput.value = "";
        signupFullnameInput.value = "";
        signupPhoneInput.value = "";
        signupPasswordInput.value = "";
        signupPasswordConfirmInput.value = "";

        const loginEmailInput = getElFromId("login_email");
        loginEmailInput.focus();
    }
});
