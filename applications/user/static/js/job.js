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
} from "./common.js";

document.addEventListener("DOMContentLoaded", async function () {
    // Job Service URL
    const JobURL = getJobURL();
    let getJobListURL = `${JobURL}/recruits`;

    const requestSetting = async (type) => {
        const data = setFetchData("get", queryParameterDict);
        const requestURL = `${JobURL}/settings/${type}`;
        const get_response = await fetch(requestURL, data);

        return get_response;
    };

    const renderSelectBoxForSetting = (queryParameterDict, type) => {
        // Select box 만들기

        console.log(
            `renderListForSetting - queryParameterDictForSetting - ${type}`,
            queryParameterDict
        );
        let groupURL;
        let categoryUrl = "categories";
        let countryUrl;
        let regionURL = "regions";
        let detailRegionURL = "detail_regions";

        if (queryParameterDict.group_id > 0) {
            categoryUrl += `?group_id=${queryParameterDict.group_id}`;
        }

        if (queryParameterDict.country_id > 0) {
            regionURL += `?country_id=${queryParameterDict.country_id}`;
            detailRegionURL += `?country_id=${queryParameterDict.country_id}`;
        }

        if (queryParameterDict.region_id > 0) {
            if (queryParameterDict.country_id > 0) {
                detailRegionURL += `&region_id=${queryParameterDict.region_id}`;
            } else {
                detailRegionURL += `?region_id=${queryParameterDict.region_id}`;
            }
        }

        makeSelectOptions(
            JobURL,
            "sites",
            `setting_modal_${type}_filter_site`,
            true,
            queryParameterDict.site_id
        );
        makeSelectOptions(
            JobURL,
            "groups",
            `setting_modal_${type}_filter_group`,
            true,
            queryParameterDict.group_id
        );
        makeSelectOptions(
            JobURL,
            categoryUrl,
            `setting_modal_${type}_filter_category`,
            true,
            queryParameterDict.category_ids,
            queryParameterDict.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            `setting_modal_${type}_filter_country`,
            true,
            queryParameterDict.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURL,
            `setting_modal_${type}_filter_region`,
            true,
            queryParameterDict.region_id,
            queryParameterDict.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            `setting_modal_${type}_filter_detail_region`,
            true,
            queryParameterDict.detail_region_id,
            queryParameterDict.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "skills",
            `setting_modal_${type}_filter_skill`,
            true,
            queryParameterDict.skill_ids
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            `setting_modal_${type}_filter_company_tag`,
            true,
            queryParameterDict.company_tag_ids
        );
    };

    const saveSetting = async (queryParameterDict, type) => {
        const data = setFetchData("put", queryParameterDict);
        console.log(`saveSetting - queryParameterDict : type - ${type}`, queryParameterDict);
        const requestURL = `${JobURL}/settings/${type}`;
        const get_response = await fetch(requestURL, data);
        if (get_response.status == 200) {
            alert("Saved successfully");
            return get_response;
        } else {
            alert(await get_response.json());
        }
    };

    // 상단 3버튼 - 버튼별 클릭 이벤트 추가
    const addClickEventToPostBtn = () => {
        createJobBtn(jobPostBtnImgDict);
        getElFromId("post_wrap").classList.remove("hidden");
        getElFromId("crawling_wrap").classList.add("hidden");
        // getElFromId("manage_wrap").classList.add("hidden");
        getElFromId("job_crawling_btn").addEventListener("click", () => {
            addClickEventToCrawlingBtn(jobCrawlingBtnImgDict);
        });
        // getElFromId("job_manage_btn").addEventListener("click", () => {
        //     addClickEventToManageBtn(jobManageBtnImgDict);
        // });
        renderPostList(queryParameterDict);
        removeAllNode(getElFromId("crawling_job_card_list"));
    };

    const addClickEventToCrawlingBtn = async () => {
        createJobBtn(jobCrawlingBtnImgDict);
        getElFromId("crawling_wrap").classList.remove("hidden");
        getElFromId("post_wrap").classList.add("hidden");
        // getElFromId("manage_wrap").classList.add("hidden");
        getElFromId("job_post_btn").addEventListener("click", () => {
            addClickEventToPostBtn(jobPostBtnImgDict);
        });
        // getElFromId("job_manage_btn").addEventListener("click", () => {
        //     addClickEventToManageBtn(jobManageBtnImgDict);
        // });
        removeAllNode(getElFromId("post_job_card_list"));

        let crawlingQueryParameterDict;
        const crawlingSettingResponse = await requestSetting(2);
        const getCrawlingSettingStatus = crawlingSettingResponse.status;
        const crawlingSettingData = await crawlingSettingResponse.json();
        if (getCrawlingSettingStatus == 200) {
            crawlingQueryParameterDict = crawlingSettingData;
        } else {
            alert("Cannot access Crawling Setting");
        }

        const siteSelectInCrawling = getElFromId("crawling_filter_site");
        const groupSelectInCrawling = getElFromId("crawling_filter_group");
        const categorySelectInCrawling = getElFromId("crawling_filter_category");
        const countrySelectInCrawling = getElFromId("crawling_filter_country");
        const regionSelectInCrawling = getElFromId("crawling_filter_region");
        const detailRegionSelectInCrawling = getElFromId("crawling_filter_detail_region");
        const skillSelectInCrawling = getElFromId("crawling_filter_skill");
        const companyTagSelectInCrawling = getElFromId("crawling_filter_company_tag");
        const minCareerSelectInCrawling = getElFromId("crawling_filter_min_career");

        const crawlingSearchBtn = getElFromId("crawling_search_btn");
        crawlingSearchBtn.style.writingMode = "vertical-rl";
        crawlingSearchBtn.style.textOrientation = "upright";

        // Select Box 렌터링
        const crawlingFilterElementIdDict = {
            site: "crawling_filter_site",
            group: "crawling_filter_group",
            category: "crawling_filter_category",
            country: "crawling_filter_country",
            region: "crawling_filter_region",
            detail_region: "crawling_filter_detail_region",
            skill: "crawling_filter_skill",
            company_tag: "crawling_filter_company_tag",
        };
        renderSelectBox(crawlingQueryParameterDict, crawlingFilterElementIdDict);
    };

    const addClickEventToManageBtn = () => {
        createJobBtn(jobManageBtnImgDict);
        // getElFromId("manage_wrap").classList.remove("hidden");
        getElFromId("post_wrap").classList.add("hidden");
        getElFromId("crawling_wrap").classList.add("hidden");
        getElFromId("job_crawling_btn").addEventListener("click", () => {
            addClickEventToCrawlingBtn(jobCrawlingBtnImgDict);
        });
        getElFromId("job_post_btn").addEventListener("click", () => {
            addClickEventToPostBtn(jobPostBtnImgDict);
        });
    };

    // 상단 3버튼 - 생성
    const createJobBtn = (imgListDict) => {
        const titleBtnWrap = getElFromId("title_btn_wrap");

        const jobPostBtn = createNewElement(
            "img",
            "block h-6 ml-2 mr-5 cursor-pointer sm:h-8 job-post-btn",
            null,
            "job_post_btn"
        );
        jobPostBtn.setAttribute("src", `/static/img/icon/${imgListDict.post.before}`);
        jobPostBtn.setAttribute("alt", "job-post-btn");

        const jobCrawlingBtn = createNewElement(
            "img",
            "block h-6 ml-2 mr-5 cursor-pointer sm:h-8 job-crawling-btn",
            null,
            "job_crawling_btn"
        );
        jobCrawlingBtn.setAttribute("src", `/static/img/icon/gathering05.png`);
        jobCrawlingBtn.setAttribute("alt", "job-crawling-btn");

        const jobManageBtn = createNewElement(
            "img",
            "block h-6 ml-2 mr-5 cursor-pointer sm:h-8 job-manage-btn",
            null,
            "job_manage_btn"
        );
        jobManageBtn.setAttribute("src", `/static/img/icon/manage01.png`);
        jobManageBtn.setAttribute("alt", "job-manage-btn");

        imageHover(
            jobPostBtn,
            `/static/img/icon/${imgListDict.post.after}`,
            `/static/img/icon/${imgListDict.post.before}`
        );
        imageHover(
            jobCrawlingBtn,
            `/static/img/icon/${imgListDict.crawling.after}`,
            `/static/img/icon/${imgListDict.crawling.before}`
        );
        imageHover(
            jobManageBtn,
            `/static/img/icon/${imgListDict.manage.after}`,
            `/static/img/icon/${imgListDict.manage.before}`
        );

        removeAllNode(titleBtnWrap);
        titleBtnWrap.appendChild(jobPostBtn);
        titleBtnWrap.appendChild(jobCrawlingBtn);
        titleBtnWrap.appendChild(jobManageBtn);
    };

    // 상단 3버튼 - 마우스오버
    const setImgJobBtn = (imgListDict) => {
        const titleBtnWrap = getElFromId("title_btn_wrap");

        const jobPostBtn = getElFromId("job_post_btn");
        const jobCrawlingBtn = getElFromId("job_crawling_btn");
        const jobManageBtn = getElFromId("job_manage_btn");

        imageHover(
            jobPostBtn,
            `/static/img/icon/${imgListDict.post.after}`,
            `/static/img/icon/${imgListDict.post.before}`
        );
        imageHover(
            jobCrawlingBtn,
            `/static/img/icon/${imgListDict.crawling.after}`,
            `/static/img/icon/${imgListDict.crawling.before}`
        );
        imageHover(
            jobManageBtn,
            `/static/img/icon/${imgListDict.manage.after}`,
            `/static/img/icon/${imgListDict.manage.before}`
        );

        removeAllNode(titleBtnWrap);
        titleBtnWrap.appendChild(jobPostBtn);
        titleBtnWrap.appendChild(jobCrawlingBtn);
        titleBtnWrap.appendChild(jobManageBtn);
    };

    /////////////////////////////////////////////////////// Page Header

    //////////////////////////////// Job 관련 3개 버튼
    // 버튼 생성
    const jobPostBtnImgDict = {
        post: {
            before: "job-post04.png",
            after: "job-post03.png",
        },
        crawling: {
            before: "gathering05.png",
            after: "gathering07.png",
        },
        manage: {
            before: "manage01.png",
            after: "manage02.png",
        },
    };
    const jobCrawlingBtnImgDict = {
        post: {
            before: "job-post03.png",
            after: "job-post04.png",
        },
        crawling: {
            before: "gathering07.png",
            after: "gathering05.png",
        },
        manage: {
            before: "manage01.png",
            after: "manage02.png",
        },
    };
    const jobManageBtnImgDict = {
        post: {
            before: "job-post03.png",
            after: "job-post04.png",
        },
        crawling: {
            before: "gathering05.png",
            after: "gathering07.png",
        },
        manage: {
            before: "manage02.png",
            after: "manage01.png",
        },
    };

    createJobBtn(jobPostBtnImgDict);
    setImgJobBtn(jobPostBtnImgDict);

    const jobPostBtn = getElFromId("job_post_btn");
    const jobCrawlingBtn = getElFromId("job_crawling_btn");
    const jobManageBtn = getElFromId("job_manage_btn");
    jobPostBtn.addEventListener("click", () => {
        addClickEventToPostBtn();
    });
    jobCrawlingBtn.addEventListener("click", () => {
        addClickEventToCrawlingBtn();
    });
    jobManageBtn.addEventListener("click", () => {
        addClickEventToManageBtn();
    });

    //////////////////////////////// setting 버튼
    const settingBtn = getElFromId("job_setting_btn");

    // setting 모달 오픈
    const openModalToSetting = async () => {
        // 모달 요소에서 hidden 속성 제거
        const settingModal = getElFromId("setting_modal");
        settingModal.classList.remove("hidden");

        // body의 스크롤 방지
        const body = getElFromSel("body");
        body.style.overflow = "hidden";

        // save 버튼 추가
        // - Post Setting Save 버튼
        const saveBtnForPostSetting = createNewElement(
            "div",
            "flex items-center font-semibold cursor-pointer hover:text-[#373737] hover:border-none hover:bg-white justify-center border border-white w-10 p-2 text-sm setting-modal-post-save-btn",
            "SAVE",
            "setting_modal_post_save_btn"
        );

        const settingModalPostData = getElFromId("setting_modal_post_data");
        settingModalPostData.appendChild(saveBtnForPostSetting);

        saveBtnForPostSetting.addEventListener("click", () => {
            saveSetting(queryParameterDictForPostSetting, 1);
        });

        // - Crawling Setting Save 버튼
        const saveBtnForCrawlingSetting = createNewElement(
            "div",
            "flex items-center font-semibold cursor-pointer hover:text-[#373737] hover:border-none hover:bg-white justify-center border border-white w-10 p-2 text-sm setting-modal-crawling-save-btn",
            "SAVE",
            "setting_modal_crawling_save_btn"
        );

        const settingModalCrawlingData = getElFromId("setting_modal_crawling_data");
        settingModalCrawlingData.appendChild(saveBtnForCrawlingSetting);

        saveBtnForCrawlingSetting.addEventListener("click", () => {
            saveSetting(queryParameterDictForCrawlingSetting, 2);
        });

        ////////////////////////////////// Post Setting
        const postSettingResponse = await requestSetting(1);
        const getPostSettingStatus = postSettingResponse.status;
        const postSettingData = await postSettingResponse.json();

        console.log(getPostSettingStatus, postSettingData);

        let queryParameterDictForPostSetting = postSettingData;

        // Post Settings SelectBox 만들기
        const siteSelectForPostSetting = getElFromId("setting_modal_post_filter_site");
        const groupSelectForPostSetting = getElFromId("setting_modal_post_filter_group");
        const categorySelectForPostSetting = getElFromId("setting_modal_post_filter_category");
        const countrySelectForPostSetting = getElFromId("setting_modal_post_filter_country");
        const regionSelectForPostSetting = getElFromId("setting_modal_post_filter_region");
        const detailRegionSelectForPostSetting = getElFromId(
            "setting_modal_post_filter_detail_region"
        );
        const skillSelectForPostSetting = getElFromId("setting_modal_post_filter_skill");
        const companyTagSelectForPostSetting = getElFromId("setting_modal_post_filter_company_tag");
        const minCareerSelectForPostSetting = getElFromId("setting_modal_post_filter_min_career");
        let groupURLForPostSetting;
        let categoryURLForPostSetting = "categories";
        let countryURLForPostSetting;
        let regionURLForPostSetting = "regions";
        let detailRegionURLForPostSetting = "detail_regions";

        if (queryParameterDictForPostSetting.group_id > 0) {
            categoryURLForPostSetting += `?group_id=${queryParameterDictForPostSetting.group_id}`;
        }

        if (queryParameterDictForPostSetting.country_id > 0) {
            regionURLForPostSetting += `?country_id=${queryParameterDictForPostSetting.country_id}`;
            detailRegionURLForPostSetting += `?country_id=${queryParameterDictForPostSetting.country_id}`;
        }

        if (queryParameterDictForPostSetting.region_id > 0) {
            if (queryParameterDictForPostSetting.country_id > 0) {
                detailRegionURLForPostSetting += `&region_id=${queryParameterDictForPostSetting.region_id}`;
            } else {
                detailRegionURLForPostSetting += `?region_id=${queryParameterDictForPostSetting.region_id}`;
            }
        }

        makeSelectOptions(
            JobURL,
            "sites",
            "setting_modal_post_filter_site",
            true,
            queryParameterDictForPostSetting.site_id
        );
        makeSelectOptions(
            JobURL,
            "groups",
            "setting_modal_post_filter_group",
            true,
            queryParameterDictForPostSetting.group_id
        );
        makeSelectOptions(
            JobURL,
            categoryURLForPostSetting,
            "setting_modal_post_filter_category",
            true,
            queryParameterDictForPostSetting.category_ids,
            queryParameterDictForPostSetting.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            "setting_modal_post_filter_country",
            true,
            queryParameterDictForPostSetting.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURLForPostSetting,
            "setting_modal_post_filter_region",
            true,
            queryParameterDictForPostSetting.region_id,
            queryParameterDictForPostSetting.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURLForPostSetting,
            "setting_modal_post_filter_detail_region",
            true,
            queryParameterDictForPostSetting.detail_region_id,
            queryParameterDictForPostSetting.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "skills",
            "setting_modal_post_filter_skill",
            true,
            queryParameterDictForPostSetting.skill_ids
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            "setting_modal_post_filter_company_tag",
            true,
            queryParameterDictForPostSetting.company_tag_ids
        );
        changeJobListURL(siteSelectForPostSetting, queryParameterDictForPostSetting, "site_id", [
            "group_id",
            "category_ids",
            "country_id",
            "region_id",
            "detail_region_id",
        ]);
        changeJobListURL(groupSelectForPostSetting, queryParameterDictForPostSetting, "group_id", [
            "category_ids",
        ]);
        changeJobListURL(
            categorySelectForPostSetting,
            queryParameterDictForPostSetting,
            "category_ids"
        );
        changeJobListURL(
            countrySelectForPostSetting,
            queryParameterDictForPostSetting,
            "country_id",
            ["region_id", "detail_region_id"]
        );
        changeJobListURL(
            regionSelectForPostSetting,
            queryParameterDictForPostSetting,
            "region_id",
            ["detail_region_id"]
        );
        changeJobListURL(
            detailRegionSelectForPostSetting,
            queryParameterDictForPostSetting,
            "detail_region_id"
        );
        changeJobListURL(skillSelectForPostSetting, queryParameterDictForPostSetting, "skill_ids");
        changeJobListURL(
            companyTagSelectForPostSetting,
            queryParameterDictForPostSetting,
            "company_tag_ids"
        );
        changeJobListURL(
            minCareerSelectForPostSetting,
            queryParameterDictForPostSetting,
            "min_career"
        );

        siteSelectForPostSetting.addEventListener("change", () => {
            renderSelectBoxForSetting(queryParameterDictForPostSetting, "post");
        });
        groupSelectForPostSetting.addEventListener("change", () => {
            renderSelectBoxForSetting(queryParameterDictForPostSetting, "post");
        });
        countrySelectForPostSetting.addEventListener("change", () => {
            renderSelectBoxForSetting(queryParameterDictForPostSetting, "post");
        });
        regionSelectForPostSetting.addEventListener("change", () => {
            renderSelectBoxForSetting(queryParameterDictForPostSetting, "post");
        });

        ////////////////////////////////// Crawling Setting
        const crawlingSettingResponse = await requestSetting(2);
        const getCrawlingSettingStatus = crawlingSettingResponse.status;
        const crawlingSettingData = await crawlingSettingResponse.json();

        console.log(getCrawlingSettingStatus, crawlingSettingData);

        let queryParameterDictForCrawlingSetting = crawlingSettingData;

        // Crawling Settings SelectBox 만들기
        const siteSelectForCrawlingSetting = getElFromId("setting_modal_crawling_filter_site");
        const groupSelectForCrawlingSetting = getElFromId("setting_modal_crawling_filter_group");
        const categorySelectForCrawlingSetting = getElFromId(
            "setting_modal_crawling_filter_category"
        );
        const countrySelectForCrawlingSetting = getElFromId(
            "setting_modal_crawling_filter_country"
        );
        const regionSelectForCrawlingSetting = getElFromId("setting_modal_crawling_filter_region");
        const detailRegionSelectForCrawlingSetting = getElFromId(
            "setting_modal_crawling_filter_detail_region"
        );
        const skillSelectForCrawlingSetting = getElFromId("setting_modal_crawling_filter_skill");
        const companyTagSelectForCrawlingSetting = getElFromId(
            "setting_modal_crawling_filter_company_tag"
        );
        const minCareerSelectForCrawlingSetting = getElFromId(
            "setting_modal_crawling_filter_min_career"
        );
        let groupURLForCrawlingSetting;
        let categoryURLForCrawlingSetting = "categories";
        let countryURLForCrawlingSetting;
        let regionURLForCrawlingSetting = "regions";
        let detailRegionURLForCrawlingSetting = "detail_regions";

        if (queryParameterDictForCrawlingSetting.group_id > 0) {
            categoryURLForCrawlingSetting += `?group_id=${queryParameterDictForCrawlingSetting.group_id}`;
        }

        if (queryParameterDictForCrawlingSetting.country_id > 0) {
            regionURLForCrawlingSetting += `?country_id=${queryParameterDictForCrawlingSetting.country_id}`;
            detailRegionURLForCrawlingSetting += `?country_id=${queryParameterDictForCrawlingSetting.country_id}`;
        }

        if (queryParameterDictForCrawlingSetting.region_id > 0) {
            if (queryParameterDictForCrawlingSetting.country_id > 0) {
                detailRegionURLForCrawlingSetting += `&region_id=${queryParameterDictForCrawlingSetting.region_id}`;
            } else {
                detailRegionURLForCrawlingSetting += `?region_id=${queryParameterDictForCrawlingSetting.region_id}`;
            }
        }

        makeSelectOptions(
            JobURL,
            "sites",
            "setting_modal_crawling_filter_site",
            true,
            queryParameterDictForCrawlingSetting.site_id
        );
        makeSelectOptions(
            JobURL,
            "groups",
            "setting_modal_crawling_filter_group",
            true,
            queryParameterDictForCrawlingSetting.group_id
        );
        makeSelectOptions(
            JobURL,
            categoryURLForCrawlingSetting,
            "setting_modal_crawling_filter_category",
            true,
            queryParameterDictForCrawlingSetting.category_ids,
            queryParameterDictForCrawlingSetting.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            "setting_modal_crawling_filter_country",
            true,
            queryParameterDictForCrawlingSetting.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURLForCrawlingSetting,
            "setting_modal_crawling_filter_region",
            true,
            queryParameterDictForCrawlingSetting.region_id,
            queryParameterDictForCrawlingSetting.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURLForCrawlingSetting,
            "setting_modal_crawling_filter_detail_region",
            true,
            queryParameterDictForCrawlingSetting.detail_region_id,
            queryParameterDictForCrawlingSetting.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "skills",
            "setting_modal_crawling_filter_skill",
            true,
            queryParameterDictForCrawlingSetting.skill_ids
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            "setting_modal_crawling_filter_company_tag",
            true,
            queryParameterDictForCrawlingSetting.company_tag_ids
        );
        changeJobListURL(
            siteSelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "site_id",
            ["group_id", "category_ids", "country_id", "region_id", "detail_region_id"]
        );
        changeJobListURL(
            groupSelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "group_id",
            ["category_ids"]
        );
        changeJobListURL(
            categorySelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "category_ids"
        );
        changeJobListURL(
            countrySelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "country_id",
            ["region_id", "detail_region_id"]
        );
        changeJobListURL(
            regionSelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "region_id",
            ["detail_region_id"]
        );
        changeJobListURL(
            detailRegionSelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "detail_region_id"
        );
        changeJobListURL(
            skillSelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "skill_ids"
        );
        changeJobListURL(
            companyTagSelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "company_tag_ids"
        );
        changeJobListURL(
            minCareerSelectForCrawlingSetting,
            queryParameterDictForCrawlingSetting,
            "min_career"
        );

        siteSelectForCrawlingSetting.addEventListener("change", () => {
            renderSelectBoxForSetting(queryParameterDictForCrawlingSetting, "crawling");
        });
        groupSelectForCrawlingSetting.addEventListener("change", () => {
            renderSelectBoxForSetting(queryParameterDictForCrawlingSetting, "crawling");
        });
        countrySelectForCrawlingSetting.addEventListener("change", () => {
            renderSelectBoxForSetting(queryParameterDictForCrawlingSetting, "crawling");
        });
        regionSelectForCrawlingSetting.addEventListener("change", () => {
            renderSelectBoxForSetting(queryParameterDictForCrawlingSetting, "crawling");
        });

        ////////////////////////////////// Manage Setting

        ////////////////////////////////// Close Setting
        // 모달 close 버튼
        const postModalCloseSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#FFFFFF"
                class="w-6 h-6 p-1 cursor-pointer md:w-8 md:h-8"
                id="setting_modal_close_btn">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        `;
        const postModalCloseParser = new DOMParser();
        const postModalCloseSvgDOM = postModalCloseParser.parseFromString(
            postModalCloseSvg,
            "image/svg+xml"
        );
        const postModalCloseSvgBtn = postModalCloseSvgDOM.documentElement;

        // close 버튼 클릭 시 모달창 닫기
        postModalCloseSvgBtn.addEventListener("click", () => {
            // 모달 숨기기
            settingModal.classList.add("hidden");

            // 모달 내부 데이터 비우기
            removeAllNode(getElFromId("setting_modal_btn_wrap"));
            removeAllNode(siteSelectForPostSetting);
            removeAllNode(groupSelectForPostSetting);
            removeAllNode(categorySelectForPostSetting);
            removeAllNode(countrySelectForPostSetting);
            removeAllNode(regionSelectForPostSetting);
            removeAllNode(detailRegionSelectForPostSetting);
            removeAllNode(skillSelectForPostSetting);
            removeAllNode(companyTagSelectForPostSetting);
            minCareerSelectForPostSetting.value = 0;
            saveBtnForPostSetting.remove();
            saveBtnForCrawlingSetting.remove();

            // body의 스크롤 원상복구
            const body = getElFromSel("body");
            body.style.overflow = "";
        });

        getElFromId("setting_modal_btn_wrap").appendChild(postModalCloseSvgBtn);

        // esc 버튼 클릭 시 모달창 닫기
        setKeyForFunction(document, "Escape", () => {
            // 모달 숨기기
            settingModal.classList.add("hidden");

            // 모달 내부 데이터 비우기
            removeAllNode(getElFromId("setting_modal_btn_wrap"));
            removeAllNode(siteSelectForPostSetting);
            removeAllNode(groupSelectForPostSetting);
            removeAllNode(categorySelectForPostSetting);
            removeAllNode(countrySelectForPostSetting);
            removeAllNode(regionSelectForPostSetting);
            removeAllNode(detailRegionSelectForPostSetting);
            removeAllNode(skillSelectForPostSetting);
            removeAllNode(companyTagSelectForPostSetting);
            minCareerSelectForPostSetting.value = 0;
            saveBtnForPostSetting.remove();
            saveBtnForCrawlingSetting.remove();

            // body의 스크롤 원상복구
            const body = getElFromSel("body");
            body.style.overflow = "";
        });
    };

    /////////////////////////////////////////////////////// POST page
    let queryParameterDict;
    const postSettingResponse = await requestSetting(1);
    const getPostSettingStatus = postSettingResponse.status;
    const postSettingData = await postSettingResponse.json();
    if (getPostSettingStatus == 200) {
        queryParameterDict = postSettingData;
    } else {
        alert("Cannot access Post Setting");
    }

    const siteSelect = getElFromId("post_filter_site");
    const groupSelect = getElFromId("post_filter_group");
    const categorySelect = getElFromId("post_filter_category");
    const countrySelect = getElFromId("post_filter_country");
    const regionSelect = getElFromId("post_filter_region");
    const detailRegionSelect = getElFromId("post_filter_detail_region");
    const skillSelect = getElFromId("post_filter_skill");
    const companyTagSelect = getElFromId("post_filter_company_tag");
    const minCareerSelect = getElFromId("post_filter_min_career");

    const searchBtn = getElFromId("post_search_btn");
    // searchBtn.style.writingMode = "vertical-rl";
    // searchBtn.style.textOrientation = "upright";

    const changeJobListURL = (
        selectEl,
        queryParameterDict,
        queryParameter,
        relatedQueryParameters = null
    ) => {
        selectEl.addEventListener("change", () => {
            queryParameterDict[queryParameter] = selectEl.value;
            if (relatedQueryParameters) {
                relatedQueryParameters.forEach((relatedQueryParameter) => {
                    queryParameterDict[relatedQueryParameter] = 0;
                });
            }
            console.log("change queryParameterDict", queryParameterDict);
            let queryParams = makeQueryParameter(queryParameterDict);
            console.log("queryParams", queryParams);
        });
    };

    const makeJobRow = (recruit, attribute) => {
        const rowWrap = createNewElement(
            "div",
            `flex my-2 text-sm h-20 post-job-${attribute}-wrap-${recruit.id}`,
            null,
            `post_job_${attribute}_wrap_${recruit.id}`
        );
        const rowLabel = createNewElement(
            "div",
            `h-full pr-2 border-r border-[#373737] font-bold post-job-${attribute}-label-${recruit.id}`,
            capitalize(attribute),
            `post_job-${attribute}-label-${recruit.id}`
        );
        rowLabel.style.width = "100px";
        const rowData = createNewElement(
            "div",
            `h-full overflow-hidden post-job-${attribute}-${recruit.id}`,
            recruit[attribute],
            `post_job_${attribute}_${recruit.id}`
        );
        rowData.style.whiteSpace = "pre";
        rowData.style.textOverflow = "ellipsis";
        rowData.style.flex = "1";
        rowData.style.paddingLeft = "8px";

        rowWrap.appendChild(rowLabel);
        rowWrap.appendChild(rowData);

        return rowWrap;
    };

    const makeJobCompany = (recruit) => {
        const jobCompany = createNewElement(
            "div",
            `flex truncate justify-center my-2 w-1/2 cursor-pointer border-b border-[#373737] hover:underline font-semibold post-job-company-${recruit.id}`,
            recruit.company.name,
            `post_job_company_${recruit.id}`
        );
        jobCompany.style.paddingBottom = "8px";
        jobCompany.addEventListener("click", () => {
            window.open(
                `https://www.jobplanet.co.kr/search?query=${recruit.company.name}`,
                "_blank"
            );
        });
        jobCompany.setAttribute("title", "Search for the company on JobPlanet");

        return jobCompany;
    };

    const makeRowBody = (recruit) => {
        const jobBodyWrap = createNewElement(
            "div",
            `grid grid-cols-1 grid-rows-3 post-job-body-wrap-${recruit.id}`,
            null,
            `post_job_body_wrap_${recruit.id}`
        );
        const jobTask = makeJobRow(recruit, "task");
        const jobRequirement = makeJobRow(recruit, "requirement");
        const jobPreference = makeJobRow(recruit, "preference");

        jobBodyWrap.appendChild(jobTask);
        jobBodyWrap.appendChild(jobRequirement);
        jobBodyWrap.appendChild(jobPreference);
        return jobBodyWrap;
    };

    const makeRowBottom = (recruit) => {
        const bottomWrap = createNewElement(
            "div",
            `flex flex-col my-1 items-center xl:flex-row post-bottom-wrap-${recruit.id}`,
            null,
            `post_bottom_wrap_${recruit.id}`
        );
        const regionWrap = createNewElement(
            "div",
            `flex items-center w-full xl:w-auto post-region-wrap-${recruit.id}`,
            null,
            `post_region_wrap_${recruit.id}`
        );
        const jobRegion = createNewElement(
            "div",
            `mr-2 w-8 font-semibold post-job-region-${recruit.id}`,
            recruit.detail_region.region.name,
            `post_job_region_${recruit.id}`
        );
        const likeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 w-5 h-5 cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        `;
        const likeParser = new DOMParser();
        const likeSvgDOM = likeParser.parseFromString(likeSvg, "image/svg+xml");
        const likeSvgBtn = likeSvgDOM.documentElement;
        const scrapSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 w-5 h-5 cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
        `;
        const scrapParser = new DOMParser();
        const scrapSvgDOM = scrapParser.parseFromString(scrapSvg, "image/svg+xml");
        const scrapSvgBtn = scrapSvgDOM.documentElement;

        const skillWrap = createNewElement(
            "div",
            `flex items-center w-full mt-2 overflow-x-scroll scrollbar-hide xl:mt-0 xl:w-auto post-skill-wrap-${recruit.id}`,
            null,
            `post_skill_wrap_${recruit.id}`
        );
        recruit.skills.forEach((skill) => {
            const skillElement = createNewElement(
                "div",
                `whitespace-nowrap p-1 mx-1 text-xs cursor-pointer text-white rounded post-skill-${recruit.id}-${skill.id}`,
                skill.name,
                `post_skill_${recruit.id}_${skill.id}`
            );
            if (queryParameterDict.skill_ids == skill.id) {
                skillElement.classList.add("bg-[#373737]");
            } else {
                skillElement.classList.add("bg-[#d9d9d9]");
                skillElement.classList.add("hover:bg-[#373737]");
            }

            skillElement.addEventListener("click", () => {
                if (queryParameterDict.skill_ids == skill.id) {
                    skillSelect.value = 0;
                    queryParameterDict.skill_ids = 0;
                    skillElement.classList.add("bg-[#d9d9d9]");
                    skillElement.classList.remove("bg-[#373737]");
                    skillElement.classList.add("hover:bg-[#373737]");
                } else {
                    skillSelect.value = skill.id;
                    queryParameterDict.skill_ids = skill.id;
                    // skillElement.style.backgroundColor = "#373737";
                    skillElement.classList.add("bg-[#373737]");
                    skillElement.classList.remove("bg-[#d9d9d9]");
                }
                renderSelectBox(queryParameterDict);
                renderPostList(queryParameterDict);
            });

            skillWrap.appendChild(skillElement);
        });

        regionWrap.appendChild(jobRegion);
        regionWrap.appendChild(likeSvgBtn);
        regionWrap.appendChild(scrapSvgBtn);

        bottomWrap.appendChild(regionWrap);
        bottomWrap.appendChild(skillWrap);
        return bottomWrap;
    };

    const makeJobCard = (recruit) => {
        const jobCardWrap = createNewElement(
            "div",
            `w-full flex justify-center flex-col border p-2 hover:shadow-lg post-job-card-wrap-${recruit.id}`,
            null,
            `post_job_card_wrap_${recruit.id}`
        );
        const jobPosition = createNewElement(
            "div",
            `p-2 h-10 overflow-hidden hover:underline cursor-pointer hover:text-[#66FF99] font-semibold bg-[#373737] text-white post-job-position-${recruit.id}`,
            recruit.position,
            `post_job_position_${recruit.id}`
        );
        jobPosition.style.textOverflow = "ellipsis";
        jobPosition.style.whiteSpace = "nowrap";
        jobPosition.addEventListener("click", () => {
            openModalToPositionEl(recruit);
        });
        jobPosition.setAttribute("title", "Open Modal for Detail Information");

        const jobCompany = makeJobCompany(recruit);
        const jobBodyWrap = makeRowBody(recruit);

        const jobBottomWrap = makeRowBottom(recruit);

        jobCardWrap.appendChild(jobPosition);
        jobCardWrap.appendChild(jobCompany);
        jobCardWrap.appendChild(jobBodyWrap);
        jobCardWrap.appendChild(jobBottomWrap);

        jobCardWrap.style.border = "1px solid #373737";

        return jobCardWrap;
    };

    const openModalToPositionEl = (recruit) => {
        // 모달 요소에서 display: none 제거
        const postModal = getElFromId("post_modal");
        postModal.classList.remove("hidden");

        // body의 스크롤 방지
        const body = getElFromSel("body");
        body.style.overflow = "hidden";

        // 모달 각 요소에 내용 채워넣기
        const positionDataEl = getElFromId("post_modal_position_a");
        const companyDataEl = getElFromId("post_modal_company_data");
        const regionDataEl = getElFromId("post_modal_region_data");
        const categoryDataEl = getElFromId("post_modal_category_data");
        const taskDataEl = getElFromId("post_modal_task_data");
        const requirementDataEl = getElFromId("post_modal_requirement_data");
        const preferenceDataEl = getElFromId("post_modal_preference_data");
        const descriptionDataEl = getElFromId("post_modal_description_data");
        const benefitDataEl = getElFromId("post_modal_benefit_data");
        const workplaceDataEl = getElFromId("post_modal_workplace_a");
        const skillDataEl = getElFromId("post_modal_skill_data");
        const companyTagDataEl = getElFromId("post_modal_company_tag_data");

        positionDataEl.setAttribute("href", `https://www.wanted.co.kr/wd/${recruit.url_id}`);
        workplaceDataEl.setAttribute(
            "href",
            `https://map.naver.com/p/search/${encodeURIComponent(recruit.workplace)}`
        );

        positionDataEl.textContent = recruit.position;
        companyDataEl.textContent = recruit.company.name;
        regionDataEl.textContent = `${recruit.detail_region.region.country.name} - ${recruit.detail_region.region.name}`;
        taskDataEl.textContent = recruit.task;
        requirementDataEl.textContent = recruit.requirement;
        preferenceDataEl.textContent = recruit.preference;
        descriptionDataEl.textContent = recruit.description;
        benefitDataEl.textContent = recruit.benefit;
        workplaceDataEl.textContent = recruit.workplace;

        const categoryDivWrap = createNewElement(
            "div",
            "flex items-start w-full post-category-wrap"
        );
        let categoryData = recruit.categories;
        categoryData.forEach((category) => {
            const categoryDiv = createNewElement(
                "div",
                `rounded mr-2 post-modal-category-${recruit.id}-${category.id}`,
                `${category.group.name} - ${category.name}`,
                `post_modal_skill_${recruit.id}_${category.id}`
            );
            categoryDiv.style.color = "#373737";
            categoryDiv.style.backgroundColor = "white";
            categoryDiv.style.padding = "0 4px 4px";
            categoryDivWrap.appendChild(categoryDiv);
        });
        removeAllNode(categoryDataEl);
        categoryDataEl.appendChild(categoryDivWrap);

        const skillDivWrap = createNewElement("div", "flex items-start w-full post-skill-wrap");
        let skillData = recruit.skills;
        skillData.forEach((skill) => {
            const skillDiv = createNewElement(
                "div",
                `rounded mr-2 post-modal-skill-${recruit.id}-${skill.id}`,
                `${skill.name}`,
                `post_modal_skill_${recruit.id}_${skill.id}`
            );
            skillDiv.style.color = "#373737";
            skillDiv.style.backgroundColor = "white";
            skillDiv.style.padding = "0 4px 4px";
            skillDivWrap.appendChild(skillDiv);
        });
        removeAllNode(skillDataEl);
        skillDataEl.appendChild(skillDivWrap);

        const companyTagDivWrap = createNewElement(
            "div",
            "flex items-start w-full post-company-tag-wrap"
        );
        let companyTagData = recruit.company.tags;
        companyTagData.forEach((companyTag) => {
            const companyTagDiv = createNewElement(
                "div",
                `rounded mr-2 post-modal-company-tag-${recruit.id}-${companyTag.id}`,
                `${companyTag.name}`,
                `post_modal_company-tag_${recruit.id}_${companyTag.id}`
            );
            companyTagDiv.style.color = "#373737";
            companyTagDiv.style.backgroundColor = "white";
            companyTagDiv.style.padding = "0 4px 4px";
            companyTagDivWrap.appendChild(companyTagDiv);
        });
        removeAllNode(companyTagDataEl);
        companyTagDataEl.appendChild(companyTagDivWrap);

        // 버튼 생성 및 이미지 추가
        const postModalBtnWrap = getElFromId("post_modal_btn_wrap");
        removeAllNode(postModalBtnWrap);

        const postModalLikeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#FFFFFF"
                class="w-6 h-6 p-1 mr-2 cursor-pointer md:w-8 md:h-8"
                id="post_model_like_btn">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z">
            </path>
        </svg>
        `;
        const postModalLikeParser = new DOMParser();
        const postModalLikeSvgDOM = postModalLikeParser.parseFromString(
            postModalLikeSvg,
            "image/svg+xml"
        );
        const postModalLikeSvgBtn = postModalLikeSvgDOM.documentElement;

        const postModalScrapSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#FFFFFF"
                class="w-6 h-6 p-1 mr-2 cursor-pointer md:w-8 md:h-8"
                id="post_model_scrap_btn">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z">
            </path>
        </svg>
        `;
        const postModalScrapParser = new DOMParser();
        const postModalScrapSvgDOM = postModalScrapParser.parseFromString(
            postModalScrapSvg,
            "image/svg+xml"
        );
        const postModalScrapSvgBtn = postModalScrapSvgDOM.documentElement;

        const postModalCloseSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#FFFFFF"
                class="w-6 h-6 p-1 cursor-pointer md:w-8 md:h-8"
                id="post_model_close_btn">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        `;
        const postModalCloseParser = new DOMParser();
        const postModalCloseSvgDOM = postModalCloseParser.parseFromString(
            postModalCloseSvg,
            "image/svg+xml"
        );
        const postModalCloseSvgBtn = postModalCloseSvgDOM.documentElement;

        // close 버튼 클릭 시 모달창 닫기
        postModalCloseSvgBtn.addEventListener("click", () => {
            // 모달 숨기기
            postModal.classList.add("hidden");

            // 모달 내부 데이터 비우기
            positionDataEl.textContent = "";
            companyDataEl.textContent = "";
            regionDataEl.textContent = "";
            taskDataEl.textContent = "";
            requirementDataEl.textContent = "";
            preferenceDataEl.textContent = "";
            descriptionDataEl.textContent = "";
            benefitDataEl.textContent = "";
            workplaceDataEl.textContent = "";
            removeAllNode(categoryDataEl);
            removeAllNode(skillDataEl);
            removeAllNode(companyTagDataEl);
            removeAllNode(postModalBtnWrap);

            // body의 스크롤 원상복구
            const body = getElFromSel("body");
            body.style.overflow = "";
        });

        postModalBtnWrap.appendChild(postModalLikeSvgBtn);
        postModalBtnWrap.appendChild(postModalScrapSvgBtn);
        postModalBtnWrap.appendChild(postModalCloseSvgBtn);

        // esc 버튼 클릭 시 모달창 닫기
        setKeyForFunction(document, "Escape", () => {
            // 모달 숨기기
            postModal.classList.add("hidden");

            // 모달 내부 데이터 비우기
            positionDataEl.textContent = "";
            companyDataEl.textContent = "";
            regionDataEl.textContent = "";
            taskDataEl.textContent = "";
            requirementDataEl.textContent = "";
            preferenceDataEl.textContent = "";
            descriptionDataEl.textContent = "";
            benefitDataEl.textContent = "";
            workplaceDataEl.textContent = "";
            removeAllNode(categoryDataEl);
            removeAllNode(skillDataEl);
            removeAllNode(companyTagDataEl);
            removeAllNode(postModalBtnWrap);

            // body의 스크롤 원상복구
            const body = getElFromSel("body");
            body.style.overflow = "";
        });
    };

    const renderSelectBox = (queryParameterDict, filterElementIdDict) => {
        // Select box 만들기

        console.log("renderPostList - queryParameterDict", queryParameterDict);
        let groupURL;
        let categoryUrl = "categories";
        let countryUrl;
        let regionURL = "regions";
        let detailRegionURL = "detail_regions";

        if (queryParameterDict.group_id > 0) {
            categoryUrl += `?group_id=${queryParameterDict.group_id}`;
        }

        if (queryParameterDict.country_id > 0) {
            regionURL += `?country_id=${queryParameterDict.country_id}`;
            detailRegionURL += `?country_id=${queryParameterDict.country_id}`;
        }

        if (queryParameterDict.region_id > 0) {
            if (queryParameterDict.country_id > 0) {
                detailRegionURL += `&region_id=${queryParameterDict.region_id}`;
            } else {
                detailRegionURL += `?region_id=${queryParameterDict.region_id}`;
            }
        }

        makeSelectOptions(
            JobURL,
            "sites",
            filterElementIdDict.site,
            true,
            queryParameterDict.site_id
        );
        makeSelectOptions(
            JobURL,
            "groups",
            filterElementIdDict.group,
            true,
            queryParameterDict.group_id
        );
        makeSelectOptions(
            JobURL,
            categoryUrl,
            filterElementIdDict.category,
            true,
            queryParameterDict.category_ids,
            queryParameterDict.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            filterElementIdDict.country,
            true,
            queryParameterDict.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURL,
            filterElementIdDict.region,
            true,
            queryParameterDict.region_id,
            queryParameterDict.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            filterElementIdDict.detail_region,
            true,
            queryParameterDict.detail_region_id,
            queryParameterDict.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "skills",
            filterElementIdDict.skill,
            true,
            queryParameterDict.skill_ids
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            filterElementIdDict.company_tag,
            true,
            queryParameterDict.company_tag_ids
        );
    };

    // 채용공고 리스트 렌더링
    const renderPostList = async (queryParameterDict) => {
        let initJobListURL = `${JobURL}/recruits?${makeQueryParameter(queryParameterDict)}`;
        console.log("initJobListURL", initJobListURL);

        // Job Card List 렌더링
        const data = setFetchData("get", {});

        const jobCardList = getElFromId("post_job_card_list");
        removeAllNode(jobCardList);

        const get_recruits_response = await fetch(initJobListURL, data);

        if (get_recruits_response.status === 200) {
            let recruits = await get_recruits_response.json();
            console.log(recruits);
            recruits.forEach((recruit) => {
                jobCardList.appendChild(makeJobCard(recruit));
            });
        }

        // Select Box 렌터링
        const postFilterElementIdDict = {
            site: "post_filter_site",
            group: "post_filter_group",
            category: "post_filter_category",
            country: "post_filter_country",
            region: "post_filter_region",
            detail_region: "post_filter_detail_region",
            skill: "post_filter_skill",
            company_tag: "post_filter_company_tag",
        };
        renderSelectBox(queryParameterDict, postFilterElementIdDict);
    };

    const fromChangedSelectElementRenderPostList = (SelectElement, queryParameterDict) => {
        SelectElement.addEventListener("change", () => {
            renderSelectBox(queryParameterDict);
            renderPostList(queryParameterDict);
        });
    };

    const fromSearchBtnRenderPostList = (searchBtn, queryParameterDict) => {
        searchBtn.addEventListener("click", () => {
            renderSelectBox(queryParameterDict);
            renderPostList(queryParameterDict);
        });
    };

    /////////////////////////////////////////////////////// Crawling page

    /////////////////////////////////////////////////////// Manage page

    /////////////////////////////////////////////////////// POST page Initialization
    settingBtn.addEventListener("click", () => {
        openModalToSetting();
    });

    changeJobListURL(siteSelect, queryParameterDict, "site_id", [
        "group_id",
        "category_ids",
        "country_id",
        "region_id",
        "detail_region_id",
    ]);
    changeJobListURL(groupSelect, queryParameterDict, "group_id", ["category_ids"]);
    changeJobListURL(categorySelect, queryParameterDict, "category_ids");
    changeJobListURL(countrySelect, queryParameterDict, "country_id", [
        "region_id",
        "detail_region_id",
    ]);
    changeJobListURL(regionSelect, queryParameterDict, "region_id", ["detail_region_id"]);
    changeJobListURL(detailRegionSelect, queryParameterDict, "detail_region_id");
    changeJobListURL(skillSelect, queryParameterDict, "skill_ids");
    changeJobListURL(companyTagSelect, queryParameterDict, "company_tag_ids");
    changeJobListURL(minCareerSelect, queryParameterDict, "min_career");

    renderPostList(queryParameterDict);

    fromChangedSelectElementRenderPostList(siteSelect, queryParameterDict);
    fromChangedSelectElementRenderPostList(categorySelect, queryParameterDict);
    fromChangedSelectElementRenderPostList(groupSelect, queryParameterDict);
    fromChangedSelectElementRenderPostList(skillSelect, queryParameterDict);
    fromChangedSelectElementRenderPostList(companyTagSelect, queryParameterDict);
    fromChangedSelectElementRenderPostList(minCareerSelect, queryParameterDict);

    fromSearchBtnRenderPostList(searchBtn, queryParameterDict);

    countrySelect.addEventListener("change", () => {
        renderSelectBox(queryParameterDict);
    });

    regionSelect.addEventListener("change", () => {
        renderSelectBox(queryParameterDict);
    });
});
