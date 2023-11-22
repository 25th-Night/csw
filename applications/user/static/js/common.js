function getElFromSel(selector) {
    /* Selector로 단일 요소 가져오는 함수 */

    return document.querySelector(selector);
}

function getElsFromSel(selector) {
    /* Selector로 다중 요소 가져오는 함수 */

    return document.querySelectorAll(selector);
}

function getElFromId(id) {
    /* id로 단일 요소 가져오는 함수 */

    return document.getElementById(id);
}

function makeElementHidden(...args) {
    /* 요소 hidden 처리 함수 */

    args.map((element) => {
        if (!element.classList.contains("hidden")) {
            element.classList.add("hidden");
        }
    });
}

function makeElementShow(...args) {
    /* 요소 hidden 제거 함수 */

    args.map((element) => {
        if (element.classList.contains("hidden")) {
            element.classList.remove("hidden");
        }
    });
}
function removeElement(...args) {
    /* 요소 제거 함수 */

    args.map((element) => {
        element.remove();
    });
}

function createNode(tag) {
    /* tag를 생성하는 함수 */

    return document.createElement(tag);
}

function appendTag(parent, element) {
    /* parent tag에 child tag를 추가하는 함수 */

    return parent.appendChild(element);
}

function insertAfter(element, referenceElement) {
    /* 요소 다음에 추가하는 함수 */

    referenceElement.parentElement.insertBefore(element, referenceElement.nextSibling);
}

function removeAllNode(element) {
    /* 요소의 내부 요소 초기화 함수 */

    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}

