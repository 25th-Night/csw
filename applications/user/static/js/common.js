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
};