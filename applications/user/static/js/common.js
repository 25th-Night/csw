function getElFromSel(elemVal) {
    /* Selector로 단일 요소 가져오는 함수 */

    return document.querySelector(elemVal);
}

function getElsFromSel(val) {
    /* Selector로 다중 요소 가져오는 함수 */

    return document.querySelectorAll(val)
}

function getElFromId(id) {
    /* id로 단일 요소 가져오는 함수 */

    return document.getElementById(id)
}

function makeElementHidden(...args) {
    /* 요소 hidden 처리 함수 */

    args.map((element) => {
        if (!element.classList.contains('hidden')) {
            element.classList.add('hidden')
        }
    });
}

function makeElementShow(...args) {
    /* 요소 hidden 제거 함수 */

    args.map((element) => {
        if (element.classList.contains('hidden')) {
            element.classList.remove('hidden')
        }
    });
}
function removeElement(...args) {
    /* 요소 제거 함수 */

    args.map((element) => {
        element.remove()
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
    if (document.cookie && document.cookie !== '') {

        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function setFetchData(method, body){
    /* Fetch data 셋팅 함수 */

    let csrftoken   = getCookie('csrftoken');

    const data = {
        method: method,
        headers: {
            'content-type': 'application/json',
            'X-CSRFToken' : csrftoken,        
        },
        body: JSON.stringify(body)
    }

    return data
}

function redirectLogin(response) {
    /* Server에서 200외의 상태값을 받았을 경우 login페이지로 이동하는 함수 
        - fetch 함수 사용시 response에 아래와 같이 사용
        - ex : .then(response => redirectLogin(response))
    */
    return response.status == 200 ? response.json() : location.href = '/login'
}

function imageHover(imageElement, hoverImagePath, normalImagePath) {
    /* 이미지 태그 마우스 오버 시, 이미지를 변경 처리하는 함수 */

    imageElement.addEventListener('mouseover', function() {
        imageElement.src = hoverImagePath;
    });
    
    imageElement.addEventListener('mouseout', function() {
        imageElement.src = normalImagePath;
    });
}

function debounce(func, delay) {
    /* 입력 이벤트를 처리하기 위한 디바운스 함수 (입력이 끝난 후 API 호출을 트리거하기 위함) */
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}

const displayErrorMessage = (inputField, errorMessage) => {
    /* 입력 필드의 값이 없을 경우 3초간 에러 메시지 표시 함수 */
    const errorElement = getElFromSel(`.${inputField}-error`);
    errorElement.textContent = errorMessage;
    errorElement.classList.remove('hidden');
    setTimeout(() => {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
    }, 3000);
};

const displayPermanentErrorMessage  = (condition, inputField, errorMessage) => {
    /* 입력 필드의 값이 없을 경우 영구적 에러 메시지 표시 함수 */
    const errorElement = getElFromSel(`.${inputField}-error`);

    if (condition) {
        errorElement.textContent = errorMessage;
        errorElement.classList.remove('hidden');
    } else {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
    }
};

function setKeyForFunction(element, input_key, func) {
    /* 요소에 특정 키를 입력했을 때, 특정 함수를 실행하는 함수 */
    element.addEventListener('keydown', function(event) {
        if (event.key === input_key) {
            event.preventDefault();
            func();
        }
    });
}

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
    setFetchData,
    redirectLogin,
    imageHover,
    debounce,
    displayErrorMessage,
    displayPermanentErrorMessage,
    setKeyForFunction,
};