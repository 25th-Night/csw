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
    hoverChangeTextColor,
    isAlphaNumeric,
} from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    // Shortener Url Service URL
    const ShortenerUrl = getShortenerURL();

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
        const makeUrlInput = getElFromId("url_target");
        const makeNicknameInput = getElFromId("url_nickname");
        const makeExpireInput = getElFromId("url_expire");
        const makeAccessInput = getElFromId("url_access");
        const makeUrlPrefix = getElFromId("url_prefix");
        const makeUrlSuffix = getElFromId("url_suffix");

        let requestData = {};

        if (!makeUrlInput.value) {
            displayErrorMessage("make-url", "Please enter target url.");
            return;
        }

        requestData["target_url"] = makeUrlInput.value;
        if (makeNicknameInput && makeNicknameInput.value) {
            requestData["nick_name"] = makeNicknameInput.value;
        }
        requestData["expired_at"] = makeExpireInput.value;
        requestData["access"] = makeAccessInput.value;
        if (url_license == 4) {
            if (makeUrlPrefix) {
                if (makeUrlPrefix.value) {
                    console.log("makeUrlPrefix.value", makeUrlPrefix.value);
                    if (!isAlphaNumeric(makeUrlPrefix.value)) {
                        displayErrorMessage(
                            "make-url",
                            "Prefix : alpha-numeric characters are allowed"
                        );
                        return;
                    } else if (makeUrlPrefix.value.length != 1) {
                        displayErrorMessage("make-url", "Prefix : Please enter 1 character");
                        return;
                    }
                    requestData["prefix"] = makeUrlPrefix.value;
                }
            }
            if (makeUrlSuffix) {
                if (makeUrlSuffix.value) {
                    console.log("makeUrlSuffix.value", makeUrlSuffix.value);
                    if (!isAlphaNumeric(makeUrlSuffix.value)) {
                        displayErrorMessage(
                            "make-url",
                            "Suffix : alpha-numeric characters are allowed"
                        );
                        return;
                    } else if (makeUrlSuffix.value.length != 6) {
                        displayErrorMessage("make-url", "Suffix : Please enter 6 characters");
                        return;
                    }
                    requestData["shortened_url"] = makeUrlSuffix.value;
                }
            }
        }

        const currentTotal = parseInt(getElFromSel(".url-list-title").getAttribute("data-total"));

        if (currentTotal >= available_url_cnt) {
            alert("Cannot create more URLs.");
            return;
        }
        console.log("requestData", requestData);
        const data = setFetchData("post", requestData);

        // shortened_url api 호출
        const make_url_response = await fetch(`${ShortenerUrl}/shortener/`, data);

        if (make_url_response.status === 201) {
            makeUrlInput.value = "";
            if (makeNicknameInput) {
                makeNicknameInput.value = "";
            }
            makeAccessInput.value = "1";
            fp.clear();
            if (makeUrlPrefix) {
                makeUrlPrefix.value = "";
            }
            if (makeUrlSuffix) {
                makeUrlSuffix.value = "";
            }
            makeUrlInput.focus();
            updateTotalCount("created");
            getUrlList();
        } else if (make_url_response.status === 400) {
            const errorData = await make_url_response.json();
            if (errorData) {
                console.log(errorData);
                displayErrorMessage("make-url", errorData);
            }
        }
    }

    // 유저 Url 정보에 total_cnt 업데이트하는 함수
    async function updateTotalCount(update_status) {
        const data = setFetchData("post", { update: update_status });
        try {
            const update_url_response = await fetch(`/api/user/url`, data);
            if (update_url_response.status === 200) {
                return;
            } else if (update_url_response.status === 400) {
                const errorData = await update_url_response.json();
                if (errorData) {
                    displayErrorMessage("list-url", errorData);
                }
            }
        } catch (error) {
            console.error(error);
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
                updateTotalCount("deleted");
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
    async function openModal(urlId) {
        // expire Input 생성
        createExpireModifyInput();

        // shortened_url api 호출
        const data = setFetchData("get", {});

        const get_url_response = await fetch(`${ShortenerUrl}/shortener/${urlId}`, data);

        if (get_url_response.status === 200) {
            const url = await get_url_response.json();
            console.log("url", url);
            const modifyModal = getElFromId("modify_modal");
            modifyModal.classList.remove("hidden");

            const modalTargetUrl = getElFromId("url_target_modify");
            const modalNickname = getElFromId("url_nickname_modify");
            const modalExpire = getElFromId("url_expire_modify");
            const modalAccess = getElFromId("url_access_modify");
            const modalPrefix = getElFromId("url_prefix_modify");
            const modalSuffix = getElFromId("url_suffix_modify");
            const modalShortenedUrl = getElFromId("url_shortened_info");
            const modalClick = getElFromId("url_click_info");
            const modalLastClicked = getElFromId("url_last_clicked_info");
            const modalCreated = getElFromId("url_created_at_info");
            const modalAccessCode = getElFromId("url_access_code_info");

            modalTargetUrl.value = url.target_url;
            modalNickname.value = url.nick_name;
            modalExpire.value = url.expired_at;
            modalAccess.value = url.access;
            if (modalPrefix) {
                modalPrefix.value = url.prefix;
            }
            if (modalSuffix) {
                modalSuffix.value = url.shortened_url;
            }
            if (modalShortenedUrl) {
                modalShortenedUrl.textContent = `/${url.prefix}/${url.shortened_url}`;
                modalShortenedUrl.style.backgroundColor = "#bfbfbf";
            }
            modalClick.textContent = url.click.toString();
            modalLastClicked.textContent = formatDateToCustomFormat(url.last_clicked);
            modalCreated.textContent = formatDateToCustomFormat(url.created_at);
            modalAccessCode.textContent = url.access_code;

            modalClick.style.backgroundColor = "#bfbfbf";
            modalLastClicked.style.backgroundColor = "#bfbfbf";
            modalCreated.style.backgroundColor = "#bfbfbf";

            modalTargetUrl.focus();

            // flatpickr 위치 지정
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

            const fp_modify = flatpickr("#url_expire_modify_wrap", {
                minDate: "today",
                dateFormat: "Y-m-d",
                static: true,
                disableMobile: true,
                wrap: true,
            });

            calendar.appendChild(fp_modify.calendarContainer);
            setAttributeToElement(modifyModal, "data-id", url.id);

            // submit 버튼 생성
            const modifySubmitBtn = createNewElement(
                "img",
                "block h-12 mr-6 cursor-pointer",
                null,
                "modify_btn_url"
            );
            setAttributeToElement(modifySubmitBtn, "src", "/static/img/icon/submit03.png");
            setAttributeToElement(modifySubmitBtn, "tabIndex", "10");

            // submit 버튼 클릭 시 modify API 호출
            modifySubmitBtn.addEventListener("click", function (event) {
                event.preventDefault();
                modify(url.id);
            });

            modalTargetUrl.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    modifySubmitBtn.click();
                }
            });

            imageHover(
                modifySubmitBtn,
                "/static/img/icon/submit02.png",
                "/static/img/icon/submit03.png"
            );

            // x 버튼 생성
            const closeSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF" class="w-8 h-8 cursor-pointer hover:stroke-neutral-400" id="modify_btn_close" tabindex="11">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                `;
            const closeParser = new DOMParser();
            const closeSvgDOM = closeParser.parseFromString(closeSvg, "image/svg+xml");
            const closeSvgElement = closeSvgDOM.documentElement;

            // x 버튼 클릭 시 모달창 닫기
            closeSvgElement.addEventListener("click", () => {
                closeModal();
            });

            // 버튼을 모달에 추가
            const modifyBtnWrap = getElFromSel(".modify-btn-wrap");
            modifyBtnWrap.appendChild(modifySubmitBtn);
            modifyBtnWrap.appendChild(closeSvgElement);

            //
            setKeyForFunction(modifySubmitBtn, "Enter", function () {
                modifySubmitBtn.click();
            });

            // Access Code Refresh 버튼 생성
            const refreshCodeSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" class="w-6 h-6 mr-3 hover:stroke-white cursor-pointer refresh-access-code-btn">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            `;
            const refreshCodeParser = new DOMParser();
            const refreshCodeSvgDOM = refreshCodeParser.parseFromString(
                refreshCodeSvg,
                "image/svg+xml"
            );
            const refreshCodeSvgElement = refreshCodeSvgDOM.documentElement;

            // Refresh 버튼 클릭 시 이벤트 추가
            refreshCodeSvgElement.addEventListener("click", () => {
                refreshAccessCode(urlId);
            });

            async function refreshAccessCode(urlId) {
                console.log("refresh code");
                const data = setFetchData("PATCH", {});
                const change_access_response = await fetch(
                    `${ShortenerUrl}/shortener/${urlId}/refresh`,
                    data
                );
                if (change_access_response.status === 200) {
                    const accessCodeDiv = getElFromId("url_access_code_info");
                    const response_data = await change_access_response.json();
                    const newAccessCode = response_data.access_code;
                    console.log("new_access_code", newAccessCode);
                    accessCodeDiv.textContent = newAccessCode;
                } else if (change_access_response.status === 400) {
                    const errorData = await change_access_response.json();
                    if (errorData) {
                        displayErrorMessage("list-url", errorData.detail);
                        console.log(errorData);
                    }
                }
            }

            // Refresh 버튼 추가
            modalAccessCode.parentNode.appendChild(refreshCodeSvgElement);

            // 유저 license에 따른 nickname, refresh 필드 숨김 처리
            if (url_license == 1) {
                modalNickname.parentNode.classList.add("hidden");
                const refreshAccessCodeBtn = getElFromSel(".refresh-access-code-btn");
                if (refreshAccessCodeBtn) {
                    refreshAccessCodeBtn.classList.add("hidden");
                }
            }

            // Access Level에 따른 Access code 숨김 처리
            if (url.access != 2) {
                console.log("hide");
                modalAccessCode.parentNode.parentNode.classList.add("hidden");
            }

            // Esc 입력 시 모달창 닫기
            setKeyForFunction(document, "Escape", closeModal);
        } else {
            const errorData = await get_url_response.json();
            if (errorData) {
                console.log(errorData);
                displayErrorMessage("list-url", errorData.detail);
            }
        }
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
            if (totalCountNum <= 100) {
                const percentageNum = (totalCountNum / available_url_cnt) * 100;
                const percentage = `${percentageNum.toFixed(1)}%`;
                totalCount.textContent = `${totalCountNum} URLs (${percentage})`;
            } else {
                totalCount.textContent = `${totalCountNum} URLs`;
            }

            response_data.results.forEach((url) => {
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
                removeSvgElement.addEventListener("mouseover", function () {
                    setAttributeToElement(removeSvgElement, "fill", "#d9d9d9");
                });
                removeSvgElement.addEventListener("mouseout", function () {
                    setAttributeToElement(removeSvgElement, "fill", "#373737");
                });

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
                const urlLink = `${ShortenerUrl}/${shortened}`;
                console.log("urlLink", urlLink);
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
                const remove = createNewElement("div", `url-list-6 remove-${urlId}`);

                // access 요소 내에 access select box 복사
                const originalSelectAccess = getElFromId("url_access");
                const clonedSelectAccess = originalSelectAccess.cloneNode(true);
                clonedSelectAccess.classList.add("text-center");
                clonedSelectAccess.classList.remove("border-b");
                clonedSelectAccess.classList.remove("border-[#d9d9d9]");
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
                    openModal(urlId);
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
                    `cursor-pointer page-btn-${i}`,
                    i,
                    `page_btn_${i}`
                );
                pageNumBtn.style.fontWeight = "600";
                pageNumBtn.style.marginRight = "10px";
                pageNumBtn.style.marginLeft = "10px";
                pageBtnWrap.appendChild(pageNumBtn);

                const currentPageNumber = getElFromSel(".url-list-title").getAttribute("data-page");

                if (i == currentPageNumber) {
                    pageNumBtn.style.cursor = "default";
                    pageNumBtn.style.color = "#bfbfbf";
                } else {
                    pageNumBtn.addEventListener("click", () => {
                        getUrlList(i);
                        setAttributeToElement(urlListTitle, "data-page", i);
                    });
                    hoverChangeTextColor(pageNumBtn, "#d9d9d9", "#373737");
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
        const modalAccess = getElFromId("url_access_modify");
        const modalPrefix = getElFromId("url_prefix_modify");
        const modalSuffix = getElFromId("url_suffix_modify");
        const modalShortenedUrl = getElFromId("url_shortened_info");
        const modalClick = getElFromId("url_click_info");
        const modalLastClicked = getElFromId("url_last_clicked_info");
        const modalCreated = getElFromId("url_created_at_info");
        const modalAccessCode = getElFromId("url_access_code_info");

        modalTargetUrl.value = "";
        modalNickname.value = "";
        modalAccess.value = "";
        if (modalPrefix) {
            modalPrefix.value = "";
        }
        if (modalSuffix) {
            modalSuffix.value = "";
        }
        if (modalShortenedUrl) {
            modalShortenedUrl.textContent = "";
        }
        modalClick.textContent = "";
        modalLastClicked.textContent = "";
        modalCreated.textContent = "";
        modalAccessCode.textContent = "";

        const expireModifyWrap = getElsFromSel(".flatpickr-wrapper")[1];
        if (expireModifyWrap) {
            expireModifyWrap.remove();
        }

        const flatpickr = getElsFromSel(".flatpickr-calendar")[1];
        if (flatpickr) {
            flatpickr.remove();
        }

        const modifySubmitBtn = getElFromId("modify_btn_url");
        if (modifySubmitBtn) {
            modifySubmitBtn.remove();
        }
        const modifyCloseBtn = getElFromId("modify_btn_close");
        if (modifyCloseBtn) {
            modifyCloseBtn.remove();
        }

        const refreshAccessCodeBtn = getElFromSel(".refresh-access-code-btn");
        if (refreshAccessCodeBtn) {
            refreshAccessCodeBtn.remove();
        }

        modalAccessCode.parentNode.parentNode.classList.remove("hidden");

        removeAttributeToElement(modifyModal, "data-id");
    }

    // url 입력 칸에서 Enter 키 입력 시 폼 제출
    setKeyForFunction(makeUrlInput, "Enter", makeUrl);

    // nickname 입력 칸에서 Enter 키 입력 시 폼 제출
    if (makeNicknameInput) {
        setKeyForFunction(makeNicknameInput, "Enter", makeUrl);
    }

    // suffix, prefix 입력 칸에서 Enter 키 입력 시 폼 제출
    const makePreInput = getElFromId("url_prefix");
    const makeSuffixInput = getElFromId("url_suffix");

    if (makePreInput) {
        setKeyForFunction(makePreInput, "Enter", makeUrl);
    }
    if (makeSuffixInput) {
        setKeyForFunction(makeSuffixInput, "Enter", makeUrl);
    }

    // make submit 버튼 마우스 오버 시 효과
    imageHover(makeSubmitBtn, "/static/img/icon/submit02.png", "/static/img/icon/submit01.png");

    // Datepicker 적용
    const fp = flatpickr("#url_expire_wrap", {
        minDate: "today",
        dateFormat: "Y-m-d",
        static: true,
        disableMobile: true,
        wrap: true,
    });

    // Date Input 선택 시 x 버튼 활성화
    const expireInput = getElFromId("url_expire");
    const svg = getElFromId("clearDate");

    expireInput.addEventListener("input", function () {
        if (expireInput.text) {
            svg.classList.add("hidden");
        } else {
            svg.classList.remove("hidden");
        }
    });

    async function modify(urlId) {
        const modalTargetUrl = getElFromId("url_target_modify");
        const modalNickname = getElFromId("url_nickname_modify");
        const modalExpire = getElFromId("url_expire_modify");
        const modalAccess = getElFromId("url_access_modify");
        const makeUrlPrefix = getElFromId("url_prefix_modify");
        const makeUrlSuffix = getElFromId("url_suffix_modify");

        let requestData = {};

        if (!getElFromId("url_target_modify").value) {
            displayErrorMessage("modify-url", "Please enter target url.");
            return;
        }
        requestData["target_url"] = modalTargetUrl.value;

        if (modalNickname && !modalNickname.value) {
            displayErrorMessage("modify-url", "Please enter nickname.");
            return;
        }
        requestData["nick_name"] = modalNickname.value;

        if (modalExpire.value) {
            requestData["expired_at"] = modalExpire.value;
        }

        requestData["access"] = modalAccess.value;

        if (url_license == 4) {
            if (makeUrlPrefix) {
                if (makeUrlPrefix.value) {
                    if (!isAlphaNumeric(makeUrlPrefix.value)) {
                        displayErrorMessage(
                            "modify-url",
                            "Prefix : alpha-numeric characters are allowed"
                        );
                        return;
                    } else if (makeUrlPrefix.value.length != 1) {
                        displayErrorMessage("modify-url", "Prefix : Please enter 1 character");
                        return;
                    }
                    requestData["prefix"] = makeUrlPrefix.value;
                }
            }
            if (makeUrlSuffix) {
                if (makeUrlSuffix.value) {
                    if (!isAlphaNumeric(makeUrlSuffix.value)) {
                        displayErrorMessage(
                            "modify-url",
                            "Suffix : alpha-numeric characters are allowed"
                        );
                        return;
                    } else if (makeUrlSuffix.value.length != 6) {
                        displayErrorMessage("modify-url", "Suffix : Please enter 6 characters");
                        return;
                    }
                    requestData["shortened_url"] = makeUrlSuffix.value;
                }
            }
        }

        console.log("modify- requestData", requestData);

        const data = setFetchData("put", requestData);

        // shortened_url api 호출
        console.log("modify url: ", `${ShortenerUrl}/shortener/${urlId}`);
        const modify_url_response = await fetch(`${ShortenerUrl}/shortener/${urlId}`, data);

        if (modify_url_response.status === 200) {
            const response_data = await modify_url_response.json();
            console.log("modify - response_data", response_data);
            closeModal();
            getUrlList();
        } else {
            const errorData = await modify_url_response.json();
            if (errorData) {
                console.log(errorData);
                displayErrorMessage("modify-url", errorData.detail);
            }
        }
    }

    // URL List 새로고침 버튼
    const refreshListBtn = getElFromSel(".refresh-list-btn");
    refreshListBtn.addEventListener("click", () => {
        const currentPageNumber = getElFromSel(".url-list-title").getAttribute("data-page");
        getUrlList(currentPageNumber);
    });

    // 화면 로드 시 실행될 함수 목록
    getUrlList(currentPageNumber);

    // 바깥 영역 클릭 시, 모달창 닫기
    document.addEventListener("mouseup", function (e) {
        const modifyModalWrap = getElFromId("modify_modal_wrap");
        const flatpickr = getElsFromSel(".flatpickr-calendar")[1];

        if (
            flatpickr &&
            !flatpickr.contains(e.target) &&
            modifyModalWrap &&
            !modifyModalWrap.contains(e.target)
        ) {
            closeModal();
        }
    });

    // Modal 창 내의 Expire Input 생성 함수
    const createExpireModifyInput = () => {
        const expireModifyWrap = createNewElement(
            "div",
            "relative flex items-center bg-white flatpickr",
            null,
            "url_expire_modify_wrap"
        );
        const expireModifyInput = createNewElement(
            "input",
            "w-full p-1 text-black outline-none md:w-[126px]",
            null,
            "url_expire_modify"
        );
        expireModifyInput.name = "url-expire";
        expireModifyInput.autocomplete = "off";
        expireModifyInput.autofocus = true;
        expireModifyInput.tabIndex = "8";
        expireModifyInput.placeholder = "Expire";
        expireModifyInput.dataset.input = "";
        const expireModifyClear = createNewElement("a", "", null, "clear_data_modify");
        expireModifyClear.title = "clear";
        expireModifyClear.dataset.clear = "";
        const expireClearSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="black"
            class="w-6 h-6 p-1 mr-1 cursor-pointer"
            id="clearDate_modify">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        `;
        const expireClearParser = new DOMParser();
        const expireClearSvgDOM = expireClearParser.parseFromString(
            expireClearSvg,
            "image/svg+xml"
        );
        const expireClearSvgBtn = expireClearSvgDOM.documentElement;

        expireModifyClear.appendChild(expireClearSvgBtn);
        expireModifyWrap.appendChild(expireModifyInput);
        expireModifyWrap.appendChild(expireModifyClear);

        const expireFormField = getElFromId("form_field_expire_modify");
        expireFormField.appendChild(expireModifyWrap);
    };

    // body 태그 scrollbar hide
    const body = getElFromSel("body");
    body.classList.add("scrollbar-hide");
    body.classList.remove("scrollbar-thin");
    body.classList.remove("scrollbar-thumb-black");
    body.classList.remove("scrollbar-thumb");
});
