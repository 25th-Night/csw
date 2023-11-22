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
    setCookie,
    deleteCookie,
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
    useScrollTopBtn,
} from "./common.js";

document.addEventListener("DOMContentLoaded", async function () {
    // Scroll Top Button 사용
    useScrollTopBtn();

    // 상단 3버튼 - 생성
    const createJobBtn = (imgListDict) => {
        const titleBtnWrap = getElFromId("title_btn_wrap");

        const jobPostBtn = createNewElement(
            "img",
            "block h-6 mx-3 cursor-pointer sm:h-8 job-post-btn",
            null,
            "job_post_btn"
        );
        jobPostBtn.setAttribute("src", `/static/img/icon/${imgListDict.post.before}`);
        jobPostBtn.setAttribute("alt", "job-post-btn");

        const jobCrawlingBtn = createNewElement(
            "img",
            "block h-6 mx-3 cursor-pointer sm:h-8 job-crawling-btn",
            null,
            "job_crawling_btn"
        );
        jobCrawlingBtn.setAttribute("src", `/static/img/icon/gathering05.png`);
        jobCrawlingBtn.setAttribute("alt", "job-crawling-btn");

        const jobManageBtn = createNewElement(
            "img",
            "block h-6 mx-3 cursor-pointer sm:h-8 job-manage-btn",
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

    const minCareerInfo = [
        [0, "All"],
        [-1, "newcomer"],
        [1, "1 year ↑"],
        [2, "2 year ↑"],
        [3, "3 year ↑"],
        [4, "4 year ↑"],
        [5, "5 year ↑"],
        [6, "6 year ↑"],
        [7, "7 year ↑"],
        [8, "8 year ↑"],
        [9, "9 year ↑"],
        [10, "10 year ↑"],
    ];

    // Job Service URL
    const JobURL = getJobURL();
    let getJobListURL = `${JobURL}/recruits`;

    // Setting 정보 조회 함수
    const requestSetting = async (type) => {
        const data = setFetchData("get", {});
        const requestURL = `${JobURL}/settings/${type}`;
        const get_response = await fetch(requestURL, data);

        return get_response;
    };

    // Setting 모달에서 SAVE 버튼 클릭 시 처리 이벤트
    const saveSetting = async (type_) => {
        const saveSiteSetting = getElFromId(`setting_modal_${type_}_filter_site`).value;
        const saveGroupSetting = getElFromId(`setting_modal_${type_}_filter_group`).value;
        const saveCategorySetting = getElFromId(`setting_modal_${type_}_filter_category`).value;
        const saveCountrySetting = getElFromId(`setting_modal_${type_}_filter_country`).value;
        const saveRegionSetting = getElFromId(`setting_modal_${type_}_filter_region`).value;
        const saveDetailRegionSetting = getElFromId(
            `setting_modal_${type_}_filter_detail_region`
        ).value;
        const saveSkillSetting = getElFromId(`setting_modal_${type_}_search_skill`).getAttribute(
            "data-id"
        );
        const saveCompanyTagSetting = getElFromId(
            `setting_modal_${type_}_filter_company_tag`
        ).value;
        const saveMinCareerTagSetting = getElFromId(
            `setting_modal_${type_}_filter_min_career`
        ).value;

        let type;
        if (type_ == "post") {
            type = 1;
        } else if (type_ == "crawling") {
            type = 2;
        }

        const saveSettingData = {
            type: type,
            site_id: saveSiteSetting,
            group_id: saveGroupSetting,
            category_ids: saveCategorySetting,
            country_id: saveCountrySetting,
            region_id: saveRegionSetting,
            detail_region_id: saveDetailRegionSetting,
            skill_ids: saveSkillSetting,
            company_tag: saveCompanyTagSetting,
            min_career: saveMinCareerTagSetting,
        };

        console.log("saveSettingData", saveSettingData);

        if (saveGroupSetting == "0") {
            alert("Please select Group4");
        } else if (type_.includes("crawling") && saveCategorySetting == "0") {
            alert("Please select Category4");
        } else if (
            type_.includes("crawling") &&
            saveGroupSetting == "1" &&
            saveCategorySetting != "0" &&
            saveSkillSetting == "0"
        ) {
            alert("Please search Skill and select one");
        } else if (type_.includes("crawling") && saveMinCareerTagSetting == "0") {
            alert("Please select Minimum Career Year");
        } else {
            const data = setFetchData("put", saveSettingData);
            const requestURL = `${JobURL}/settings/${type}`;
            const get_response = await fetch(requestURL, data);
            const responseData = await get_response.json();
            if (get_response.status == 200) {
                alert("Saved successfully");
                console.log("responseData", responseData);
                return responseData;
            } else {
                console.log("errorData", responseData);
            }
        }
    };

    // Select Box 렌더링
    const handleSelectBox = (type) => {
        const typeId = type.replace(/-/g, "_");
        const siteSelectForCrawlingSetting = getElFromId(`${typeId}_filter_site`);
        const groupSelectForCrawlingSetting = getElFromId(`${typeId}_filter_group`);
        const categorySelectForCrawlingSetting = getElFromId(`${typeId}_filter_category`);
        const countrySelectForCrawlingSetting = getElFromId(`${typeId}_filter_country`);
        const regionSelectForCrawlingSetting = getElFromId(`${typeId}_filter_region`);

        siteSelectForCrawlingSetting.addEventListener("change", () => {
            const settingData = { site_id: getElFromId(`${typeId}_filter_site`) };
            renderSelectBox(settingData, `${typeId}`);
        });
        groupSelectForCrawlingSetting.addEventListener("change", () => {
            console.log("hi");
            let categoryUrl = "categories";
            const groupId = getElFromId(`${typeId}_filter_group`).value;
            if (groupId > 0) {
                categoryUrl += `?group_id=${groupId}`;
            }
            makeSelectOptions(
                JobURL,
                categoryUrl,
                `${typeId}_filter_category`,
                true,
                null,
                groupId,
                "Group"
            );

            const skillInputBox = getElFromId(`${typeId}_search_skill`);
            if (groupId != 1) {
                skillInputBox.disabled = true;
                skillInputBox.value = "";
                skillInputBox.setAttribute("data-id", 0);
                skillInputBox.placeholder = "Cannot use";
                const skillRemoveBtn = getElFromId(`${typeId}_search_skill_remove_btn`);
                if (skillRemoveBtn) {
                    skillRemoveBtn.remove();
                }
            }
            if (type.includes("post")) {
                skillInputBox.disabled = false;
                skillInputBox.placeholder = "search Skill";
            }
        });

        if (type.includes("crawling")) {
            categorySelectForCrawlingSetting.addEventListener("change", () => {
                const groupId = getElFromId(`${typeId}_filter_group`).value;
                const categoryId = getElFromId(`${typeId}_filter_category`).value;

                const skillInputBox = getElFromId(`${typeId}_search_skill`);
                if (groupId == 1 && categoryId != 0) {
                    skillInputBox.disabled = false;
                    skillInputBox.placeholder = "search Skill";
                } else {
                    skillInputBox.disabled = true;
                    skillInputBox.value = "";
                    skillInputBox.setAttribute("data-id", 0);
                    skillInputBox.placeholder = "Cannot use";
                    const skillRemoveBtn = getElFromId(`${typeId}_search_skill_remove_btn`);
                    if (skillRemoveBtn) {
                        skillRemoveBtn.remove();
                    }
                }
            });
        }

        countrySelectForCrawlingSetting.addEventListener("change", () => {
            let regionURL = "regions";
            const countryId = getElFromId(`${typeId}_filter_country`).value;
            if (countryId > 0) {
                regionURL += `?country_id=${countryId}`;
            }
            makeSelectOptions(
                JobURL,
                regionURL,
                `${typeId}_filter_region`,
                true,
                null,
                countryId,
                "Country"
            );
            const detailRegionSelect = getElFromId(`${typeId}_filter_detail_region`);
            removeAllNode(detailRegionSelect);
            const defaultOption = createNewElement("option", "default-option", `Country first`);
            defaultOption.value = 0;
            detailRegionSelect.appendChild(defaultOption);
        });
        regionSelectForCrawlingSetting.addEventListener("change", () => {
            let detailRegionURL = "detail_regions";
            const regionId = getElFromId(`${typeId}_filter_region`).value;
            if (regionId > 0) {
                detailRegionURL += `?region_id=${regionId}`;
            }
            makeSelectOptions(
                JobURL,
                detailRegionURL,
                `${typeId}_filter_detail_region`,
                true,
                null,
                regionId,
                "Region"
            );
        });
    };

    // Wanted API를 통해 skill 존재 여부 확인
    async function skillSearch(skillName, type) {
        const typeClass = type.replace(/_/g, "-");
        const typeId = type.replace(/-/g, "_");

        const crawlingSearchSkillList = getElFromId(`${typeId}_search_skill_list`);
        const crawlingSkillInput = getElFromId(`${typeId}_search_skill`);
        removeAllNode(crawlingSearchSkillList);
        if (skillName) {
            const requestURL = `${JobURL}/crawling/skill/search?keyword=${skillName}`;
            const data = setFetchData("get", {});
            const response = await fetch(requestURL, data);

            if (response.status === 200) {
                removeAllNode(crawlingSearchSkillList);
                crawlingSkillInput.setAttribute("data-id", 0);
                const searchedSkillList = await response.json();
                console.log("searchedSkillList", searchedSkillList);
                if (searchedSkillList) {
                    crawlingSearchSkillList.classList.remove("hidden");
                    const searchedSKillCloseBtnWrap = createNewElement(
                        "div",
                        "flex justify-end items-center",
                        null,
                        `${typeId}_searched_skill_close_btn_wrap`
                    );
                    const searchedSKillCloseSvg = `
                    <svg xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-7 h-7 p-1 cursor-pointer"
                            id="${typeId}_searched_skill_close_btn">
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
                            crawlingSkillInput.value = skill.name;
                            crawlingSkillInput.setAttribute("data-id", skill.id);
                            removeAllNode(crawlingSearchSkillList);
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

        const searchSKillInputRemoveSvgBtn = getElFromId(`${type}_search_skill_remove_btn`);

        if (searchSKillInputRemoveSvgBtn) {
            searchSKillInputRemoveSvgBtn.addEventListener("click", () => {
                clearSkillInputAndList(type);
            });
        }
    }

    // setting 모달에 추가할 select box
    const createSelectBox = (type, selectType, idx = null, disable = false) => {
        const typeClass = type.replace(/_/g, "-");
        const typeId = type.replace(/-/g, "_");
        const selectTypeClass = selectType.replace(/_/g, "-");
        const selectTypeId = selectType.replace(/-/g, "_");

        const className = `py-1 mx-3 border-b border-[#d9d9d9] outline-none scrollbar-thin scrollbar-thumb-black scrollbar-thumb-rounded-md ${typeClass}-filter-${selectTypeClass}`;
        const id = `${typeId}_filter_${selectTypeId}`;
        const createdSelectBox = createNewElement("select", className, null, id);
        const capitalizedSelectType = capitalize(selectTypeClass);
        createdSelectBox.title = `select ${capitalizedSelectType}`;
        createdSelectBox.placeholder = capitalizedSelectType;
        createdSelectBox.tabIndex = idx;
        createdSelectBox.disabled = disable;

        return createdSelectBox;
    };

    // Search Input Box 생성
    const createInputBox = async (skills, type, selectType, idx = null, disabled = false) => {
        const typeClass = type.replace(/_/g, "-");
        const typeId = type.replace(/-/g, "_");
        const selectTypeClass = selectType.replace(/_/g, "-");
        const selectTypeId = selectType.replace(/-/g, "_");

        const filterSkill = createNewElement(
            "div",
            `relative h-[35px] mx-3 border-b border-[#d9d9d9] text-left text-black bg-white ${typeClass}-filter-${selectTypeClass}`,
            null,
            `${typeId}_filter_${selectTypeId}`
        );
        const capitalizedSelectType = capitalize(selectType);
        filterSkill.title = `search ${capitalizedSelectType}`;
        const filterSkillWrap = createNewElement(
            "div",
            `absolute flex justify-between w-full origin-top-left left-1 top-1 ${type}-filter-${selectType}-wrap`,
            null,
            `${typeId}_filter_${selectTypeId}-wrap`
        );
        const filterSkillInput = createNewElement(
            "input",
            `w-[calc(100%-28px)] outline-none ${type}-search-${selectType}`,
            null,
            `${typeId}_search_${selectTypeId}`
        );

        const filterSearchList = createNewElement(
            "div",
            `absolute left-1 z-10 items-center hidden origin-top-left bg-white rounded-md shadow-lg w-44 justify-evenly top-10 ring-1 ring-black ring-opacity-5 focus:outline-none setting-modal-${type}-search-${selectType}-list`,
            null,
            `${typeId}_search_${selectTypeId}_list`
        );

        const createSearchRemoveBtn = (typeId, selectTypeId, filterSearchList) => {
            const filterRemoveSvg = `
            <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="#000000"
                    class="w-6 h-6 p-1 mr-1 cursor-pointer"
                    id="${typeId}_search_${selectTypeId}_remove_btn">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>`;
            const filterRemoveParser = new DOMParser();
            const filterRemoveSvgDOM = filterRemoveParser.parseFromString(
                filterRemoveSvg,
                "image/svg+xml"
            );
            const filterRemoveSvgElement = filterRemoveSvgDOM.documentElement;
            filterRemoveSvgElement.addEventListener("click", () => {
                filterSkillInput.value = "";
                filterSkillInput.setAttribute("data-id", 0);
                filterRemoveSvgElement.remove();
                removeAllNode(filterSearchList);
                filterSearchList.classList.add("hidden");
                filterSkillInput.focus();
            });
            return filterRemoveSvgElement;
        };

        const filterRemoveBtn = createSearchRemoveBtn(typeId, selectTypeId, filterSearchList);

        filterSkillWrap.appendChild(filterSkillInput);
        filterSkillWrap.appendChild(filterRemoveBtn);
        filterSkill.appendChild(filterSkillWrap);
        filterSkill.appendChild(filterSearchList);

        filterSkillInput.addEventListener(
            "input",
            debounce(() => {
                skillSearch(filterSkillInput.value, `${typeId}`);
            }, 500)
        );

        filterSkillInput.addEventListener("input", () => {
            if (getElFromId(`${typeId}_search_${selectTypeId}_remove_btn`)) {
            } else {
                const newFilterRemoveSvgElement = createSearchRemoveBtn(
                    typeId,
                    selectTypeId,
                    filterSearchList
                );
                filterSkillWrap.appendChild(newFilterRemoveSvgElement);
            }
            filterSkillInput.setAttribute("data-id", 0);
        });

        // Skill Input에 초기 데이터 설정
        if (skills.length) {
            const skillInitName = skills[0].name;
            filterSkillInput.value = skillInitName;
            filterSkillInput.setAttribute("data-id", skills[0].id);
        } else {
            filterSkillInput.value = "All";
            filterSkillInput.setAttribute("data-id", 0);
        }

        return filterSkill;
    };

    // Select box에서 post 요청 보낼 데이터 가져오기
    const getDataFromSelectBox = (type) => {
        const typeId = type.replace(/-/g, "_");

        const siteSelectBoxValue = getElFromId(`${typeId}_filter_site`).value;
        const groupSelectBoxValue = getElFromId(`${typeId}_filter_group`).value;
        const categorySelectBoxValue = getElFromId(`${typeId}_filter_category`).value;
        const countrySelectBoxValue = getElFromId(`${typeId}_filter_country`).value;
        const regionSelectBoxValue = getElFromId(`${typeId}_filter_region`).value;
        const detailRegionSelectBoxValue = getElFromId(`${typeId}_filter_detail_region`).value;
        const skillSearchBoxValue = getElFromId(`${typeId}_search_skill`).getAttribute("data-id");
        const companyTagSelectBoxValue = getElFromId(`${typeId}_filter_company_tag`).value;
        const minCareerSelectBoxValue = getElFromId(`${typeId}_filter_min_career`).value;

        const requestData = {
            site_id: siteSelectBoxValue,
            group_id: groupSelectBoxValue,
            category_ids: categorySelectBoxValue,
            country_id: countrySelectBoxValue,
            region_id: regionSelectBoxValue,
            detail_region_id: detailRegionSelectBoxValue,
            skill_ids: skillSearchBoxValue,
            company_tag: companyTagSelectBoxValue,
            min_career: minCareerSelectBoxValue,
        };
        console.log("requestData", requestData);
        return requestData;
    };

    // Select 영역 생성하기
    const createSelectArea = async (SettingData, type) => {
        const typeId = type.replace(/-/g, "_");
        const siteSelectBox = createSelectBox(`${typeId}`, "site", 1, true);
        const groupSelectBox = createSelectBox(`${typeId}`, "group", 2, false);
        const categorySelectBox = createSelectBox(`${typeId}`, "category", 3, false);
        const countrySelectBox = createSelectBox(`${typeId}`, "country", 4, true);
        const regionSelectBox = createSelectBox(`${typeId}`, "region", 5, false);
        const detailRegionSelectBox = createSelectBox(`${typeId}`, "detail-region", 6, false);
        const skillSearchBox = await createInputBox(
            SettingData.skills,
            `${typeId}`,
            "skill",
            7,
            false
        );
        const companyTagSelectBox = createSelectBox(`${typeId}`, "company-tag", 8, true);
        const minCareerSelectBox = createSelectBox(`${typeId}`, "min-career", 9, false);

        const SelectWrap = getElFromId(`${typeId}_select_wrap`);
        SelectWrap.appendChild(siteSelectBox);
        SelectWrap.appendChild(groupSelectBox);
        SelectWrap.appendChild(categorySelectBox);
        SelectWrap.appendChild(countrySelectBox);
        SelectWrap.appendChild(regionSelectBox);
        SelectWrap.appendChild(detailRegionSelectBox);
        SelectWrap.appendChild(skillSearchBox);
        SelectWrap.appendChild(companyTagSelectBox);
        SelectWrap.appendChild(minCareerSelectBox);

        getElFromId(`${typeId}_filter_skill-wrap`).classList.add("mt-1");
        getElFromId(`${typeId}_search_skill_remove_btn`).classList.add("pr-1");

        renderSelectBox(SettingData, `${typeId}`);

        handleSelectBox(`${typeId}`);
    };

    // Select Box 초기화 함수
    const deleteSelectAreaPlusBtn = (type) => {
        const typeId = type.replace(/-/g, "_");
        const selectWrap = getElFromId(`${typeId}_select_wrap`);
        removeAllNode(selectWrap);
        const submitBtn = getElFromId(`${typeId}_submit_btn`);
        submitBtn.remove();
    };

    // Setting 모달 닫기 함수
    const closeSettingModal = async () => {
        // 모달 숨기기
        const settingModal = getElFromId("setting_modal");
        settingModal.classList.add("hidden");
        // close 버튼 제거
        const closeSettingModalBtn = getElFromId("setting_modal_close_btn");
        closeSettingModalBtn.remove();

        // 모달 내부 데이터 비우기
        const postSelectWrap = getElFromId("setting_modal_post_select_wrap");
        removeAllNode(postSelectWrap);
        const saveBtnForPostSetting = getElFromId("setting_modal_post_save_btn");
        saveBtnForPostSetting.remove();

        const crawlingSelectWrap = getElFromId("setting_modal_crawling_select_wrap");
        removeAllNode(crawlingSelectWrap);
        const saveBtnForCrawlingSetting = getElFromId("setting_modal_crawling_save_btn");
        saveBtnForCrawlingSetting.remove();

        // body의 스크롤 원상복구
        const body = getElFromSel("body");
        body.style.overflow = "";

        // Post, Crawling 탭의 Select Box 변경
        if (getElFromId("job_post_btn").getAttribute("src") == "/static/img/icon/job-post04.png") {
            const postSettingResponse = await requestSetting(1);
            const postSettingData = await postSettingResponse.json();
            console.log("postSettingData", postSettingData);
            renderSelectBox(postSettingData, "post");
        } else if (
            getElFromId("job_crawling_btn").getAttribute("src") ==
            "/static/img/icon/gathering07.png"
        ) {
            const crawlingSettingResponse = await requestSetting(2);
            const crawlingSettingData = await crawlingSettingResponse.json();
            console.log("crawlingSettingData", crawlingSettingData);
            renderSelectBox(crawlingSettingData, "crawling");
        }
    };

    // Job Card 모달 닫기 함수
    const closeJobCard = () => {
        // 모달 숨기기
        const postModal = getElFromId("post_modal");
        postModal.classList.add("hidden");

        // 모달 내부 데이터 비우기
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
        const postModalBtnWrap = getElFromId("post_modal_btn_wrap");
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
    };

    // Skill Input & List 제거
    const clearSkillInputAndList = (type) => {
        const typeId = type.replace(/-/g, "_");
        const crawlingSkillInput = getElFromId(`${typeId}_search_skill`);
        const crawlingSearchSkillList = getElFromId(`${typeId}_search_skill_list`);
        const searchSKillInputRemoveSvgBtn = getElFromId(`${type}_search_skill_remove_btn`);

        crawlingSkillInput.value = "";
        removeAllNode(crawlingSearchSkillList);
        crawlingSearchSkillList.classList.add("hidden");
        if (searchSKillInputRemoveSvgBtn) {
            searchSKillInputRemoveSvgBtn.remove();
        }
        crawlingSkillInput.focus();
    };

    // Skill List 제거
    const searchedSkillListRemove = (type) => {
        const typeId = type.replace(/-/g, "_");
        const crawlingSearchSkillList = getElFromId(`${typeId}_search_skill_list`);
        removeAllNode(crawlingSearchSkillList);
        crawlingSearchSkillList.classList.add("hidden");
    };

    // 무한스크롤 구현 관련
    let page = 1; // 현재 페이지 정의
    let emptyPage = false;
    let blockRequest = false;
    let lastScrollY = 0;
    const handleScroll = () => {
        const requestData = JSON.parse(getCookie("requestData"));

        renderPostListByScroll(requestData);
    };

    // 페이지 전환 시 이벤트 활성화/비활성화
    const removeInfiniteScroll = () => {
        window.removeEventListener("scroll", handleScroll);
        deleteCookie("requestData");
        page = 1;
    };

    // Job Card 내의 Wrap 생성
    const makeJobCardWrap = (recruit, type) => {
        const jobCardWrap = createNewElement(
            "div",
            `w-full flex justify-center flex-col border p-2 hover:shadow-lg post-job-card-wrap-${recruit.id}`,
            null,
            `${type}_job_card_wrap_${recruit.id}`
        );

        jobCardWrap.style.border = "1px solid #373737";

        return jobCardWrap;
    };

    // Job Card 내의 Position 생성
    const makeJobPosition = (recruit, type) => {
        const jobPosition = createNewElement(
            "div",
            `p-2 h-10 md:w-[calc(100%-75px)] truncate hover:underline cursor-pointer hover:text-[#66FF99] font-semibold text-white ${type}-job-position-${recruit.id}`,
            recruit.position,
            `${type}_job_position_${recruit.id}`
        );
        jobPosition.addEventListener("click", () => {
            openModalToPositionEl(recruit);
        });
        jobPosition.setAttribute("title", "Click for detail Information");

        return jobPosition;
    };

    // Job Card 내의 Min Career 생성
    const makeJobMinCareer = (recruit, type) => {
        const setMinCareer = (min_career) => {
            let minCareer = min_career || min_career - 1;
            let returnMinCareer;
            for (let i = 0; i < minCareerInfo.length; i++) {
                const minCareerArray = minCareerInfo[i];
                if (minCareer == minCareerArray[0]) {
                    returnMinCareer = minCareerArray;
                    break;
                }
            }

            return returnMinCareer;
        };

        let minCareer = setMinCareer(recruit.min_career);

        const jobMinCareer = createNewElement(
            "div",
            `px-2 py-1 hidden md:flex w-[75px] justify-center items-center mr-2 text-xs rounded bg-white text-[#373737] ${type}-job-min-career-${recruit.id}`,
            minCareer[1],
            `${type}_job_min_career_${recruit.id}`
        );
        jobMinCareer.setAttribute("data-id", minCareer[0]);

        if (type.includes("post")) {
            jobMinCareer.setAttribute("title", "Click for filter Year");
            jobMinCareer.classList.add("cursor-pointer");
            jobMinCareer.classList.add("hover:underline");
            jobMinCareer.classList.add("hover:bg-[#d9d9d9]");

            const minCareerSelectBox = getElFromId(`${type}_filter_min_career`);

            jobMinCareer.addEventListener("click", async () => {
                const SettingResponse = await requestSetting(1);
                const SettingData = await SettingResponse.json();
                renderSelectBox(SettingData, type);

                const newRequestData = JSON.parse(getCookie("requestData"));
                if (newRequestData.min_career == minCareer[0]) {
                    minCareerSelectBox.value = 0;
                    newRequestData.min_career = 0;
                } else {
                    minCareerSelectBox.value = minCareer[0];
                    newRequestData.min_career = minCareer[0];
                }
                page = 1;
                emptyPage = false;
                blockRequest = false;
                lastScrollY = 0;
                setCookie("requestData", newRequestData, 1);
                renderPostList(newRequestData);
            });
        }

        return jobMinCareer;
    };

    // Job Card 내의 Title 생성
    const makeJobTitle = (recruit, type) => {
        const jobTitle = createNewElement(
            "div",
            `flex justify-between items-center w-full bg-[#373737] ${type}_job_title_${recruit.id}`,
            null,
            `${type}_job_title_${recruit.id}`
        );

        const jobPosition = makeJobPosition(recruit, type);
        const jobMinCareer = makeJobMinCareer(recruit, type);

        jobTitle.appendChild(jobPosition);
        jobTitle.appendChild(jobMinCareer);

        return jobTitle;
    };

    // Job Card 내의 Company 생성
    const makeJobCompany = (recruit, type) => {
        const jobCompanyWrap = createNewElement(
            "div",
            `w-full flex justify-between ${type}-job-company-wrap-${recruit.id}`,
            null,
            `${type}_job_company_wrap_${recruit.id}`
        );
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

        jobCompanyWrap.appendChild(jobCompany);

        return jobCompanyWrap;
    };

    // Job Card 내의 각 Row 생성
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

    // Job Card 내의 Body 생성
    const makeRowBody = (recruit, type) => {
        const jobBodyWrap = createNewElement(
            "div",
            `grid grid-cols-1 grid-rows-3 ${type}-job-body-wrap-${recruit.id}`,
            null,
            `${type}_job_body_wrap_${recruit.id}`
        );
        const jobTask = makeJobRow(recruit, type, "task");
        const jobRequirement = makeJobRow(recruit, type, "requirement");
        const jobPreference = makeJobRow(recruit, type, "preference");

        jobBodyWrap.appendChild(jobTask);
        jobBodyWrap.appendChild(jobRequirement);
        jobBodyWrap.appendChild(jobPreference);
        return jobBodyWrap;
    };

    // Job Card 내의 Bottom 생성
    const makeRowBottom = (recruit, type, requestData) => {
        const bottomWrap = createNewElement(
            "div",
            `flex flex-col my-1 items-center md:flex-row ${type}-bottom-wrap-${recruit.id}`,
            null,
            `${type}_bottom_wrap_${recruit.id}`
        );
        const regionWrap = createNewElement(
            "div",
            `flex items-center w-full md:w-auto ${type}-region-wrap-${recruit.id}`,
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

        const jobMinCareer = makeJobMinCareer(recruit, type);
        jobMinCareer.classList.remove("md:flex");
        jobMinCareer.classList.remove("hidden");
        jobMinCareer.classList.add("md:hidden");
        jobMinCareer.classList.add("flex");
        jobMinCareer.classList.add("flex");
        jobMinCareer.classList.add("border");
        jobMinCareer.classList.add("border-[#d9d9d9]");

        const skillWrap = createNewElement(
            "div",
            `flex items-center w-full mt-2 overflow-x-scroll scrollbar-hide md:mt-0 md:w-auto ${type}-skill-wrap-${recruit.id}`,
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
            if (requestData.skill_ids == skill.id) {
                skillElement.classList.add("bg-[#373737]");
            } else {
                skillElement.classList.add("bg-[#d9d9d9]");
                if (type == "post") {
                    skillElement.classList.add("hover:bg-[#373737]");
                }
            }

            if (type == "post") {
                skillElement.classList.add("cursor-pointer");

                const skillSearchInput = getElFromId(`${type}_search_skill`);

                skillElement.addEventListener("click", async () => {
                    const SettingResponse = await requestSetting(1);
                    const SettingData = await SettingResponse.json();
                    renderSelectBox(SettingData, type);

                    const newRequestData = JSON.parse(getCookie("requestData"));
                    if (newRequestData.skill_ids == skill.id) {
                        skillSearchInput.value = "All";
                        skillSearchInput.setAttribute("data-id", 0);
                        newRequestData.skill_ids = 0;
                        skillElement.classList.add("bg-[#d9d9d9]");
                        skillElement.classList.remove("bg-[#373737]");
                        skillElement.classList.add("hover:bg-[#373737]");
                    } else {
                        skillSearchInput.value = skill.name;
                        skillSearchInput.setAttribute("data-id", skill.id);
                        newRequestData.skill_ids = skill.id;
                        skillElement.classList.add("bg-[#373737]");
                        skillElement.classList.remove("bg-[#d9d9d9]");
                    }

                    page = 1;
                    emptyPage = false;
                    blockRequest = false;
                    lastScrollY = 0;
                    console.log("newRequestData", newRequestData);
                    setCookie("requestData", newRequestData, 1);
                    renderPostList(newRequestData);
                });
            }

            skillWrap.appendChild(skillElement);
        });

        regionWrap.appendChild(jobRegion);
        regionWrap.appendChild(likeSvgBtn);
        regionWrap.appendChild(scrapSvgBtn);
        regionWrap.appendChild(jobMinCareer);

        bottomWrap.appendChild(regionWrap);
        bottomWrap.appendChild(skillWrap);
        return bottomWrap;
    };

    // Job Card 생성
    const makeJobCard = (recruit, requestData, type) => {
        const jobCardWrap = makeJobCardWrap(recruit, type);
        const jobTitle = makeJobTitle(recruit, type);

        const jobCompany = makeJobCompany(recruit, type);
        const jobBodyWrap = makeRowBody(recruit, type);

        const jobBottomWrap = makeRowBottom(recruit, type, requestData);

        jobCardWrap.appendChild(jobTitle);
        jobCardWrap.appendChild(jobCompany);
        jobCardWrap.appendChild(jobBodyWrap);
        jobCardWrap.appendChild(jobBottomWrap);

        return jobCardWrap;
    };

    // loading 화면 생성
    const makeLoading = () => {
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
            "Loading Icon is provided by loading.io",
            "loading_io"
        );
        copyRight.href = "https://loading.io/";
        const loadingImg = createNewElement(
            "img",
            "fixed left-1/2 top-[50%] translate-x-[-50%] translate-y-[-50%] z-10 w-[100px] h-[100px] lg:w-auto lg:h-auto loading-img",
            null,
            "loading_img"
        );
        copyRight.target = "_blank";
        loadingImg.src = "/static/img/icon/loading01.svg";
        loadingBackground.alt = "loading Img";

        loadingWrap.appendChild(loadingBackground);
        loadingWrap.appendChild(loadingImg);
        loadingWrap.appendChild(copyRight);
        getElFromSel("main").appendChild(loadingWrap);

        return loadingWrap;
    };

    // Post Page로 이동 시, SEARCH 버튼 생성
    const createSearchBtn = () => {
        const postBtn = createNewElement(
            "div",
            "flex items-center font-semibold cursor-pointer hover:text-white hover:border-none hover:bg-[#373737] justify-center border border-[#d9d9d9] w-10 p-2 my-1 text-xs post-submit-btn",
            "SEARCH",
            "post_submit_btn"
        );
        postBtn.style.writingMode = "vertical-rl";
        postBtn.style.textOrientation = "upright";
        postBtn.addEventListener("click", async () => {
            const requestData = getDataFromSelectBox("post");

            if (requestData.group_id == 0) {
                alert("Please select Group2");
                // } else if (requestData.category_ids == 0) {
                //     alert("Please select Category2");
                // } else if (
                //     requestData.group_id == 1 &&
                //     requestData.category_ids != 0 &&
                //     requestData.skill_ids == 0
                // ) {
                //     alert("Please search Skill and select one");
                // } else if (requestData.min_career == 0) {
                //     alert("Please select Minimum Career");
            } else {
                page = 1;
                emptyPage = false;
                blockRequest = false;
                lastScrollY = 0;
                renderPostList(requestData);
            }
        });
        getElFromId("post_form").appendChild(postBtn);
    };

    // Crawling Page로 이동 시, START 버튼 생성
    const createStartBtn = () => {
        const crawlingBtn = createNewElement(
            "div",
            "flex items-center font-semibold cursor-pointer hover:text-white hover:border-none hover:bg-[#373737] justify-center border border-[#d9d9d9] w-10 p-2 my-1 text-xs crawling-submit-btn",
            "START",
            "crawling_submit_btn"
        );
        crawlingBtn.style.writingMode = "vertical-rl";
        crawlingBtn.style.textOrientation = "upright";
        crawlingBtn.addEventListener("click", async () => {
            const requestData = getDataFromSelectBox("crawling");

            if (requestData.group_id == 0) {
                alert("Please select Group3");
            } else if (requestData.category_ids == 0) {
                alert("Please select Category3");
            } else if (
                requestData.group_id == 1 &&
                requestData.category_ids != 0 &&
                requestData.skill_ids == 0
            ) {
                alert("Please search Skill and select one");
            } else if (requestData.min_career == 0) {
                alert("Please select Minimum Career");
            } else {
                renderCrawlingList(requestData);
            }
        });
        getElFromId("crawling_form").appendChild(crawlingBtn);
    };

    // Setting 페이지에서 Save 버튼 생성
    const addSaveBtnInSetting = () => {
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
            saveSetting("post");
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
            saveSetting("crawling");
        });
    };

    // Setting 페이지에 Close 버튼 생성
    const addCloseBtnInSetting = () => {
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
            closeSettingModal();
        });

        getElFromId("setting_modal_btn_wrap").appendChild(settingModalCloseSvgBtn);
    };

    // Select Box 내 Option 생성 함수
    const renderSelectBox = (settingData, type) => {
        const typeId = type.replace(/-/g, "_");
        console.log("typeId", typeId);

        // Select box 내에 option 생성

        let groupURL;
        let categoryUrl = "categories";
        let countryUrl;
        let regionURL = "regions";
        let detailRegionURL = "detail_regions";

        if (settingData.group_id > 0) {
            categoryUrl += `?group_id=${settingData.group_id}`;
        }

        if (settingData.country_id > 0) {
            regionURL += `?country_id=${settingData.country_id}`;
            detailRegionURL += `?country_id=${settingData.country_id}`;
        }

        if (settingData.region_id > 0) {
            if (settingData.country_id > 0) {
                detailRegionURL += `&region_id=${settingData.region_id}`;
            } else {
                detailRegionURL += `?region_id=${settingData.region_id}`;
            }
        }
        console.log("settingData", settingData);

        makeSelectOptions(JobURL, "sites", `${typeId}_filter_site`, true, settingData.site_id);
        makeSelectOptions(JobURL, "groups", `${typeId}_filter_group`, true, settingData.group_id);
        makeSelectOptions(
            JobURL,
            categoryUrl,
            `${typeId}_filter_category`,
            true,
            settingData.category_ids,
            settingData.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            `${typeId}_filter_country`,
            true,
            settingData.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURL,
            `${typeId}_filter_region`,
            true,
            settingData.region_id,
            settingData.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            `${typeId}_filter_detail_region`,
            true,
            settingData.detail_region_id,
            settingData.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            `${typeId}_filter_company_tag`,
            true,
            settingData.company_tag_ids
        );

        const skillInputBox = getElFromId(`${typeId}_search_skill`);

        if (settingData.skills.length) {
            skillInputBox.value = settingData.skills[0].name;
            skillInputBox.setAttribute("data-id", settingData.skills[0].id);
        } else {
            skillInputBox.value = "All";
            skillInputBox.setAttribute("data-id", 0);
        }
        if (type.includes("crawling")) {
            if (settingData.group_id == 1 && settingData.category_ids != 0) {
                skillInputBox.disabled = false;
            } else {
                skillInputBox.disabled = true;
            }
        }

        const minCareerSelectBox = getElFromId(`${typeId}_filter_min_career`);
        removeAllNode(minCareerSelectBox);

        minCareerInfo.forEach((minCareer) => {
            const minCareerOption = createNewElement(
                "option",
                "text-[#373737] select-option",
                null,
                `${typeId}_filter_min_career_${minCareer[0]}`
            );
            minCareerOption.value = minCareer[0];
            if (type.includes("post")) {
                minCareerOption.textContent = minCareer[1];
            } else if (type.includes("crawling")) {
                minCareerOption.textContent = minCareer[1].replace(/ ↑/g, "");
            }
            minCareerSelectBox.appendChild(minCareerOption);
        });
        minCareerSelectBox.value = settingData.min_career;
    };

    /////////////////////////////////////////////////////// Page Initialization
    // Post page를 벗어날 시 무한스크롤 이벤트 제거
    removeInfiniteScroll();

    // 크롤링 시 띄울 loading 영역 생성

    // 상단 3버튼 생성
    createJobBtn(jobPostBtnImgDict);

    const postSettingResponse = await requestSetting(1);
    const postSettingData = await postSettingResponse.json();

    // Select Area (Box, Button) 생성
    createSearchBtn();

    createSelectArea(postSettingData, "post");

    /////////////////////////////////////////////////////// Page Header

    //////////////////////////////// Job 관련 3개 버튼에 추가할 이벤트 정의

    // Post Button 클릭 이벤트 정의
    const addClickEventToPostBtn = async () => {
        console.log("addClickEventToPostBtn");

        const postSettingResponse = await requestSetting(1);
        const getPostSettingStatus = postSettingResponse.status;
        const postSettingData = await postSettingResponse.json();
        console.log("postSettingData", postSettingData);

        createSearchBtn();

        createSelectArea(postSettingData, "post");

        page = 1;
        emptyPage = false;
        blockRequest = false;
        lastScrollY = 0;

        createJobBtn(jobPostBtnImgDict);

        deleteSelectAreaPlusBtn("crawling");
        removeAllNode(getElFromId("crawling_job_card_list"));

        getElFromId("job_crawling_btn").addEventListener("click", () => {
            addClickEventToCrawlingBtn();
        });
        getElFromId("job_manage_btn").addEventListener("click", () => {
            addClickEventToManageBtn();
        });

        // 3개 영역 중 클릭한 버튼의 영역만 보이게 하기
        getElFromId("post_wrap").classList.remove("hidden");
        getElFromId("crawling_wrap").classList.add("hidden");
        // getElFromId("manage_wrap").classList.add("hidden");
    };

    // Crawling Button 클릭 이벤트 정의
    const addClickEventToCrawlingBtn = async () => {
        console.log("addClickEventToCrawlingBtn");

        const crawlingSettingResponse = await requestSetting(2);
        const getPostSettingStatus = crawlingSettingResponse.status;
        const crawlingSettingData = await crawlingSettingResponse.json();
        console.log("crawlingSettingData", crawlingSettingData);

        createStartBtn();

        createSelectArea(crawlingSettingData, "crawling");

        createJobBtn(jobCrawlingBtnImgDict);

        removeInfiniteScroll();

        deleteSelectAreaPlusBtn("post");
        removeAllNode(getElFromId("post_job_card_list"));

        getElFromId("job_post_btn").addEventListener("click", () => {
            addClickEventToPostBtn();
        });
        getElFromId("job_manage_btn").addEventListener("click", () => {
            addClickEventToManageBtn();
        });

        // 3개 영역 중 클릭한 버튼의 영역만 보이게 하기
        getElFromId("crawling_wrap").classList.remove("hidden");
        getElFromId("post_wrap").classList.add("hidden");
        // getElFromId("manage_wrap").classList.add("hidden");
    };

    // Manage Button 클릭 이벤트 정의
    const addClickEventToManageBtn = () => {
        createJobBtn(jobManageBtnImgDict);

        const crawlingSubmitBtn = getElFromId("crawling_submit_btn");
        const crawlingSearchSKill = getElFromId("crawling_search_skill");
        if (crawlingSubmitBtn) {
            crawlingSubmitBtn.remove();
        }
        if (crawlingSearchSKill) {
            crawlingSearchSKill.remove();
        }

        removeInfiniteScroll();

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

        // save 버튼 추가
        addSaveBtnInSetting();

        ////////////////////////////////// Post Setting
        const postSettingResponse = await requestSetting(1);
        const getPostSettingStatus = postSettingResponse.status;
        const postSettingData = await postSettingResponse.json();
        console.log("postSettingData", postSettingData);

        let queryParameterDict = postSettingData;

        createSelectArea(postSettingData, "setting_modal_post");

        ////////////////////////////////// Crawling Setting
        const crawlingSettingResponse = await requestSetting(2);
        const getCrawlingSettingStatus = crawlingSettingResponse.status;
        const crawlingSettingData = await crawlingSettingResponse.json();
        console.log("crawlingSettingData", crawlingSettingData);

        createSelectArea(crawlingSettingData, "setting_modal_crawling");

        ////////////////////////////////// Manage Setting

        ////////////////////////////////// Close Setting
        // 모달 close 버튼
        addCloseBtnInSetting();

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
    };

    /////////////////////////////////////////////////////// POST page

    // Job Card Modal Open 함수
    const openModalToPositionEl = (recruit) => {
        // 모달 요소에서 display: none 제거
        const postModal = getElFromId("post_modal");
        postModal.classList.remove("hidden");

        // 스크롤을 최상단으로 이동
        getElFromId("post_modal_body_wrap").scrollTop = 0;

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

        const skillDivWrap = createNewElement(
            "div",
            "flex flex-wrap items-start w-full post-skill-wrap"
        );
        let skillData = recruit.skills;
        skillData.forEach((skill) => {
            const skillDiv = createNewElement(
                "div",
                `whitespace-nowrap rounded mb-3 mr-2 post-modal-skill-${recruit.id}-${skill.id}`,
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
            "flex flex-wrap items-start w-full post-company-tag-wrap"
        );
        let companyTagData = recruit.company.tags;
        companyTagData.forEach((companyTag) => {
            const companyTagDiv = createNewElement(
                "div",
                `whitespace-nowrap rounded mb-3 mr-2 post-modal-company-tag-${recruit.id}-${companyTag.id}`,
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
                id="post_modal_like_btn">
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
                id="post_modal_scrap_btn">
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
                id="post_modal_close_btn">
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
            closeJobCard();
        });

        postModalBtnWrap.appendChild(postModalLikeSvgBtn);
        postModalBtnWrap.appendChild(postModalScrapSvgBtn);
        postModalBtnWrap.appendChild(postModalCloseSvgBtn);
    };

    // 채용공고 리스트 렌더링
    const renderPostList = async (requestData) => {
        let initJobListURL = `${JobURL}/recruits?${makeQueryParameter(requestData)}&page=1`;
        setCookie("requestData", requestData, 1);

        // Job Card List 렌더링
        const jobCardList = getElFromId("post_job_card_list");
        removeAllNode(jobCardList);

        const data = setFetchData("get", {});

        const get_recruits_response = await fetch(initJobListURL, data);

        if (get_recruits_response.status === 200) {
            const responseData = await get_recruits_response.json();
            // console.log("renderPostList - responseData", responseData);
            const recruits = responseData.results;
            recruits.forEach((recruit) => {
                jobCardList.appendChild(makeJobCard(recruit, requestData, "post"));
            });
        }

        window.removeEventListener("scroll", handleScroll);
        page = 2;
        window.addEventListener("scroll", handleScroll);
    };

    // 채용공고 리스트 렌더링
    const renderPostListByScroll = async (requestData) => {
        console.log("page", page);
        let initJobListURL = `${JobURL}/recruits?${makeQueryParameter(requestData)}&page=${page}`;

        // scroll 변화에 따른 페이지 추가
        let currentScrollY = window.scrollY;
        let margin = document.body.clientHeight - window.innerHeight - 200;

        if (
            currentScrollY > lastScrollY &&
            currentScrollY > margin &&
            !emptyPage &&
            !blockRequest
        ) {
            blockRequest = true;
            page += 1;

            const data = setFetchData("get", {});
            const jobCardList = getElFromId("post_job_card_list");

            const get_recruits_response = await fetch(initJobListURL, data);

            if (get_recruits_response.status === 200) {
                const responseData = await get_recruits_response.json();
                // console.log("renderPostListByScroll - responseData", responseData);
                const recruits = responseData.results;
                if (!recruits) {
                    emptyPage = true;
                } else {
                    recruits.forEach((recruit) => {
                        jobCardList.appendChild(makeJobCard(recruit, requestData, "post"));
                        blockRequest = false;
                    });
                }
            }
        }
        lastScrollY = currentScrollY;
    };

    /////////////////////////////////////////////////////// Crawling page

    // 크롤링한 공고 리스트 렌더링
    const renderCrawlingList = async (requestData) => {
        let initJobCrawlingURL = `${JobURL}/crawling/recruits`;
        // return;

        // Job Card List 렌더링
        const crawlingCardList = getElFromId("crawling_job_card_list");
        removeAllNode(crawlingCardList);

        const data = setFetchData("post", requestData);

        const loadingWrap = makeLoading();

        const post_response = await fetch(initJobCrawlingURL, data);

        loadingWrap.remove();
        console.log(post_response.status);

        if (post_response.status === 200) {
            const crawlingResult = await post_response.json();
            console.log("crawlingResult", crawlingResult);
            const crawlingRecruits = crawlingResult.recruits;
            const createdRecruitsIdxList = crawlingResult.created_recruit_idx_list;
            console.log("crawlingRecruits", crawlingRecruits);
            console.log("createdRecruitsIdxList", createdRecruitsIdxList);
            crawlingRecruits.forEach((crawling_recruit, idx) => {
                crawlingCardList.appendChild(
                    makeJobCard(crawling_recruit, requestData, "crawling")
                );
                if (idx in createdRecruitsIdxList) {
                    console.log("idx", idx);
                    console.log("crawling_recruit.id", crawling_recruit.id);
                    const jobCompanyWrap = getElFromId(
                        `crawling_job_company_wrap_${crawling_recruit.id}`
                    );
                    const createdMark = createNewElement(
                        "div",
                        `my-2 bg-[#5a5a5a] text-white text-xs p-2 rounded self-center crawling-job-new-mark-${crawling_recruit.id}`,
                        "New",
                        `crawling_job_new_mark_${crawling_recruit.id}`
                    );
                    jobCompanyWrap.appendChild(createdMark);
                }
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

    /////////////////////////////////////////////////////// Crawling page Initialization

    // esc 버튼 클릭 시 모달창 닫기
    setKeyForFunction(document, "Escape", () => {
        // Job Card 닫기
        const closeJobCardModalBtn = getElFromId("post_modal_close_btn");
        if (closeJobCardModalBtn) {
            closeJobCard();
            return;
        }

        // Post page에서 검색된 Skill List 닫기
        const searchedSkillListRemoveBtnInPost = getElFromId("post_searched_skill_close_btn");
        if (searchedSkillListRemoveBtnInPost) {
            searchedSkillListRemove("post");
            return;
        }
        // Crawling page에서 검색된 Skill List 닫기
        const searchedSkillListRemoveBtnInCrawling = getElFromId(
            "crawling_searched_skill_close_btn"
        );
        if (searchedSkillListRemoveBtnInCrawling) {
            searchedSkillListRemove("crawling");
            return;
        }

        // Setting page에서 검색된 Skill List 닫기
        const searchedSkillListRemoveBtnInPostSetting = getElFromId(
            "setting_modal_post_searched_skill_close_btn"
        );
        const searchedSkillListRemoveBtnInCrawlingSetting = getElFromId(
            "setting_modal_crawling_searched_skill_close_btn"
        );
        if (
            searchedSkillListRemoveBtnInPostSetting ||
            searchedSkillListRemoveBtnInCrawlingSetting
        ) {
            if (searchedSkillListRemoveBtnInPostSetting) {
                searchedSkillListRemove("setting_modal_post");
            }
            if (searchedSkillListRemoveBtnInCrawlingSetting) {
                searchedSkillListRemove("setting_modal_crawling");
            }
            return;
        }

        // Setting page 닫기
        const closeSettingModalBtn = getElFromId("setting_modal_close_btn");
        if (closeSettingModalBtn) {
            closeSettingModal();
            return;
        }
    });

    // 바깥 영역 클릭 시, 모달창 닫기
    document.addEventListener("mouseup", function (e) {
        const searchedSkillListRemoveBtnInPost = getElFromId("post_search_skill_list");
        const searchedSkillListRemoveBtnInCrawling = getElFromId("crawling_search_skill_list");
        if (
            searchedSkillListRemoveBtnInPost &&
            !searchedSkillListRemoveBtnInPost.contains(e.target)
        ) {
            searchedSkillListRemove("post");
        }

        if (
            searchedSkillListRemoveBtnInCrawling &&
            !searchedSkillListRemoveBtnInCrawling.contains(e.target)
        ) {
            searchedSkillListRemove("crawling");
        }

        const searchedSkillListRemoveBtnInPostSetting = getElFromId(
            "setting_modal_post_search_skill_list"
        );
        if (
            searchedSkillListRemoveBtnInPostSetting &&
            !searchedSkillListRemoveBtnInPostSetting.contains(e.target)
        ) {
            searchedSkillListRemove("setting_modal_post");
        }

        const searchedSkillListRemoveBtnInCrawlingSetting = getElFromId(
            "setting_modal_crawling_search_skill_list"
        );
        if (
            searchedSkillListRemoveBtnInCrawlingSetting &&
            !searchedSkillListRemoveBtnInCrawlingSetting.contains(e.target)
        ) {
            searchedSkillListRemove("setting_modal_crawling");
        }

        const settingModalWrap = getElFromId("setting_modal_wrap");
        const settingModal = getElFromId("setting_modal");
        if (!settingModal.classList.contains("hidden") && !settingModalWrap.contains(e.target)) {
            closeSettingModal();
        }

        const postModalWrap = getElFromId("post_modal_wrap");
        const postModal = getElFromId("post_modal");
        if (!postModal.classList.contains("hidden") && !postModalWrap.contains(e.target)) {
            closeJobCard();
        }
    });

    const SettingResponse = await requestSetting(1);
    const SettingData = await SettingResponse.json();
    console.log("SettingData", SettingData);
});