function getCookie(name) {
    /* 이름값의 cookie 값 가져오기 */

    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function setCookie(key, value, days) {
    const expires = days
        ? `expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}`
        : "";
    document.cookie = `${key}=${JSON.stringify(value)}; ${expires}; path=/`;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function setFetchData(method, body) {
    /* Fetch data 셋팅 함수 */

    let csrftoken = getCookie("csrftoken");

    let headers = {
        "content-type": "application/json",
        "X-CSRFToken": csrftoken,
    };

    let data = {
        method: method,
        headers: headers,
        credentials: "include",
    };

    if (method != "get") {
        data["body"] = JSON.stringify(body);
    }

    return data;
}

function redirectLogin(response) {
    /* Server에서 200외의 상태값을 받았을 경우 login페이지로 이동하는 함수 
        - fetch 함수 사용시 response에 아래와 같이 사용
        - ex : .then(response => redirectLogin(response))
    */
    return response.status == 200 ? response.json() : (location.href = "/login");
}

function imageHover(imageElement, hoverImagePath, normalImagePath) {
    /* 이미지 태그 마우스 오버 시, 이미지를 변경 처리하는 함수 */

    imageElement.addEventListener("mouseover", () => {
        imageElement.src = hoverImagePath;
    });

    imageElement.addEventListener("mouseout", () => {
        imageElement.src = normalImagePath;
    });
}

function debounce(func, delay) {
    /* 입력 이벤트를 처리하기 위한 디바운스 함수 (입력이 끝난 후 API 호출을 트리거하기 위함) */
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}

const displayErrorMessage = (inputField, errorMessage) => {
    /* 입력 필드의 값이 없을 경우 3초간 에러 메시지 표시 함수 */
    const errorElement = getElFromSel(`.${inputField}-error`);
    errorElement.textContent = errorMessage;
    errorElement.classList.remove("hidden");
    setTimeout(() => {
        errorElement.classList.add("hidden");
        errorElement.textContent = "";
    }, 3000);
};

const displayPermanentErrorMessage = (condition, inputField, errorMessage) => {
    /* 입력 필드의 값이 없을 경우 영구적 에러 메시지 표시 함수 */
    const errorElement = getElFromSel(`.${inputField}-error`);

    if (condition) {
        errorElement.textContent = errorMessage;
        errorElement.classList.remove("hidden");
    } else {
        errorElement.classList.add("hidden");
        errorElement.textContent = "";
    }
};

function setKeyForFunction(element, input_key, func) {
    /* 요소에 특정 키를 입력했을 때, 특정 함수를 실행하는 함수 */
    element.addEventListener("keydown", function (event) {
        if (event.key === input_key) {
            event.preventDefault();
            func();
        }
    });
}

function getCurrentPath() {
    const currentPath = window.location.pathname;
    return currentPath;
}

function changeLogoText(path, logoText) {
    const logo = getElFromId("header_logo");
    const currentPath = window.location.pathname;
    if (currentPath.startsWith(path)) {
        logo.textContent = logoText;
    }
}

function getShortenerURL() {
    /* 현재 URL에 따른 Shortener 서비스의 URL을 지정하는 함수 */

    // 현재 URL
    const currentURL = window.location.href;

    // URL 객체 생성
    const currentURLObject = new URL(currentURL);

    // 현재 URL에서 호스트 (도메인, 포트 포함) 를 추출
    const currentHost = currentURLObject.host;

    // 현재 URL에서 호스트 (도메인) 이름을 추출
    const currentHostName = currentURLObject.hostname;

    // URL 스키마 (http 또는 https)를 조회
    const currentProtocol = currentURLObject.protocol;

    let shortenerURL;

    if (currentHost === "127.0.0.1:8000") {
        console.log("local-window");
        shortenerURL = `${currentProtocol}//127.0.0.1:8001`;
    } else if (currentHost === "127.0.0.1:81") {
        console.log("local-docker");
        shortenerURL = `${currentProtocol}//127.0.0.1:82`;
    } else if (currentHostName === "csw.kr") {
        console.log("aws");
        shortenerURL = `${currentProtocol}//url.csw.kr`;
    } else {
        // 기본 URL 설정
        shortenerURL = "";
    }
    console.log(`shortenerURL:${shortenerURL}`);
    return shortenerURL;
}

function getJobURL() {
    /* 현재 URL에 따른 Shortener 서비스의 URL을 지정하는 함수 */

    // 현재 URL
    const currentURL = window.location.href;

    // URL 객체 생성
    const currentURLObject = new URL(currentURL);

    // 현재 URL에서 호스트 (도메인, 포트 포함) 를 추출
    const currentHost = currentURLObject.host;

    // 현재 URL에서 호스트 (도메인) 이름을 추출
    const currentHostName = currentURLObject.hostname;

    // URL 스키마 (http 또는 https)를 조회
    const currentProtocol = currentURLObject.protocol;

    let JobURL;

    if (currentHost === "127.0.0.1:8000") {
        console.log("local-window");
        JobURL = `${currentProtocol}//127.0.0.1:8002`;
    } else if (currentHost === "127.0.0.1:81") {
        console.log("local-docker");
        JobURL = `${currentProtocol}//127.0.0.1:83`;
    } else if (currentHostName === "csw.kr") {
        console.log("aws");
        JobURL = `${currentProtocol}//job.csw.kr`;
    } else {
        // 기본 URL 설정
        JobURL = "";
    }
    console.log(`JobURL:${JobURL}`);
    return JobURL;
}

function createNewElement(tagName, className, value = null, id = null) {
    /* 인자를 입력받아 새로운 요소를 생성하는 함수 */

    // 새로운 요소 생성
    let newElement = document.createElement(tagName);

    // 해당 요소에 속성 추가 (옵션)
    if (className) {
        newElement.className = className;
    }

    if (id) {
        newElement.id = id;
    }

    if (value) {
        if (newElement.hasAttribute("value")) {
            newElement.value = value;
        } else {
            newElement.textContent = value;
        }
    }

    return newElement;
}

function setElementText(element, text) {
    /* 인자를 입력받아 해당 요소에 text를 설정하는 함수 */

    element.textContent = text;
}

function addChildToTarget(element, targetElement, position) {
    /* 지정된 요소 내 지정된 위치에 새로운 요소를 추가하는 함수 */

    if (position == "first") {
        targetElement.insertBefore(element, targetElement.firstChild);
    } else if (position == "last") {
        targetElement.appendChild(element);
    } else if (position > 0 && position < targetElement.children.length) {
        let referenceElement = targetElement.children[position - 1];
        targetElement.insertBefore(element, referenceElement.nextSibling);
    }
}

function setAttributeToElement(element, attribute, value) {
    /* 지정된 요소에 입력한 값으로 속성을 설정하는 함수 */

    element.setAttribute(attribute, value);
}

function removeAttributeToElement(element, attribute) {
    /* 지정된 요소에 입력한 값으로 속성을 설정하는 함수 */

    element.removeAttribute(attribute);
}

function copyTextToClipboard(text) {
    /* 입력받은 text를 클립보드로 복사하는 함수 */

    navigator.clipboard
        .writeText(text)
        .then(function () {
            alert("URL copied to clipboard.");
        })
        .catch(function (err) {
            console.error("Failed to copy to clipboard:", err);
        });
}

function popUpConfirm(message, func, ...args) {
    /* Confirm 팝업 창 띄우기 함수 */

    const userConfirmed = confirm(message);

    if (userConfirmed) {
        func(...args);
    }
}

function formatDateToCustomFormat(dateTime) {
    /* 백엔드로부터 내려받은 DateTime string을 변환하여 출럭하는 함수  */
    /* "2023-11-06T16:14:03.002314Z" → "2023-11-06 16:14:03" */

    if (!dateTime) {
        return "-";
    }

    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 두 자릿수로 만듭니다.
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const makeSelectOptions = async (
    URL,
    optionType,
    selectElId,
    AllExist,
    selectedOptionId = null,
    parentSelectOptionId = null,
    parentSelectTitle = null
) => {
    /* select box 내 option 생성 함수 */
    const selectBox = getElFromId(selectElId);
    removeAllNode(selectBox);

    if (parentSelectOptionId === null || parentSelectOptionId != 0) {
        const data = setFetchData("get", {});

        // job api 호출
        const get_options_response = await fetch(`${URL}/${optionType}`, data);

        if (get_options_response.status === 200) {
            let options = await get_options_response.json();
            // let initOption = {};
            // if (AllExist) {
            //     initOption = [
            //         { id: -1, name: "Select" },
            //         { id: 0, name: "All" },
            //     ];
            // } else {
            //     initOption = [{ id: -1, name: "Select" }];
            // }
            // options = initOption.concat(options);
            if (AllExist) {
                options = [{ id: 0, name: "All" }].concat(options);
            }

            options.forEach((option) => {
                const new_option = createNewElement(
                    "option",
                    "select-option",
                    option.id,
                    `${selectElId}_${option.id}`
                );
                new_option.value = option.id;
                new_option.textContent = option.name;
                selectBox.appendChild(new_option);
            });
            if (selectedOptionId) {
                const selectedOption = getElFromId(`${selectElId}_${selectedOptionId}`);
                selectBox.value = selectedOptionId;
            }
        } else {
            const errorData = await get_options_response.json();
            if (errorData) {
                console.log(errorData);
                displayErrorMessage("make-options", errorData.detail);
            }
        }
    } else {
        const defaultOption = createNewElement(
            "option",
            "default-option",
            `${parentSelectTitle} first`
        );
        defaultOption.value = 0;
        selectBox.appendChild(defaultOption);
    }
};

const changeSelectOptions = (
    URL,
    changedSelectElId,
    query_parameter,
    optionType,
    changingSelectElId,
    AllExist,
    selectedOptionId = null
) => {
    /* 부모 select box 값 변경 시, 자식 select box 내 option 신규 생성 함수 */

    const parentSelectBox = getElFromId(changedSelectElId);

    parentSelectBox.addEventListener("change", () => {
        if (parentSelectBox.value == 0) {
            const changingSelectBox = getElFromId(changingSelectElId);
            removeAllNode(changingSelectBox);
            const defaultOption = createNewElement(
                "option",
                "default-option",
                `${parentSelectBox.getAttribute("placeholder")} first`
            );
            defaultOption.value = 0;
            changingSelectBox.appendChild(defaultOption);
            changingSelectBox.value = 0;
        } else {
            makeSelectOptions(
                URL,
                `${optionType}?${query_parameter}=${parentSelectBox.value}`,
                changingSelectElId,
                AllExist,
                selectedOptionId
            );
        }
    });
};

function makeQueryParameter(queryParamsDict) {
    const checkQueryParamsDict = JSON.parse(JSON.stringify(queryParamsDict));
    for (let key in checkQueryParamsDict) {
        if (checkQueryParamsDict[key] == 0) {
            delete checkQueryParamsDict[key];
        }
    }
    let queryParams = new URLSearchParams(checkQueryParamsDict);
    let queryString = queryParams.toString();
    return queryString;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const hoverChangeTextColor = (targetElement, overColor, outColor) => {
    targetElement.addEventListener("mouseover", function () {
        targetElement.style.color = overColor;
    });

    targetElement.addEventListener("mouseout", function () {
        targetElement.style.color = outColor;
    });
};

const hoverChangeBackgroundColor = (targetElement, overColor, outColor) => {
    targetElement.addEventListener("mouseover", function () {
        targetElement.style.backgroundColor = overColor;
    });

    targetElement.addEventListener("mouseout", function () {
        targetElement.style.backgroundColor = outColor;
    });
};

const useScrollTopBtn = () => {
    // scroll top
    const scrollTopBtn = getElFromId("scroll_top_btn");
    scrollTopBtn.classList.remove("hidden");
    const screenHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollBtnHeight = screenHeight * 0.1;
    scrollTopBtn.style.bottom = scrollBtnHeight;
    scrollTopBtn.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });
};

export {
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
    setCookie,
    deleteCookie,
    setFetchData,
    redirectLogin,
    imageHover,
    debounce,
    displayErrorMessage,
    displayPermanentErrorMessage,
    setKeyForFunction,
    getCurrentPath,
    changeLogoText,
    getShortenerURL,
    getJobURL,
    createNewElement,
    setElementText,
    addChildToTarget,
    setAttributeToElement,
    removeAttributeToElement,
    copyTextToClipboard,
    popUpConfirm,
    formatDateToCustomFormat,
    makeSelectOptions,
    changeSelectOptions,
    makeQueryParameter,
    capitalize,
    hoverChangeTextColor,
    hoverChangeBackgroundColor,
    useScrollTopBtn,
};
