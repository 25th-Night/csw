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

    // x 버튼 클릭 시 브라우저 닫기
    const closeBrowserBtn = getElFromSel(".close-browser-btn");
    closeBrowserBtn.addEventListener("click", () => {
        window.close();
    });
});
