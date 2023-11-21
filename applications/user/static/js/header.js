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
    getShortenerURL,
    getCurrentPath,
    changeLogoText,
    getJobURL,
    setKeyForFunction,
} from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    // Change logo text
    changeLogoText("/url/", "URL");
    changeLogoText("/job/", "JOB");

    // Shortener Url Service URL
    const ShortenerUrl = getShortenerURL();
    const JobUrl = getJobURL();

    const adminBtn = getElFromId("header_admin_btn");
    const adminBtnWrap = getElFromId("admin_btn_wrap");
    const adminUserBtn = getElFromId("header_admin_user_btn");
    const adminUrlBtn = getElFromId("header_admin_url_btn");
    const adminJobBtn = getElFromId("header_admin_job_btn");
    const urlBtn = getElFromId("header_url_btn");
    const jdBtn = getElFromId("header_jd_btn");
    const loginBtn = getElFromId("header_login_btn");
    const myInfoBtn = getElFromId("header_my_info_btn");

    // url, jd 버튼 마우스 오버 시 효과
    imageHover(urlBtn, "/static/img/icon/url06.png", "/static/img/icon/url05.png");
    imageHover(jdBtn, "/static/img/icon/job-post02.png", "/static/img/icon/job-post01.png");

    // admin 버튼 마우스 오버 시 효과 + 클릭 시 Admin 메뉴 보이기

    if (adminBtn) {
        imageHover(adminBtn, "/static/img/icon/admin03.png", "/static/img/icon/admin02.png");

        const onClickAdminBtn = () => {
            const headerAdminMenu = getElFromId("header_admin_menu");
            if (headerAdminMenu.classList.contains("hidden")) {
                headerAdminMenu.classList.remove("hidden");
                headerAdminMenu.classList.add("flex");
            } else {
                headerAdminMenu.classList.add("hidden");
                headerAdminMenu.classList.remove("flex");
            }
        };

        // admin 버튼을 클릭할 때 드롭다운 메뉴의 표시/숨김을 토글
        adminBtn.addEventListener("click", () => {
            onClickAdminBtn();
        });
    }

    // User Admin 버튼 마우스 오버 시 효과 + 클릭 시 User 앱 admin 페이지로 이동
    if (adminUserBtn) {
        imageHover(
            adminUserBtn,
            "/static/img/icon/admin_user03.png",
            "/static/img/icon/admin_user02.png"
        );
        adminUserBtn.addEventListener("click", function () {
            window.open("/admin/", "_blank");
            this.parentNode.parentNode.classList.add("hidden");
        });
    }

    // Url Admin 버튼 마우스 오버 시 효과 + 클릭 시 Url 앱 admin 페이지로 이동
    if (adminUrlBtn) {
        imageHover(
            adminUrlBtn,
            "/static/img/icon/admin_url03.png",
            "/static/img/icon/admin_url02.png"
        );
        adminUrlBtn.addEventListener("click", function () {
            window.open(`${ShortenerUrl}/admin/`, "_blank");
            this.parentNode.parentNode.classList.add("hidden");
        });
    }

    // Job Admin 버튼 마우스 오버 시 효과 + 클릭 시 Job 앱 admin 페이지로 이동
    if (adminJobBtn) {
        imageHover(
            adminJobBtn,
            "/static/img/icon/admin_job03.png",
            "/static/img/icon/admin_job02.png"
        );
        adminJobBtn.addEventListener("click", function () {
            window.open(`${JobUrl}/admin/`, "_blank");
            this.parentNode.parentNode.classList.add("hidden");
        });
    }

    if (loginBtn) {
        // login 버튼 마우스 오버 시 효과
        imageHover(loginBtn, "/static/img/icon/login02.png", "/static/img/icon/login01.png");
    }

    if (myInfoBtn) {
        myInfoBtn.addEventListener("click", logout);

        async function logout() {
            const data = setFetchData("delete", {});

            const logout_response = await fetch("/api/user/auth", data);

            if (logout_response.status == 202) {
                location.href = "/";
            } else if (logout_response.status == 400) {
                console.log(logout_response);
            }
        }

        // logout 버튼 마우스 오버 시 효과
        imageHover(myInfoBtn, "/static/img/icon/user02.png", "/static/img/icon/user01.png");
    }

    // esc 버튼 클릭 시 모달창 닫기
    setKeyForFunction(document, "Escape", () => {
        const headerAdminMenu = getElFromId("header_admin_menu");
        if (headerAdminMenu) {
            headerAdminMenu.classList.add("hidden");
            return;
        }
    });

    // 바깥 영역 클릭 시, 모달창 닫기
    document.addEventListener("mouseup", function (e) {
        const headerAdminMenu = getElFromId("header_admin_menu");
        const adminBtn = getElFromId("header_admin_btn");

        if (!headerAdminMenu.contains(e.target) && !adminBtn.contains(e.target)) {
            headerAdminMenu.classList.add("hidden");
        }
    });
});
