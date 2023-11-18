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

    const getPostSetting = async () => {
        const data = setFetchData("get", queryParameterDict);
        const requestURL = `${getJobListURL}/setting`;
        const get_response = await fetch(requestURL, data);

        return get_response;
    };

    /////////////////////////////////////////////////////// Page Header
    const renderSelectBoxInSettingModal = (queryParameterDict) => {
        // Select box 만들기

        console.log(
            "renderPostListInSettingModal - queryParameterDictInSettingModal",
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
            "setting_modal_post_filter_site",
            true,
            queryParameterDict.site_id
        );
        makeSelectOptions(
            JobURL,
            "groups",
            "setting_modal_post_filter_group",
            true,
            queryParameterDict.group_id
        );
        makeSelectOptions(
            JobURL,
            categoryUrl,
            "setting_modal_post_filter_category",
            true,
            queryParameterDict.category_ids,
            queryParameterDict.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            "setting_modal_post_filter_country",
            true,
            queryParameterDict.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURL,
            "setting_modal_post_filter_region",
            true,
            queryParameterDict.region_id,
            queryParameterDict.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            "setting_modal_post_filter_detail_region",
            true,
            queryParameterDict.detail_region_id,
            queryParameterDict.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "skills",
            "setting_modal_post_filter_skill",
            true,
            queryParameterDict.skill_ids
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            "setting_modal_post_filter_company_tag",
            true,
            queryParameterDict.company_tag_ids
        );
    };

    const savePostSetting = async (queryParameterDict) => {
        const data = setFetchData("put", queryParameterDict);
        console.log("savePostSetting - queryParameterDict", queryParameterDict);
        const requestURL = `${getJobListURL}/setting`;
        const get_response = await fetch(requestURL, data);
        if (get_response.status == 200) {
            alert("Saved successfully");
            return get_response;
        } else {
            alert(await get_response.json());
        }
    };

    /////////////////////////////////////////////////////// Setting Modal
    // setting 버튼
    const settingBtn = getElFromId("job_setting_btn");
    // setting 모달 오픈
    const openModalToSetting = async () => {
        const postSettingResponse = await getPostSetting();
        const getPostSettingStatus = postSettingResponse.status;
        const postSettingData = await postSettingResponse.json();

        console.log(getPostSettingStatus, postSettingData);

        let queryParameterDictInSettingModal = postSettingData;

        // 모달 요소에서 hidden 속성 제거
        const settingModal = getElFromId("setting_modal");
        settingModal.classList.remove("hidden");

        // body의 스크롤 방지
        const body = getElFromSel("body");
        body.style.overflow = "hidden";

        ////////////////////////////////// Post Setting

        // Post Settings SelectBox 만들기
        const siteSelectInSettingModal = getElFromId("setting_modal_post_filter_site");
        const groupSelectInSettingModal = getElFromId("setting_modal_post_filter_group");
        const categorySelectInSettingModal = getElFromId("setting_modal_post_filter_category");
        const countrySelectInSettingModal = getElFromId("setting_modal_post_filter_country");
        const regionSelectInSettingModal = getElFromId("setting_modal_post_filter_region");
        const detailRegionSelectInSettingModal = getElFromId(
            "setting_modal_post_filter_detail_region"
        );
        const skillSelectInSettingModal = getElFromId("setting_modal_post_filter_skill");
        const companyTagSelectInSettingModal = getElFromId("setting_modal_post_filter_company_tag");
        const minCareerSelectInSettingModal = getElFromId("setting_modal_post_filter_min_career");
        let groupURL;
        let categoryUrl = "categories";
        let countryUrl;
        let regionURL = "regions";
        let detailRegionURL = "detail_regions";

        if (queryParameterDictInSettingModal.group_id > 0) {
            categoryUrl += `?group_id=${queryParameterDictInSettingModal.group_id}`;
        }

        if (queryParameterDictInSettingModal.country_id > 0) {
            regionURL += `?country_id=${queryParameterDictInSettingModal.country_id}`;
            detailRegionURL += `?country_id=${queryParameterDictInSettingModal.country_id}`;
        }

        if (queryParameterDictInSettingModal.region_id > 0) {
            if (queryParameterDictInSettingModal.country_id > 0) {
                detailRegionURL += `&region_id=${queryParameterDictInSettingModal.region_id}`;
            } else {
                detailRegionURL += `?region_id=${queryParameterDictInSettingModal.region_id}`;
            }
        }

        makeSelectOptions(
            JobURL,
            "sites",
            "setting_modal_post_filter_site",
            true,
            queryParameterDictInSettingModal.site_id
        );
        makeSelectOptions(
            JobURL,
            "groups",
            "setting_modal_post_filter_group",
            true,
            queryParameterDictInSettingModal.group_id
        );
        makeSelectOptions(
            JobURL,
            categoryUrl,
            "setting_modal_post_filter_category",
            true,
            queryParameterDictInSettingModal.category_ids,
            queryParameterDictInSettingModal.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            "setting_modal_post_filter_country",
            true,
            queryParameterDictInSettingModal.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURL,
            "setting_modal_post_filter_region",
            true,
            queryParameterDictInSettingModal.region_id,
            queryParameterDictInSettingModal.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            "setting_modal_post_filter_detail_region",
            true,
            queryParameterDictInSettingModal.detail_region_id,
            queryParameterDictInSettingModal.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "skills",
            "setting_modal_post_filter_skill",
            true,
            queryParameterDictInSettingModal.skill_ids
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            "setting_modal_post_filter_company_tag",
            true,
            queryParameterDictInSettingModal.company_tag_ids
        );
        changeJobListURL(siteSelectInSettingModal, queryParameterDictInSettingModal, "site_id", [
            "group_id",
            "category_ids",
            "country_id",
            "region_id",
            "detail_region_id",
        ]);
        changeJobListURL(groupSelectInSettingModal, queryParameterDictInSettingModal, "group_id", [
            "category_ids",
        ]);
        changeJobListURL(
            categorySelectInSettingModal,
            queryParameterDictInSettingModal,
            "category_ids"
        );
        changeJobListURL(
            countrySelectInSettingModal,
            queryParameterDictInSettingModal,
            "country_id",
            ["region_id", "detail_region_id"]
        );
        changeJobListURL(
            regionSelectInSettingModal,
            queryParameterDictInSettingModal,
            "region_id",
            ["detail_region_id"]
        );
        changeJobListURL(
            detailRegionSelectInSettingModal,
            queryParameterDictInSettingModal,
            "detail_region_id"
        );
        changeJobListURL(skillSelectInSettingModal, queryParameterDictInSettingModal, "skill_ids");
        changeJobListURL(
            companyTagSelectInSettingModal,
            queryParameterDictInSettingModal,
            "company_tag_ids"
        );
        changeJobListURL(
            minCareerSelectInSettingModal,
            queryParameterDictInSettingModal,
            "min_career"
        );

        siteSelectInSettingModal.addEventListener("change", () => {
            renderSelectBoxInSettingModal(queryParameterDictInSettingModal);
        });
        groupSelectInSettingModal.addEventListener("change", () => {
            renderSelectBoxInSettingModal(queryParameterDictInSettingModal);
        });
        countrySelectInSettingModal.addEventListener("change", () => {
            renderSelectBoxInSettingModal(queryParameterDictInSettingModal);
        });
        regionSelectInSettingModal.addEventListener("change", () => {
            renderSelectBoxInSettingModal(queryParameterDictInSettingModal);
        });

        // save 버튼
        const saveBtnInSettingModal = createNewElement(
            "div",
            "flex items-center font-semibold cursor-pointer hover:text-[#373737] hover:border-none hover:bg-white justify-center border border-white w-10 p-2 text-sm setting-modal-post-save-btn",
            "SAVE",
            "setting_modal_post_save_btn"
        );

        saveBtnInSettingModal.addEventListener("click", () => {
            savePostSetting(queryParameterDictInSettingModal);
        });

        const settingModalPostData = getElFromId("setting_modal_post_data");
        settingModalPostData.appendChild(saveBtnInSettingModal);

        ////////////////////////////////// Crawling Setting

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
            removeAllNode(siteSelectInSettingModal);
            removeAllNode(groupSelectInSettingModal);
            removeAllNode(categorySelectInSettingModal);
            removeAllNode(countrySelectInSettingModal);
            removeAllNode(regionSelectInSettingModal);
            removeAllNode(detailRegionSelectInSettingModal);
            removeAllNode(skillSelectInSettingModal);
            removeAllNode(companyTagSelectInSettingModal);
            minCareerSelectInSettingModal.value = 0;
            saveBtnInSettingModal.remove();

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
            removeAllNode(siteSelectInSettingModal);
            removeAllNode(groupSelectInSettingModal);
            removeAllNode(categorySelectInSettingModal);
            removeAllNode(countrySelectInSettingModal);
            removeAllNode(regionSelectInSettingModal);
            removeAllNode(detailRegionSelectInSettingModal);
            removeAllNode(skillSelectInSettingModal);
            removeAllNode(companyTagSelectInSettingModal);
            minCareerSelectInSettingModal.value = 0;
            saveBtnInSettingModal.remove();

            // body의 스크롤 원상복구
            const body = getElFromSel("body");
            body.style.overflow = "";
        });
    };

    /////////////////////////////////////////////////////// POST page
    let queryParameterDict;
    const postSettingResponse = await getPostSetting();
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
    searchBtn.style.writingMode = "vertical-rl";
    searchBtn.style.textOrientation = "upright";

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

    const renderSelectBox = (queryParameterDict) => {
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

        makeSelectOptions(JobURL, "sites", "post_filter_site", true, queryParameterDict.site_id);
        makeSelectOptions(JobURL, "groups", "post_filter_group", true, queryParameterDict.group_id);
        makeSelectOptions(
            JobURL,
            categoryUrl,
            "post_filter_category",
            true,
            queryParameterDict.category_ids,
            queryParameterDict.group_id,
            "Group"
        );
        makeSelectOptions(
            JobURL,
            "countries",
            "post_filter_country",
            true,
            queryParameterDict.country_id
        );
        makeSelectOptions(
            JobURL,
            regionURL,
            "post_filter_region",
            true,
            queryParameterDict.region_id,
            queryParameterDict.country_id,
            "Country"
        );
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            "post_filter_detail_region",
            true,
            queryParameterDict.detail_region_id,
            queryParameterDict.region_id,
            "Region"
        );
        makeSelectOptions(
            JobURL,
            "skills",
            "post_filter_skill",
            true,
            queryParameterDict.skill_ids
        );
        makeSelectOptions(
            JobURL,
            "company_tags",
            "post_filter_company_tag",
            true,
            queryParameterDict.company_tag_ids
        );
    };

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
        renderSelectBox(queryParameterDict);

        // 상위 버튼 3개 마우스오버
        const jobListBtn = getElFromId("job_list_btn");
        const jobCrawlingBtn = getElFromId("job_crawling_btn");
        const jobManageBtn = getElFromId("job_manage_btn");
        imageHover(
            jobListBtn,
            "/static/img/icon/job-post03.png",
            "/static/img/icon/job-post04.png"
        );
        imageHover(
            jobCrawlingBtn,
            "/static/img/icon/gathering07.png",
            "/static/img/icon/gathering05.png"
        );
        imageHover(jobManageBtn, "/static/img/icon/manage02.png", "/static/img/icon/manage01.png");
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
