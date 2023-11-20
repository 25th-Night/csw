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

    // Job Service URL
    const JobURL = getJobURL();
    let getJobListURL = `${JobURL}/recruits`;

    // Post Select Box 렌터링
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

    // CrawlingSelect Box 렌터링
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

    const requestSetting = async (type) => {
        const data = setFetchData("get", {});
        const requestURL = `${JobURL}/settings/${type}`;
        const get_response = await fetch(requestURL, data);

        return get_response;
    };

    // 초기 Parameter dict 설정
    let queryParameterDict;
    const postSettingResponse = await requestSetting(1);
    const getPostSettingStatus = postSettingResponse.status;
    const postSettingData = await postSettingResponse.json();
    if (getPostSettingStatus == 200) {
        queryParameterDict = postSettingData;
    } else {
        alert("Cannot access Post Setting");
    }

    // 초기 Parameter dict 설정
    let crawlingQueryParameterDict;
    const crawlingSettingResponse = await requestSetting(2);
    const getCrawlingSettingStatus = crawlingSettingResponse.status;
    const crawlingSettingData = await crawlingSettingResponse.json();
    if (getCrawlingSettingStatus == 200) {
        crawlingQueryParameterDict = crawlingSettingData;
    } else {
        alert("Cannot access Crawling Setting");
    }

    const saveSetting = async (queryParameterDict, type) => {
        const data = setFetchData("put", queryParameterDict);
        console.log(`saveSetting - queryParameterDict : type - ${type}`, queryParameterDict);
        const requestURL = `${JobURL}/settings/${type}`;
        const get_response = await fetch(requestURL, data);
        if (get_response.status == 200) {
            alert("Saved successfully");
            console.log("Saved Post Setting - queryParameterDict", queryParameterDict);
            return get_response;
        } else {
            alert(await get_response.json());
        }
    };

    const saveSettingInCrawling = async (queryParameterDict, type) => {
        console.log("saveSetting - queryParameterDict", queryParameterDict);
        if (queryParameterDict.category_ids == "0") {
            alert("Please search Category and select one");
        } else if (
            queryParameterDict.group_id == "1" &&
            queryParameterDict.category_ids != "0" &&
            queryParameterDict.skill_ids == "0"
        ) {
            alert("Please search Skill and select one");
        } else if (queryParameterDict.min_career == "0") {
            alert("Please select Minimum Career Year");
        } else {
            const data = setFetchData("put", queryParameterDict);
            const requestURL = `${JobURL}/settings/${type}`;
            const get_response = await fetch(requestURL, data);
            if (get_response.status == 200) {
                alert("Saved successfully");
                console.log("Saved Crawling Setting - queryParameterDict", queryParameterDict);
                return get_response;
            } else {
                alert(await get_response.json());
            }
        }
    };

    // Wanted API를 통해 skill 존재 여부 확인
    async function skillSearch(skillName, type, queryParameterDict) {
        const crawlingSearchSkillList = getElFromId(`${type}_search_skill_list`);
        const crawlingSkillInput = getElFromId(`${type}_search_skill`);
        removeAllNode(crawlingSearchSkillList);
        if (skillName) {
            const requestURL = `${JobURL}/crawling/skill/search?keyword=${skillName}`;
            const data = setFetchData("get", {});
            const response = await fetch(requestURL, data);

            if (response.status === 200) {
                queryParameterDict.skill_ids = 0;
                const searchedSkillList = await response.json();
                console.log("searchedSkillList", searchedSkillList);
                if (searchedSkillList) {
                    crawlingSearchSkillList.classList.remove("hidden");
                    const searchedSKillCloseBtnWrap = createNewElement(
                        "div",
                        "flex justify-end items-center",
                        null,
                        "searched_skill_close_btn_wrap"
                    );
                    const searchedSKillCloseSvg = `
                    <svg xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-7 h-7 p-1 cursor-pointer"
                            id="searched_skill_close_btn">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    `;
                    const searchedSKillCloseParser = new DOMParser();
                    const searchedSKillCloseSvgDOM = searchedSKillCloseParser.parseFromString(
                        searchedSKillCloseSvg,
                        "image/svg+xml"
                    );
                    const searchedSKillCloseSvgBtn = searchedSKillCloseSvgDOM.documentElement;

                    searchedSKillCloseSvgBtn.addEventListener("click", () => {
                        removeAllNode(crawlingSearchSkillList);
                        crawlingSearchSkillList.classList.add("hidden");
                    });

                    searchedSKillCloseBtnWrap.appendChild(searchedSKillCloseSvgBtn);
                    crawlingSearchSkillList.append(searchedSKillCloseBtnWrap);

                    searchedSkillList.forEach((skill) => {
                        const skillDiv = createNewElement(
                            "div",
                            `m-1 p-1 hover:bg-[#373737] hover:text-white cursor-pointer skill-${skill.title}`,
                            skill.name
                        );
                        crawlingSearchSkillList.appendChild(skillDiv);
                        skillDiv.addEventListener("click", () => {
                            queryParameterDict.skill_ids = skill.id;
                            crawlingSkillInput.value = skill.name;
                            crawlingSearchSkillList.classList.add("hidden");
                        });
                    });
                }
            } else {
                console.log("API request failed");
            }
        } else {
            crawlingSearchSkillList.classList.add("hidden");
        }

        const searchSKillInputRemoveSvgBtn = getElFromId("search_skill_remove_btn");

        searchSKillInputRemoveSvgBtn.addEventListener("click", () => {
            crawlingSkillInput.value = "";
            removeAllNode(crawlingSearchSkillList);
            crawlingSearchSkillList.classList.add("hidden");
            searchSKillInputRemoveSvgBtn.classList.add("hidden");
        });

        // setKeyForFunction(document, "Escape", () => {
        //     removeAllNode(crawlingSearchSkillList);
        //     crawlingSearchSkillList.classList.add("hidden");
        // });
    }

    // 상단 3버튼 - 버튼별 클릭 이벤트 추가
    const addClickEventToPostBtn = async () => {
        console.log("queryParameterDict", queryParameterDict);
        console.log("crawlingQueryParameterDict", crawlingQueryParameterDict);
        createJobBtn(jobPostBtnImgDict);
        getElFromId("job_crawling_btn").addEventListener("click", () => {
            addClickEventToCrawlingBtn();
        });
        getElFromId("job_manage_btn").addEventListener("click", () => {
            addClickEventToManageBtn();
        });
        renderPostList(queryParameterDict);

        const crawlingSubmitBtn = getElFromId("crawling_submit_btn");
        const crawlingSearchSKill = getElFromId("crawling_search_skill");
        if (crawlingSubmitBtn) {
            crawlingSubmitBtn.remove();
        }
        if (crawlingSearchSKill) {
            crawlingSearchSKill.remove();
        }
        removeAllNode(getElFromId("crawling_job_card_list"));

        // 3개 영역 중 클릭한 버튼의 영역만 보이게 하기
        getElFromId("post_wrap").classList.remove("hidden");
        getElFromId("crawling_wrap").classList.add("hidden");
        // getElFromId("manage_wrap").classList.add("hidden");
    };

    const addClickEventToCrawlingBtn = async () => {
        console.log("queryParameterDict", queryParameterDict);
        console.log("crawlingQueryParameterDict", crawlingQueryParameterDict);
        createJobBtn(jobCrawlingBtnImgDict);
        getElFromId("job_post_btn").addEventListener("click", () => {
            addClickEventToPostBtn();
        });
        getElFromId("job_manage_btn").addEventListener("click", () => {
            addClickEventToManageBtn();
        });

        const crawlingBtn = createNewElement(
            "div",
            "flex items-center font-semibold cursor-pointer hover:text-white hover:border-none hover:bg-[#373737] justify-center border border-[#d9d9d9] w-10 p-2 my-1 text-xs crawling-submit-btn",
            "START",
            "crawling_submit_btn"
        );
        crawlingBtn.style.writingMode = "vertical-rl";
        crawlingBtn.style.textOrientation = "upright";
        crawlingBtn.addEventListener("click", async () => {
            if (crawlingQueryParameterDict.category_ids == "0") {
                alert("Please search Category and select one");
            } else if (
                crawlingQueryParameterDict.group_id == "1" &&
                crawlingQueryParameterDict.category_ids != "0" &&
                crawlingQueryParameterDict.skill_ids == "0"
            ) {
                alert("Please search Skill and select one");
            } else if (crawlingQueryParameterDict.min_career == "0") {
                alert("Please select Minimum Career Year");
            } else {
                // let initJobCrawlingURL = `${JobURL}/crawling/recruits`;
                // console.log("initJobCrawlingURL", initJobCrawlingURL);

                // const data = setFetchData("post", crawlingQueryParameterDict);

                // const post_response = await fetch(initJobCrawlingURL, data);
                // console.log(post_response.status);

                // if (post_response.status === 200) {
                //     let crawling_recruits = await post_response.json();
                //     console.log(crawling_recruits);
                // } else {
                //     const errorData = await post_response.json();
                //     console.log("errorData", errorData);
                // }
                renderCrawlingList(crawlingQueryParameterDict);
            }
        });

        getElFromId("crawling_form").appendChild(crawlingBtn);
        removeAllNode(getElFromId("post_job_card_list"));

        // Skill Input 버튼
        const crawlingSkillInput = createNewElement(
            "input",
            "w-[calc(100%-24px)] outline-none crawling-search-skill",
            null,
            "crawling_search_skill"
        );
        const crawlingSkillInputWrap = getElFromId("crawling_search_skill_wrap");
        crawlingSkillInputWrap.insertBefore(crawlingSkillInput, crawlingSkillInputWrap.firstChild);

        // Skill Input에 초기 데이터 설정
        const getSkillResponse = await fetch(
            `${JobURL}/skills?skill_ids=${crawlingQueryParameterDict.skill_ids}`
        );
        const getSkillData = await getSkillResponse.json();
        console.log("getSkillData", getSkillData);

        if (getSkillResponse.status === 200) {
            if (getSkillData.length) {
                const skillInitName = getSkillData[0].name;
                crawlingSkillInput.value = skillInitName;
            } else {
                crawlingSkillInput.value = "All";
                crawlingQueryParameterDict.skill_ids = "0";
            }
            const searchSKillInputRemoveSvgBtn = getElFromId("search_skill_remove_btn");
            searchSKillInputRemoveSvgBtn.classList.remove("hidden");

            searchSKillInputRemoveSvgBtn.addEventListener("click", () => {
                crawlingSkillInput.value = "";
                crawlingQueryParameterDict.skill_ids = 0;
                removeAllNode(crawlingSearchSkillList);
                crawlingSearchSkillList.classList.add("hidden");
                searchSKillInputRemoveSvgBtn.classList.add("hidden");
            });
        } else {
            console.log(getSkillData);
            // displayErrorMessage("make-url", errorData);
        }
        crawlingSkillInput.setAttribute("placeholder", "search Skill");

        crawlingSkillInput.addEventListener(
            "input",
            debounce(() => {
                skillSearch(crawlingSkillInput.value, "crawling", crawlingQueryParameterDict);
                getElFromId("search_skill_remove_btn").classList.remove("hidden");
            }, 500)
        );

        // Skill Search
        const crawlingSearchSkillList = createNewElement(
            "div",
            "absolute left-1 z-10 items-center hidden origin-top-left bg-white rounded-md shadow-lg w-44 justify-evenly top-10 ring-1 ring-black ring-opacity-5 focus:outline-none crawling-search-skill-list",
            null,
            "crawling_search_skill_list"
        );

        const skillBtnWrap = getElFromId("crawling_filter_skill");
        skillBtnWrap.appendChild(crawlingSearchSkillList);

        // 3개 영역 중 클릭한 버튼의 영역만 보이게 하기
        getElFromId("crawling_wrap").classList.remove("hidden");
        getElFromId("post_wrap").classList.add("hidden");
        // getElFromId("manage_wrap").classList.add("hidden");
    };

    const addClickEventToManageBtn = () => {
        console.log("queryParameterDict", queryParameterDict);
        console.log("crawlingQueryParameterDict", crawlingQueryParameterDict);
        createJobBtn(jobManageBtnImgDict);

        const crawlingSubmitBtn = getElFromId("crawling_submit_btn");
        const crawlingSearchSKill = getElFromId("crawling_search_skill");
        if (crawlingSubmitBtn) {
            crawlingSubmitBtn.remove();
        }
        if (crawlingSearchSKill) {
            crawlingSearchSKill.remove();
        }
        getElFromId("job_crawling_btn").addEventListener("click", () => {
            addClickEventToCrawlingBtn();
        });
        getElFromId("job_post_btn").addEventListener("click", () => {
            addClickEventToPostBtn();
        });

        // 3개 영역 중 클릭한 버튼의 영역만 보이게 하기
        // getElFromId("manage_wrap").classList.remove("hidden");
        getElFromId("post_wrap").classList.add("hidden");
        getElFromId("crawling_wrap").classList.add("hidden");
    };

    /////////////////////////////////////////////////////// Page Header

    //////////////////////////////// Job 관련 3개 버튼 이벤트 추가

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

        // Post, Crawling 탭의 Select Box 변경
        if (getElFromId("job_post_btn").getAttribute("src") == "/static/img/icon/job-post04.png") {
            //
        }
        if (
            getElFromId("job_crawling_btn").getAttribute("src") ==
            "/static/img/icon/gathering07.png"
        ) {
            const crawlingSearchSkillList = getElFromId("crawling_search_skill_list");
            removeAllNode(crawlingSearchSkillList);
            crawlingSearchSkillList.classList.add("hidden");
        }

        //

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
            getElFromId();
            saveSetting(queryParameterDict, 1);
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
            saveSettingInCrawling(crawlingQueryParameterDict, 2);
        });

        ////////////////////////////////// Post Setting
        const postSettingResponse = await requestSetting(1);
        const getPostSettingStatus = postSettingResponse.status;
        const postSettingData = await postSettingResponse.json();

        console.log(getPostSettingStatus, postSettingData);

        let queryParameterDict = postSettingData;

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

        renderSelectBox(queryParameterDict, "setting_modal_post");

        changeJobListURL(siteSelectForPostSetting, queryParameterDict, "site_id", [
            "group_id",
            "category_ids",
            "country_id",
            "region_id",
            "detail_region_id",
        ]);
        changeJobListURL(groupSelectForPostSetting, queryParameterDict, "group_id", [
            "category_ids",
        ]);
        changeJobListURL(categorySelectForPostSetting, queryParameterDict, "category_ids");
        changeJobListURL(countrySelectForPostSetting, queryParameterDict, "country_id", [
            "region_id",
            "detail_region_id",
        ]);
        changeJobListURL(regionSelectForPostSetting, queryParameterDict, "region_id", [
            "detail_region_id",
        ]);
        changeJobListURL(detailRegionSelectForPostSetting, queryParameterDict, "detail_region_id");
        changeJobListURL(skillSelectForPostSetting, queryParameterDict, "skill_ids");
        changeJobListURL(companyTagSelectForPostSetting, queryParameterDict, "company_tag_ids");
        changeJobListURL(minCareerSelectForPostSetting, queryParameterDict, "min_career");

        siteSelectForPostSetting.addEventListener("change", () => {
            renderSelectBox(queryParameterDict, "setting_modal_post");
        });
        groupSelectForPostSetting.addEventListener("change", () => {
            renderSelectBox(queryParameterDict, "setting_modal_post");
        });
        categorySelectForPostSetting.addEventListener("change", () => {
            renderSelectBox(queryParameterDict, "setting_modal_post");
        });
        countrySelectForPostSetting.addEventListener("change", () => {
            renderSelectBox(queryParameterDict, "setting_modal_post");
        });
        regionSelectForPostSetting.addEventListener("change", () => {
            renderSelectBox(queryParameterDict, "setting_modal_post");
        });

        ////////////////////////////////// Crawling Setting
        const crawlingSettingResponse = await requestSetting(2);
        const getCrawlingSettingStatus = crawlingSettingResponse.status;
        const crawlingSettingData = await crawlingSettingResponse.json();

        let crawlingQueryParameterDict = crawlingSettingData;

        // Skill Input 버튼
        const crawlingSkillInputInSetting = createNewElement(
            "input",
            "w-[calc(100%-24px)] outline-none setting-modal-crawling-search-skill",
            null,
            "setting_modal_crawling_search_skill"
        );
        crawlingSkillInputInSetting.setAttribute("type", "text");
        const crawlingSkillInputWrapInSetting = getElFromId(
            "setting_modal_crawling_search_skill_wrap"
        );
        crawlingSkillInputWrapInSetting.insertBefore(
            crawlingSkillInputInSetting,
            crawlingSkillInputWrapInSetting.firstChild
        );

        // Skill Input에 초기 데이터 설정
        const getSkillResponse = await fetch(
            `${JobURL}/skills?skill_ids=${crawlingQueryParameterDict.skill_ids}`
        );
        const getSkillData = await getSkillResponse.json();
        console.log("getSkillData", getSkillData);

        if (getSkillResponse.status === 200) {
            if (getSkillData.length) {
                const skillInitName = getSkillData[0].name;
                crawlingSkillInputInSetting.value = skillInitName;
            } else {
                crawlingSkillInputInSetting.value = "All";
                crawlingQueryParameterDict.skill_ids = "0";
            }
            const searchSKillInputRemoveSvgBtn = getElFromId(
                "setting_modal_crawling_search_skill_remove_btn"
            );
            searchSKillInputRemoveSvgBtn.classList.remove("hidden");

            searchSKillInputRemoveSvgBtn.addEventListener("click", () => {
                crawlingSkillInputInSetting.value = "";
                crawlingQueryParameterDict.skill_ids = 0;
                searchSKillInputRemoveSvgBtn.classList.add("hidden");
            });
        } else {
            console.log(getSkillData);
            // displayErrorMessage("make-url", errorData);
        }
        crawlingSkillInputInSetting.setAttribute("placeholder", "search Skill");

        crawlingSkillInputInSetting.addEventListener(
            "input",
            debounce(() => {
                skillSearch(
                    crawlingSkillInputInSetting.value,
                    "setting_modal_crawling",
                    crawlingQueryParameterDict
                );
                getElFromId("setting_modal_crawling_search_skill_remove_btn").classList.remove(
                    "hidden"
                );
            }, 500)
        );

        // Crawling Settings SelectBox 만들기
        renderSelectBoxInCrawling(crawlingQueryParameterDict, "setting_modal_crawling");

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
        const skillSearchForCrawlingSetting = getElFromId("setting_modal_crawling_search_skill");
        const companyTagSelectForCrawlingSetting = getElFromId(
            "setting_modal_crawling_filter_company_tag"
        );
        const minCareerSelectForCrawlingSetting = getElFromId(
            "setting_modal_crawling_filter_min_career"
        );

        changeJobListURL(siteSelectForCrawlingSetting, crawlingQueryParameterDict, "site_id", [
            "group_id",
            "category_ids",
            "country_id",
            "region_id",
            "detail_region_id",
        ]);
        changeJobListURL(groupSelectForCrawlingSetting, crawlingQueryParameterDict, "group_id", [
            "category_ids",
        ]);
        changeJobListURL(
            categorySelectForCrawlingSetting,
            crawlingQueryParameterDict,
            "category_ids"
        );
        changeJobListURL(
            countrySelectForCrawlingSetting,
            crawlingQueryParameterDict,
            "country_id",
            ["region_id", "detail_region_id"]
        );
        changeJobListURL(regionSelectForCrawlingSetting, crawlingQueryParameterDict, "region_id", [
            "detail_region_id",
        ]);
        changeJobListURL(
            detailRegionSelectForCrawlingSetting,
            crawlingQueryParameterDict,
            "detail_region_id"
        );
        changeJobListURL(
            companyTagSelectForCrawlingSetting,
            crawlingQueryParameterDict,
            "company_tag_ids"
        );
        changeJobListURL(
            minCareerSelectForCrawlingSetting,
            crawlingQueryParameterDict,
            "min_career"
        );

        siteSelectForCrawlingSetting.addEventListener("change", () => {
            renderSelectBoxInCrawling(crawlingQueryParameterDict, "setting_modal_crawling");
        });
        groupSelectForCrawlingSetting.addEventListener("change", () => {
            renderSelectBoxInCrawling(crawlingQueryParameterDict, "setting_modal_crawling");
        });
        categorySelectForCrawlingSetting.addEventListener("change", () => {
            const crawlingSkillInputInSetting = getElFromId("setting_modal_crawling_search_skill");
            if (
                crawlingQueryParameterDict.group_id == 1 &&
                crawlingQueryParameterDict.category_ids != 0
            ) {
                if (crawlingSkillInputInSetting) {
                    crawlingSkillInputInSetting.disabled = false;
                }
            } else {
                crawlingSkillInputInSetting.value = "";
                crawlingQueryParameterDict.skill_ids = 0;
                crawlingSkillInputInSetting.disabled = true;
            }
        });
        countrySelectForCrawlingSetting.addEventListener("change", () => {
            renderSelectBoxInCrawling(crawlingQueryParameterDict, "setting_modal_crawling");
        });
        regionSelectForCrawlingSetting.addEventListener("change", () => {
            renderSelectBoxInCrawling(crawlingQueryParameterDict, "setting_modal_crawling");
        });

        // Skill Search
        const crawlingSearchSkillListInSetting = createNewElement(
            "div",
            "absolute left-1 z-20 items-center hidden origin-top-left bg-white rounded-md shadow-lg w-44 justify-evenly top-10 ring-1 ring-black ring-opacity-5 focus:outline-none setting-modal-crawling-search-skill-list",
            null,
            "setting_modal_crawling_search_skill_list"
        );

        const skillBtnWrapInSetting = getElFromId("setting_modal_crawling_filter_skill");
        skillBtnWrapInSetting.appendChild(crawlingSearchSkillListInSetting);

        // 3개 영역 중 클릭한 버튼의 영역만 보이게 하기
        getElFromId("crawling_wrap").classList.remove("hidden");
        getElFromId("post_wrap").classList.add("hidden");
        // getElFromId("manage_wrap").classList.add("hidden");

        ////////////////////////////////// Manage Setting

        ////////////////////////////////// Close Setting
        // 모달 close 버튼
        const settingModalCloseSvg = `
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
        const settingModalCloseParser = new DOMParser();
        const settingModalCloseSvgDOM = settingModalCloseParser.parseFromString(
            settingModalCloseSvg,
            "image/svg+xml"
        );
        const settingModalCloseSvgBtn = settingModalCloseSvgDOM.documentElement;

        // close 버튼 클릭 시 모달창 닫기
        settingModalCloseSvgBtn.addEventListener("click", async () => {
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
            removeAllNode(siteSelectForCrawlingSetting);
            removeAllNode(groupSelectForCrawlingSetting);
            removeAllNode(categorySelectForCrawlingSetting);
            removeAllNode(countrySelectForCrawlingSetting);
            removeAllNode(regionSelectForCrawlingSetting);
            removeAllNode(detailRegionSelectForCrawlingSetting);
            removeAllNode(companyTagSelectForCrawlingSetting);
            minCareerSelectForCrawlingSetting.value = 0;
            saveBtnForCrawlingSetting.remove();
            if (skillSearchForCrawlingSetting) {
                skillSearchForCrawlingSetting.remove();
            }

            // body의 스크롤 원상복구
            const body = getElFromSel("body");
            body.style.overflow = "";

            // Post, Crawling 탭의 Select Box 변경
            if (
                getElFromId("job_post_btn").getAttribute("src") == "/static/img/icon/job-post04.png"
            ) {
                // renderSelectBox(queryParameterDict, "post");
                console.log('renderSelectBox(queryParameterDict, "post");');
                this.location.reload();
            } else if (
                getElFromId("job_crawling_btn").getAttribute("src") ==
                "/static/img/icon/gathering07.png"
            ) {
                renderSelectBoxInCrawling(crawlingQueryParameterDict, "crawling");

                // Skill Input에 초기 데이터 설정
                const crawlingSkillInput = getElFromId("crawling_search_skill");
                const getSkillResponse = await fetch(
                    `${JobURL}/skills?skill_ids=${crawlingQueryParameterDict.skill_ids}`
                );
                const getSkillData = await getSkillResponse.json();

                if (getSkillResponse.status === 200) {
                    if (getSkillData.length) {
                        const skillInitName = getSkillData[0].name;
                        crawlingSkillInput.value = skillInitName;
                        crawlingQueryParameterDict.skill_ids = getSkillData[0].id;
                        console.log(
                            "close setting modal - crawlingQueryParameterDict",
                            crawlingQueryParameterDict
                        );
                    } else {
                        crawlingSkillInput.value = "All";
                        crawlingQueryParameterDict.skill_ids = "0";
                    }

                    const crawlingSearchSkillList = getElFromId("crawling_search_skill_list");
                    const searchSKillInputRemoveSvgBtn = getElFromId("search_skill_remove_btn");
                    searchSKillInputRemoveSvgBtn.classList.remove("hidden");

                    searchSKillInputRemoveSvgBtn.addEventListener("click", () => {
                        crawlingSkillInput.value = "";
                        removeAllNode(crawlingSearchSkillList);
                        crawlingSearchSkillList.classList.add("hidden");
                        searchSKillInputRemoveSvgBtn.classList.add("hidden");
                    });
                } else {
                    console.log(getSkillData);
                    // displayErrorMessage("make-url", errorData);
                }
            }
        });

        getElFromId("setting_modal_btn_wrap").appendChild(settingModalCloseSvgBtn);

        // esc 버튼 클릭 시 모달창 닫기
        // setKeyForFunction(document, "Escape", () => {
        //     // 모달 숨기기
        //     settingModal.classList.add("hidden");

        //     // 모달 내부 데이터 비우기
        //     removeAllNode(getElFromId("setting_modal_btn_wrap"));
        //     removeAllNode(siteSelectForPostSetting);
        //     removeAllNode(groupSelectForPostSetting);
        //     removeAllNode(categorySelectForPostSetting);
        //     removeAllNode(countrySelectForPostSetting);
        //     removeAllNode(regionSelectForPostSetting);
        //     removeAllNode(detailRegionSelectForPostSetting);
        //     removeAllNode(skillSelectForPostSetting);
        //     removeAllNode(companyTagSelectForPostSetting);
        //     if (skillSearchForCrawlingSetting) {
        //         skillSearchForCrawlingSetting.remove();
        //     }
        //     minCareerSelectForPostSetting.value = 0;
        //     saveBtnForPostSetting.remove();
        //     saveBtnForCrawlingSetting.remove();

        //     // body의 스크롤 원상복구
        //     const body = getElFromSel("body");
        //     body.style.overflow = "";

        //     // Post, Crawling 탭의 Select Box 변경
        //     renderSelectBox(queryParameterDict, "post");
        //     if (
        //         getElFromId("job_post_btn").getAttribute("src") == "/static/img/icon/job-post04.png"
        //     ) {
        //         renderPostList(queryParameterDict);
        //     }

        //     renderSelectBoxInCrawling(crawlingQueryParameterDict, "crawling");
        //     getElFromId("crawling_filter_min_career").value = crawlingQueryParameterDict.min_career;
        //     if (
        //         getElFromId("job_crawling_btn").getAttribute("src") ==
        //         "/static/img/icon/gathering07.png"
        //     ) {
        //         // renderCrawlingList(queryParameterDict);
        //     }
        // });
    };

    /////////////////////////////////////////////////////// POST page

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

    const changeJobListURLbyInput = (
        selectEl,
        queryParameterDict,
        queryParameter,
        relatedQueryParameters = null
    ) => {
        selectEl.addEventListener("input", () => {
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

    const makeJobRow = (recruit, type, attribute) => {
        const rowWrap = createNewElement(
            "div",
            `flex my-2 text-sm h-20 ${type}-job-${attribute}-wrap-${recruit.id}`,
            null,
            `${type}_job_${attribute}_wrap_${recruit.id}`
        );
        const rowLabel = createNewElement(
            "div",
            `h-full pr-2 border-r border-[#373737] font-bold ${type}-job-${attribute}-label-${recruit.id}`,
            capitalize(attribute),
            `${type}_job-${attribute}-label-${recruit.id}`
        );
        rowLabel.style.width = "100px";
        const rowData = createNewElement(
            "div",
            `h-full overflow-hidden ${type}-job-${attribute}-${recruit.id}`,
            recruit[attribute],
            `${type}_job_${attribute}_${recruit.id}`
        );
        rowData.style.whiteSpace = "pre";
        rowData.style.textOverflow = "ellipsis";
        rowData.style.flex = "1";
        rowData.style.paddingLeft = "8px";

        rowWrap.appendChild(rowLabel);
        rowWrap.appendChild(rowData);

        return rowWrap;
    };

    const makeJobCompany = (recruit, type) => {
        const jobCompany = createNewElement(
            "div",
            `flex truncate justify-center my-2 w-1/2 cursor-pointer border-b border-[#373737] hover:underline font-semibold ${type}-job-company-${recruit.id}`,
            recruit.company.name,
            `${type}_job_company_${recruit.id}`
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

    const makeRowBody = (recruit, type) => {
        const jobBodyWrap = createNewElement(
            "div",
            `grid grid-cols-1 grid-rows-3 ${type}-job-body-wrap-${recruit.id}`,
            null,
            `${type}_job_body_wrap_${recruit.id}`
        );
        const jobTask = makeJobRow(recruit, "post", "task");
        const jobRequirement = makeJobRow(recruit, "post", "requirement");
        const jobPreference = makeJobRow(recruit, "post", "preference");

        jobBodyWrap.appendChild(jobTask);
        jobBodyWrap.appendChild(jobRequirement);
        jobBodyWrap.appendChild(jobPreference);
        return jobBodyWrap;
    };

    const makeRowBottom = (recruit, type, queryParameterDict) => {
        const bottomWrap = createNewElement(
            "div",
            `flex flex-col my-1 items-center xl:flex-row ${type}-bottom-wrap-${recruit.id}`,
            null,
            `${type}_bottom_wrap_${recruit.id}`
        );
        const regionWrap = createNewElement(
            "div",
            `flex items-center w-full xl:w-auto ${type}-region-wrap-${recruit.id}`,
            null,
            `${type}_region_wrap_${recruit.id}`
        );
        const jobRegion = createNewElement(
            "div",
            `mr-2 w-8 font-semibold ${type}-job-region-${recruit.id}`,
            recruit.detail_region.region.name,
            `${type}_job_region_${recruit.id}`
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
            `flex items-center w-full mt-2 overflow-x-scroll scrollbar-hide xl:mt-0 xl:w-auto ${type}-skill-wrap-${recruit.id}`,
            null,
            `${type}_skill_wrap_${recruit.id}`
        );
        recruit.skills.forEach((skill) => {
            const skillElement = createNewElement(
                "div",
                `whitespace-nowrap p-1 mx-1 text-xs text-white rounded ${type}-skill-${recruit.id}-${skill.id}`,
                skill.name,
                `${type}_skill_${recruit.id}_${skill.id}`
            );
            if (queryParameterDict.skill_ids == skill.id) {
                skillElement.classList.add("bg-[#373737]");
            } else {
                skillElement.classList.add("bg-[#d9d9d9]");
                if (type == "post") {
                    skillElement.classList.add("hover:bg-[#373737]");
                }
            }

            if (type == "post") {
                skillElement.classList.add("cursor-pointer");

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
                    if (type == "post") {
                        renderPostList(queryParameterDict);
                    } else if (type == "crawling") {
                        renderCrawlingList(queryParameterDict);
                    }
                });
            }

            skillWrap.appendChild(skillElement);
        });

        regionWrap.appendChild(jobRegion);
        regionWrap.appendChild(likeSvgBtn);
        regionWrap.appendChild(scrapSvgBtn);

        bottomWrap.appendChild(regionWrap);
        bottomWrap.appendChild(skillWrap);
        return bottomWrap;
    };

    const makeJobCard = (recruit, queryParameterDict) => {
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

        const jobCompany = makeJobCompany(recruit, "post");
        const jobBodyWrap = makeRowBody(recruit, "post");

        const jobBottomWrap = makeRowBottom(recruit, "post", queryParameterDict);

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
                `whitespace-nowrap rounded mr-2 post-modal-skill-${recruit.id}-${skill.id}`,
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
                `whitespace-nowrap rounded mr-2 post-modal-company-tag-${recruit.id}-${companyTag.id}`,
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
        // setKeyForFunction(document, "Escape", () => {
        //     // 모달 숨기기
        //     postModal.classList.add("hidden");

        //     // 모달 내부 데이터 비우기
        //     positionDataEl.textContent = "";
        //     companyDataEl.textContent = "";
        //     regionDataEl.textContent = "";
        //     taskDataEl.textContent = "";
        //     requirementDataEl.textContent = "";
        //     preferenceDataEl.textContent = "";
        //     descriptionDataEl.textContent = "";
        //     benefitDataEl.textContent = "";
        //     workplaceDataEl.textContent = "";
        //     removeAllNode(categoryDataEl);
        //     removeAllNode(skillDataEl);
        //     removeAllNode(companyTagDataEl);
        //     removeAllNode(postModalBtnWrap);

        //     // body의 스크롤 원상복구
        //     const body = getElFromSel("body");
        //     body.style.overflow = "";
        // });
    };

    const renderSelectBox = (queryParameterDict, type) => {
        // Select box 만들기

        console.log("renderSelectBox - queryParameterDict", queryParameterDict);
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

        makeSelectOptions(JobURL, "sites", `${type}_filter_site`, true, queryParameterDict.site_id);
        makeSelectOptions(
            JobURL,
            "groups",
            `${type}_filter_group`,
            true,
            queryParameterDict.group_id
        );
        makeSelectOptions(
            JobURL,
            categoryUrl,
            `${type}_filter_category`,
            true,
            queryParameterDict.category_ids,
            queryParameterDict.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            `${type}_filter_country`,
            true,
            queryParameterDict.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURL,
            `${type}_filter_region`,
            true,
            queryParameterDict.region_id,
            queryParameterDict.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            `${type}_filter_detail_region`,
            true,
            queryParameterDict.detail_region_id,
            queryParameterDict.region_id,
            "Region"
        );
        if (queryParameterDict.group_id == 1 && queryParameterDict.category_ids != 0) {
            getElFromId(`${type}_filter_skill`).disabled = false;
            makeSelectOptions(
                JobURL,
                "skills",
                `${type}_filter_skill`,
                true,
                queryParameterDict.skill_ids
            );
        } else {
            queryParameterDict.skill_ids = 0;
            removeAllNode(getElFromId(`${type}_filter_skill`));
            getElFromId(`${type}_filter_skill`).disabled = true;
        }
        makeSelectOptions(
            JobURL,
            "company_tags",
            `${type}_filter_company_tag`,
            true,
            queryParameterDict.company_tag_ids
        );

        // min career year에 초기 데이터 설정
        getElFromId(`${type}_filter_min_career`).value = queryParameterDict.min_career;
    };

    const renderSelectBoxInCrawling = async (queryParameterDict, type) => {
        // Select box 만들기

        console.log("renderSelectBoxInCrawling - queryParameterDict", queryParameterDict);
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

        makeSelectOptions(JobURL, "sites", `${type}_filter_site`, true, queryParameterDict.site_id);
        makeSelectOptions(
            JobURL,
            "groups",
            `${type}_filter_group`,
            true,
            queryParameterDict.group_id
        );
        makeSelectOptions(
            JobURL,
            categoryUrl,
            `${type}_filter_category`,
            true,
            queryParameterDict.category_ids,
            queryParameterDict.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            `${type}_filter_country`,
            true,
            queryParameterDict.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURL,
            `${type}_filter_region`,
            true,
            queryParameterDict.region_id,
            queryParameterDict.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            `${type}_filter_detail_region`,
            true,
            queryParameterDict.detail_region_id,
            queryParameterDict.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            `${type}_filter_company_tag`,
            true,
            queryParameterDict.company_tag_ids
        );
        getElFromId(`${type}_filter_company_tag`).disabled = true;

        // min career year에 초기 데이터 설정
        getElFromId(`${type}_filter_min_career`).value = queryParameterDict.min_career;

        // Skill Input에 초기 데이터 설정
        if (queryParameterDict.group_id == 1 && queryParameterDict.category_ids != 0) {
            const crawlingSkillInput = getElFromId(`${type}_search_skill`);

            if (crawlingSkillInput) {
                crawlingSkillInput.disabled = false;
                // const getSkillResponse = await fetch(
                //     `${JobURL}/skills?skill_ids=${queryParameterDict.skill_ids}`
                // );
                // const getSkillData = await getSkillResponse.json();
                // console.log("getSkillData", getSkillData);

                // if (getSkillResponse.status === 200) {
                //     if (getSkillData.length) {
                //         const skillInitName = getSkillData[0].name;
                //         crawlingSkillInput.value = skillInitName;
                //     } else {
                //         crawlingSkillInput.value = "All";
                //         queryParameterDict.skill_ids = "0";
                //     }
                // } else {
                //     console.log(getSkillData);
                //     // displayErrorMessage("make-url", errorData);
                // }
                // crawlingSkillInput.setAttribute("placeholder", "search Skill");

                // crawlingSkillInput.addEventListener(
                //     "input",
                //     debounce(() => {
                //         skillSearch(crawlingSkillInput.value, "crawling_search_skill_list");
                //         getElFromId("search_skill_remove_btn").classList.remove("hidden");
                //     }, 500)
                // );
            }
        } else {
            const crawlingSkillInput = getElFromId(`${type}_search_skill`);
            if (crawlingSkillInput) {
                crawlingSkillInput.value = "";
                crawlingSkillInput.disabled = true;
            }
            queryParameterDict.skill_ids = 0;
        }
    };

    // 채용공고 리스트 렌더링
    const renderPostList = async (queryParameterDict) => {
        renderSelectBox(queryParameterDict, "post");
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
                jobCardList.appendChild(makeJobCard(recruit, queryParameterDict));
            });
        }
    };

    const fromChangedSelectElementRenderPostList = (SelectElement, queryParameterDict, type) => {
        SelectElement.addEventListener("change", () => {
            renderPostList(queryParameterDict);
        });
    };

    const fromSearchBtnRenderPostList = (searchBtn, queryParameterDict, type) => {
        searchBtn.addEventListener("click", () => {
            renderPostList(queryParameterDict);
        });
    };

    const fromChangedSelectElementRenderSelectBox = (SelectElement, queryParameterDict, type) => {
        SelectElement.addEventListener("change", () => {
            renderSelectBox(queryParameterDict, type);
        });
    };

    /////////////////////////////////////////////////////// Crawling page
    // 크롤링한 공고 카드 만들기
    const makeCrawlingCard = (recruit, queryParameterDict) => {
        const jobCardWrap = createNewElement(
            "div",
            `w-full flex justify-center flex-col border p-2 hover:shadow-lg crawling-job-card-wrap-${recruit.id}`,
            null,
            `crawling_job_card_wrap_${recruit.id}`
        );
        const jobPosition = createNewElement(
            "div",
            `p-2 h-10 overflow-hidden hover:underline cursor-pointer hover:text-[#66FF99] font-semibold bg-[#373737] text-white crawling-job-position-${recruit.id}`,
            recruit.position,
            `crawling_job_position_${recruit.id}`
        );
        jobPosition.style.textOverflow = "ellipsis";
        jobPosition.style.whiteSpace = "nowrap";
        jobPosition.addEventListener("click", () => {
            openModalToPositionEl(recruit);
        });
        jobPosition.setAttribute("title", "Open Modal for Detail Information");

        const jobCompany = makeJobCompany(recruit, "crawling");
        const jobBodyWrap = makeRowBody(recruit, "crawling");

        const jobBottomWrap = makeRowBottom(recruit, "crawling", queryParameterDict);

        jobCardWrap.appendChild(jobPosition);
        jobCardWrap.appendChild(jobCompany);
        jobCardWrap.appendChild(jobBodyWrap);
        jobCardWrap.appendChild(jobBottomWrap);

        jobCardWrap.style.border = "1px solid #373737";

        return jobCardWrap;
    };

    // 크롤링한 공고 리스트 렌더링
    const renderCrawlingList = async (queryParameterDict) => {
        const crawlingCardList = getElFromId("crawling_job_card_list");
        removeAllNode(crawlingCardList);

        let initJobCrawlingURL = `${JobURL}/crawling/recruits`;
        console.log("initJobCrawlingURL", initJobCrawlingURL);
        console.log("renderCrawlingList - queryParameterDict", queryParameterDict);
        // return;

        const data = setFetchData("post", queryParameterDict);

        const loadingWrap = createNewElement(
            "div",
            "relative z-10 w-full loading-wrap",
            null,
            "loading_wrap"
        );
        const loadingBackground = createNewElement(
            "div",
            "fixed inset-0 transition-opacity bg-white bg-opacity-75",
            null,
            "loading_background"
        );
        const copyRight = createNewElement(
            "a",
            "hover:text-[blue] font-semibold underline fixed left-1/2 top-[calc(50%+50px)] lg:top-[calc(50%+100px)] translate-x-[-50%] z-10 loading-io",
            "Loding Icon is provided by loading.io",
            "loding_io"
        );
        copyRight.href = "https://loading.io/";
        const loadingImg = createNewElement(
            "img",
            "fixed left-1/2 top-[50%] translate-x-[-50%] translate-y-[-50%] z-10 w-[100px] h-[100px] lg:w-auto lg:h-auto loading-img",
            null,
            "loading_img"
        );
        loadingImg.src = "/static/img/icon/loading01.svg";
        loadingBackground.alt = "loading Img";

        loadingWrap.appendChild(loadingBackground);
        loadingWrap.appendChild(loadingImg);
        loadingWrap.appendChild(copyRight);
        getElFromSel("main").appendChild(loadingWrap);

        const post_response = await fetch(initJobCrawlingURL, data);
        loadingWrap.remove();
        console.log(post_response.status);

        if (post_response.status === 200) {
            const crawlingResult = await post_response.json();
            console.log("crawlingResult", crawlingResult);
            const crawlingRecruits = crawlingResult.recruits;
            crawlingRecruits.forEach((crawling_recruit) => {
                crawlingCardList.appendChild(
                    makeCrawlingCard(crawling_recruit, queryParameterDict)
                );
            });
        } else {
            const errorData = await post_response.json();
            console.log("errorData", errorData);
        }
    };

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

    fromChangedSelectElementRenderPostList(siteSelect, queryParameterDict, "post");
    fromChangedSelectElementRenderPostList(categorySelect, queryParameterDict, "post");
    fromChangedSelectElementRenderPostList(groupSelect, queryParameterDict, "post");
    fromChangedSelectElementRenderPostList(skillSelect, queryParameterDict, "post");
    fromChangedSelectElementRenderPostList(companyTagSelect, queryParameterDict, "post");
    fromChangedSelectElementRenderPostList(minCareerSelect, queryParameterDict, "post");

    fromChangedSelectElementRenderSelectBox(countrySelect, queryParameterDict, "post");
    fromChangedSelectElementRenderSelectBox(regionSelect, queryParameterDict, "post");

    fromSearchBtnRenderPostList(searchBtn, queryParameterDict, "post");

    /////////////////////////////////////////////////////// Crawling page Initialization
    const siteSelectInCrawling = getElFromId("crawling_filter_site");
    const groupSelectInCrawling = getElFromId("crawling_filter_group");
    const categorySelectInCrawling = getElFromId("crawling_filter_category");
    const countrySelectInCrawling = getElFromId("crawling_filter_country");
    const regionSelectInCrawling = getElFromId("crawling_filter_region");
    const detailRegionSelectInCrawling = getElFromId("crawling_filter_detail_region");
    const skillSelectInCrawling = getElFromId("crawling_search_skill");
    const companyTagSelectInCrawling = getElFromId("crawling_filter_company_tag");
    const minCareerSelectInCrawling = getElFromId("crawling_filter_min_career");

    renderSelectBoxInCrawling(crawlingQueryParameterDict, "crawling");
    // renderCrawlingList(crawlingQueryParameterDict);

    changeJobListURL(siteSelectInCrawling, crawlingQueryParameterDict, "site_id", [
        "group_id",
        "category_ids",
        "country_id",
        "region_id",
        "detail_region_id",
    ]);
    changeJobListURL(groupSelectInCrawling, crawlingQueryParameterDict, "group_id", [
        "category_ids",
    ]);
    changeJobListURL(categorySelectInCrawling, crawlingQueryParameterDict, "category_ids");
    changeJobListURL(countrySelectInCrawling, crawlingQueryParameterDict, "country_id", [
        "region_id",
        "detail_region_id",
    ]);
    changeJobListURL(regionSelectInCrawling, crawlingQueryParameterDict, "region_id", [
        "detail_region_id",
    ]);
    changeJobListURL(detailRegionSelectInCrawling, crawlingQueryParameterDict, "detail_region_id");
    changeJobListURL(companyTagSelectInCrawling, crawlingQueryParameterDict, "company_tag_ids");
    changeJobListURL(minCareerSelectInCrawling, crawlingQueryParameterDict, "min_career");

    siteSelectInCrawling.addEventListener("change", () => {
        renderSelectBoxInCrawling(crawlingQueryParameterDict, "crawling");
    });
    groupSelectInCrawling.addEventListener("change", () => {
        renderSelectBoxInCrawling(crawlingQueryParameterDict, "crawling");
    });
    categorySelectInCrawling.addEventListener("change", () => {
        const crawlingSkillInput = getElFromId("crawling_search_skill");
        if (
            crawlingQueryParameterDict.group_id == 1 &&
            crawlingQueryParameterDict.category_ids != 0
        ) {
            if (crawlingSkillInput) {
                crawlingSkillInput.disabled = false;
            }
        } else {
            crawlingSkillInput.value = "";
            crawlingQueryParameterDict.skill_ids = 0;
            crawlingSkillInput.disabled = true;
        }
    });
    countrySelectInCrawling.addEventListener("change", () => {
        renderSelectBoxInCrawling(crawlingQueryParameterDict, "crawling");
    });
    regionSelectInCrawling.addEventListener("change", () => {
        renderSelectBoxInCrawling(crawlingQueryParameterDict, "crawling");
    });
});
