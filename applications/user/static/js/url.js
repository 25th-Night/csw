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
    // Shortener Url Service URL
    const ShortenerUrl = getShortenerURL();
    console.log("shortener Service Url", ShortenerUrl);

    // Page Num
    const currentPageNumber = 1;
    const currentTotalURL = 1;

    const urlListTitle = getElFromSel(".url-list-title");
    setAttributeToElement(urlListTitle, "data-page", currentPageNumber);
    setAttributeToElement(urlListTitle, "data-total", currentTotalURL);

    // Make Input
    const makeUrlInput = getElFromId("url_target");
    const makeNicknameInput = getElFromId("url_nickname");
    const makeExpireInput = getElFromId("url_expire");
    const makeAccessInput = getElFromId("url_access");

    // Total Count
    const totalCount = getElFromSel(".total-count");

    // Submit Login Form
    const makeSubmitBtn = getElFromId("make_btn_url");

    makeSubmitBtn.addEventListener("click", makeUrl);
    setKeyForFunction(makeSubmitBtn, "Enter", makeUrl);

    async function makeUrl() {
        const url = makeUrlInput.value;
        let nickname = null;
        if (makeNicknameInput) {
            nickname = makeNicknameInput.value;
        }
        const expire = makeExpireInput.value;
        const access = makeAccessInput.value;

        if (!url) {
            displayErrorMessage("make-url", "Please enter target url.");
            return;
        }

        const currentTotal = parseInt(getElFromSel(".url-list-title").getAttribute("data-total"));

        if (currentTotal >= available_url_cnt) {
            alert("Cannot create more URLs.");
            return;
        }

        const data = setFetchData("post", {
            target_url: url,
            nick_name: nickname,
            expired_at: expire,
            access: access,
        });

        // shortened_url api 호출
        const make_url_response = await fetch(`${ShortenerUrl}/shortener/`, data);

        if (make_url_response.status === 201) {
            makeUrlInput.value = "";
            if (makeNicknameInput) {
                makeNicknameInput.value = "";
            }
            makeAccessInput.value = "1";
            fp.clear();
            makeUrlInput.focus();
            getUrlList();
        } else if (make_url_response.status === 400) {
            const errorData = await make_url_response.json();
            if (errorData) {
                console.log(errorData);
                displayErrorMessage("make-url", errorData);
            }
        }
    }

    // select box 선택 시 access 변경 api 호출
    async function changeAccess(urlId, selectBoxElement) {
        try {
            const access = selectBoxElement.value;
            const data = setFetchData("PATCH", { access: access });
            const change_access_response = await fetch(`${ShortenerUrl}/shortener/${urlId}`, data);
            if (change_access_response.status === 200) {
            } else if (change_access_response.status === 400) {
                const errorData = await change_access_response.json();
                if (errorData) {
                    displayErrorMessage("list-url", errorData.detail);
                    console.log(errorData);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    // x 버튼 클릭 시 delete api 호출
    async function deleteUrl(urlId, data) {
        try {
            const delete_url_response = await fetch(`${ShortenerUrl}/shortener/${urlId}`, data);
            if (delete_url_response.status === 204) {
                getUrlList();
            } else if (delete_url_response.status === 400) {
                const errorData = await delete_url_response.json();
                if (errorData) {
                    displayErrorMessage("list-url", errorData);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Target URL 클릭 시 모달창 오픈
    async function openModal(url) {
        const modifyModal = getElFromId("modify_modal");
        modifyModal.classList.remove("hidden");

        const modalTargetUrl = getElFromId("url_target_modify");
        const modalNickname = getElFromId("url_nickname_modify");
        const modalExpire = getElFromId("url_expire_modify");
        const modalAccess = getElFromId("url_access_modify");
        const modalShortenedUrl = getElFromId("url_shortened_info");
        const modalClick = getElFromId("url_click_info");
        const modalLastClicked = getElFromId("url_last_clicked_info");
        const modalCreated = getElFromId("url_created_at_info");

        modalTargetUrl.value = url.target_url;
        modalNickname.value = url.nick_name;
        modalExpire.value = url.expired_at;
        modalAccess.value = url.access;
        modalShortenedUrl.textContent = `/${url.prefix}/${url.shortened_url}`;
        modalClick.textContent = url.click.toString();
        modalLastClicked.textContent = formatDateToCustomFormat(url.last_clicked);
        modalCreated.textContent = formatDateToCustomFormat(url.created_at);

        modalShortenedUrl.style.backgroundColor = "#bfbfbf";
        modalClick.style.backgroundColor = "#bfbfbf";
        modalLastClicked.style.backgroundColor = "#bfbfbf";
        modalCreated.style.backgroundColor = "#bfbfbf";

        let calendar = getElFromId("calendar");
        if (!calendar) {
            calendar = createNewElement(
                "div",
                "fixed md:left-1/2 top-[40%] translate-y-[120px] md:translate-x-[-50%] md:translate-y-[calc(-50%+80px)] z-20",
                null,
                "calendar"
            );
            const modifyModalWrap = getElFromSel(".modify-modal-wrap");
            modifyModalWrap.insertAdjacentElement("afterend", calendar);
        }
        const fp = flatpickr("#url_expire_modify", {
            minDate: "today",
            dateFormat: "Y-m-d",
            static: true,
        });

        calendar.appendChild(fp.calendarContainer);
        setAttributeToElement(modifyModal, "data-id", url.id);

        // submit 버튼 클릭 시 modify API 호출
        const modifySubmitBtn = getElFromId("modify_btn_url");
        modifySubmitBtn.addEventListener("click", () => {
            modify(url.id);
        });

        imageHover(
            modifySubmitBtn,
            "/static/img/icon/submit02.png",
            "/static/img/icon/submit03.png"
        );
        // x 버튼 클릭 시 모달창 닫기
        const closeModalBtn = getElFromId("modify_btn_close");
        closeModalBtn.addEventListener("click", () => {
            closeModal();
        });

        // Esc 입력 시 모달창 닫기
        setKeyForFunction(window, "Escape", closeModal);

        modalTargetUrl.focus();
    }

    // 유저가 생성한 Shortened Url List 조회
    async function getUrlList(page = 1) {
        const urlList = getElFromId("url_list");

        const data = setFetchData("get", {});

        const url_list_response = await fetch(`${ShortenerUrl}/shortener/?page=${page}`, data);
        const response_data = await url_list_response.json();
        if (url_list_response.status === 200) {
            // url-list 태그 내 모든 요소 초기화
            removeAllNode(urlList);

            // 전체 데이터 수
            let totalCountNum = response_data.count;

            // 전체 데이터 수 저장
            setAttributeToElement(urlListTitle, "data-total", totalCountNum);

            // totalCount 업데이트
            if (url_license == 1) {
                const percentage = (totalCountNum / available_url_cnt) * 100;
                totalCount.textContent = `${percentage.toFixed(1)} %`;
            } else {
                totalCount.textContent = `${totalCountNum} URLs`;
            }

            response_data.results.forEach((url) => {
                // Shortener URL 서비스의 url 조회
                const urlServiceURL = getShortenerURL();

                // svg code
                const openSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#373737" class="w-6 h-6 cursor-pointer hover:stroke-[#d9d9d9]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                `;

                const copySvg = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#373737" class="w-6 h-6 cursor-pointer hover:stroke-[#d9d9d9]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                `;
                const copyParser = new DOMParser();
                const copySvgDOM = copyParser.parseFromString(copySvg, "image/svg+xml");
                const copySvgElement = copySvgDOM.documentElement;

                const removeSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="#373737" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" class="w-6 h-6 cursor-pointer hover:fill-[#d9d9d9]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                `;
                const removeParser = new DOMParser();
                const removeSvgDOM = removeParser.parseFromString(removeSvg, "image/svg+xml");
                const removeSvgElement = removeSvgDOM.documentElement;

                // url id
                const urlId = url.id;

                // 각 url을 감쌀 wrapper div 생성
                const divWrap = createNewElement(
                    "div",
                    "flex url-wrap items-center my-2 px-2",
                    null,
                    `url_wrap_${urlId}`
                );

                // url 관련 정보를 각각 담을 태그 생성
                const shortened = `${url.prefix}/${url.shortened_url}`;
                const urlLink = `${urlServiceURL}/${shortened}`;
                const targetUrl = createNewElement(
                    "div",
                    `url-list-1 url-link target-url-${urlId}`,
                    url.target_url
                );
                const shortenedUrl = createNewElement(
                    "div",
                    `url-list-2 shortened-url-${urlId}`,
                    `/${shortened}`
                );
                const nickname = createNewElement(
                    "div",
                    `url-list-3 nickname-${urlId}`,
                    url.nick_name
                );
                const access = createNewElement("div", `url-list-4 access-${urlId}`);
                const clicked = createNewElement(
                    "div",
                    `url-list-4 click-${urlId}`,
                    url.click.toString()
                );
                const open = createNewElement("div", `url-list-5 open-${urlId}`);
                const copy = createNewElement("div", `url-list-5 copy-${urlId}`);
                const remove = createNewElement("div", `url-list-4 remove-${urlId}`);

                // access 요소 내에 access select box 복사
                const originalSelectAccess = getElFromId("url_access");
                const clonedSelectAccess = originalSelectAccess.cloneNode(true);
                clonedSelectAccess.id = `url_access_${urlId}`;
                clonedSelectAccess.name = `url-access-${urlId}`;
                clonedSelectAccess.value = url.access;
                clonedSelectAccess.tabIndex = -1;
                clonedSelectAccess.classList.remove("w-24");
                clonedSelectAccess.style.fontSize = "12px";

                // 각 <option>에 대한 스타일 지정
                const clonedOptions = clonedSelectAccess.querySelectorAll("option");

                clonedOptions.forEach((option) => {
                    option.style.fontSize = "12px";
                });

                // select box에 이벤트 추가
                clonedSelectAccess.addEventListener("change", function () {
                    changeAccess(urlId, this);
                });

                // 복사한 select box를 추가
                access.appendChild(clonedSelectAccess);

                // open 태그 내 a태그 생성
                const openA = createNewElement("a", `open-url-${urlId}`);

                // 태그별 속성 추가
                setAttributeToElement(openA, "href", urlLink);
                setAttributeToElement(openA, "target", "_blank");

                // a 태그에 클릭 이벤트 추가
                openA.addEventListener("click", function () {
                    const clickEl = getElFromSel(`.click-${urlId}`);
                    const clickedCount = parseInt(clickEl.textContent) + 1;
                    clickEl.textContent = clickedCount.toString();
                });

                // svg에 클릭 이벤트 추가
                copySvgElement.addEventListener("click", function () {
                    copyTextToClipboard(urlLink);
                });

                removeSvgElement.addEventListener("click", function () {
                    const data = setFetchData("delete", {});
                    popUpConfirm("Are you sure to delete?", deleteUrl, urlId, data);
                });

                // svg 태그 삽입
                openA.innerHTML = openSvg;
                copy.appendChild(copySvgElement);
                remove.appendChild(removeSvgElement);

                // open 태그 내 a태그 추가
                open.appendChild(openA);

                // targetUrl에 클릭 이벤트 추가
                targetUrl.addEventListener("click", function () {
                    openModal(url);
                });

                // wrapper 태그에 각각의 태그를 추가
                divWrap.appendChild(targetUrl);
                divWrap.appendChild(shortenedUrl);
                divWrap.appendChild(nickname);
                divWrap.appendChild(access);
                divWrap.appendChild(clicked);
                divWrap.appendChild(open);
                divWrap.appendChild(copy);
                divWrap.appendChild(remove);

                // url-list 태그 내에 wrapper 태그를 항상 마지막에 추가
                addChildToTarget(divWrap, urlList, "last");
            });

            // 페이지 버튼 추가
            const listTitleWrap = getElFromSel(".list-title-wrap");
            const pageNum = Math.ceil(response_data.count / response_data.page_size);
            const pageBtnWrap = getElFromId("page_btn_wrap");
            removeAllNode(pageBtnWrap);

            for (let i = 1; i <= pageNum; i++) {
                const pageNumBtn = createNewElement(
                    "div",
                    `hover:text-[#d9d9d9] cursor-pointer page-btn-${i}`,
                    i,
                    `page_btn_${i}`
                );
                pageNumBtn.style.fontWeight = "600";
                pageNumBtn.style.margin = "10px";
                pageBtnWrap.appendChild(pageNumBtn);

                const currentPageNumber = getElFromSel(".url-list-title").getAttribute("data-page");

                if (i == currentPageNumber) {
                    pageNumBtn.style.cursor = "default";
                    pageNumBtn.classList.remove("hover:text-[#d9d9d9]");
                    pageNumBtn.style.color = "#bfbfbf";
                } else {
                    pageNumBtn.addEventListener("click", () => {
                        getUrlList(i);
                        setAttributeToElement(urlListTitle, "data-page", i);
                    });
                }
            }
            listTitleWrap.parentNode.insertBefore(pageBtnWrap, listTitleWrap.nextSibling);
        } else if (url_list_response.status === 400) {
            const errorData = await url_list_response.json();
            if (errorData) {
                displayErrorMessage("list-url", errorData);
            }
        }
    }

    // x 버튼 클릭 시 모달창 닫기
    async function closeModal() {
        const modifyModal = getElFromId("modify_modal");
        modifyModal.classList.add("hidden");

        const modalTargetUrl = getElFromId("url_target_modify");
        const modalNickname = getElFromId("url_nickname_modify");
        const modalExpire = getElFromId("url_expire_modify");
        const modalAccess = getElFromId("url_access_modify");
        const modalShortenedUrl = getElFromId("url_shortened_info");
        const modalClick = getElFromId("url_click_info");
        const modalLastClicked = getElFromId("url_last_clicked_info");
        const modalCreated = getElFromId("url_created_at_info");

        modalTargetUrl.value = "";
        modalNickname.value = "";
        modalExpire.value = "";
        modalAccess.value = "";
        modalShortenedUrl.textContent = "";
        modalClick.textContent = "";
        modalLastClicked.textContent = "";
        modalCreated.textContent = "";

        const flatpickr = getElsFromSel(".flatpickr-calendar")[1];
        if (flatpickr) {
            flatpickr.remove();
        }

        removeAttributeToElement(modifyModal, "data-id");
    }

    // Submit Modify Form
    const modifySubmitBtn = getElFromId("signup_btn_email");

    if (modifySubmitBtn) {
        imageHover(
            modifySubmitBtn,
            "/static/img/icon/submit02.png",
            "/static/img/icon/submit03.png"
        );
    }

    // url 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(makeUrlInput, "Enter", makeUrl);

    // nickname 입력 칸에서 Enter 키 입력 시 폼 제출
    if (makeNicknameInput) {
        setKeyForFunction(makeNicknameInput, "Enter", makeUrl);
    }

    // make submit 버튼 마우스 오버 시 효과
    imageHover(makeSubmitBtn, "/static/img/icon/submit02.png", "/static/img/icon/submit01.png");

    // Datepicker 적용
    const fp = flatpickr("#url_expire", {
        minDate: "today",
        dateFormat: "Y-m-d",
        static: true,
    });

    // Date Input 선택 시 x 버튼 활성화
    const input = getElFromId("url_expire");
    const svg = getElFromId("clearDate");

    if (svg) {
        svg.addEventListener("click", function () {
            input.value = "";
            svg.classList.add("hidden");
        });
    }

    input.addEventListener("input", function () {
        if (input.value) {
            svg.classList.remove("hidden");
        } else {
            svg.classList.add("hidden");
        }
    });

    async function modify(urlId) {
        const modalTargetUrl = getElFromId("url_target_modify");
        const modalNickname = getElFromId("url_nickname_modify");
        const modalExpire = getElFromId("url_expire_modify");
        const modalAccess = getElFromId("url_access_modify");

        const targetUrl = modalTargetUrl.value;
        const nickname = modalNickname.value;
        const expire = modalExpire.value;
        const access = modalAccess.value;

        if (!targetUrl) {
            displayErrorMessage("modify-url", "Please enter target url.");
            return;
        }

        const data = setFetchData("put", {
            target_url: targetUrl,
            nick_name: nickname,
            expired_at: expire,
            access: access,
        });

        // shortened_url api 호출
        const make_url_response = await fetch(`${ShortenerUrl}/shortener/${urlId}`, data);

        if (make_url_response.status === 200) {
            closeModal();
            getUrlList();
        } else {
            const errorData = await make_url_response.json();
            if (errorData) {
                console.log(errorData);
                displayErrorMessage("make-url", errorData.detail);
            }
        }
    }

    const refreshListBtn = getElFromSel(".refresh-list-btn");
    refreshListBtn.addEventListener("click", () => {
        const currentPageNumber = getElFromSel(".url-list-title").getAttribute("data-id");
        getUrlList(currentPageNumber);
    });

    // 화면 로드 시 실행될 함수 목록
    getUrlList(currentPageNumber);
});
