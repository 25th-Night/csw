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

document.addEventListener("DOMContentLoaded", function () {
    // Job Service URL
    const JobURL = getJobURL();
    let getJobListURL = `${JobURL}/recruits`;
    let queryParameterDict = {
        site: 1,
        group: 1,
        country: 5,
        region: 37,
    };

    const siteSelect = getElFromId("filter_site");
    const groupSelect = getElFromId("filter_group");
    const categorySelect = getElFromId("filter_category");
    const countrySelect = getElFromId("filter_country");
    const regionSelect = getElFromId("filter_region");
    const detailRegionSelect = getElFromId("filter_detail_region");

    const categorySubmitBtn = getElFromId("job_category_btn");
    const regionSubmitBtn = getElFromId("job_region_btn");
    const skillTagSubmitBtn = getElFromId("job_skill_tag_btn");

    siteSelect.disabled = true;
    countrySelect.disabled = true;

    const changeJobListURL = (selectEl, queryParameter) => {
        selectEl.addEventListener("change", () => {
            if (parseInt(selectEl.value) > 0) {
                queryParameterDict[queryParameter] = selectEl.value;
                console.log("queryParameterDict", queryParameterDict);
            } else if (queryParameter in queryParameterDict && parseInt(selectEl.value) <= 0) {
                delete queryParameterDict[queryParameter];
                console.log("queryParameterDict", queryParameterDict);
            }
            let queryParams = makeQueryParameter(queryParameterDict);
            console.log("queryParams", queryParams);
        });
    };

    const makeJobRow = (recruit, attribute) => {
        const rowWrap = createNewElement(
            "div",
            `flex my-2 text-sm h-20 job-${attribute}-wrap-${recruit.id}`,
            null,
            `job_${attribute}_wrap_${recruit.id}`
        );
        const rowLabel = createNewElement(
            "div",
            `h-full pr-2 border-r border-[#373737] font-bold job-${attribute}-label-${recruit.id}`,
            capitalize(attribute),
            `job-${attribute}-label-${recruit.id}`
        );
        rowLabel.style.width = "100px";
        const rowData = createNewElement(
            "div",
            `h-full overflow-hidden job-${attribute}-${recruit.id}`,
            recruit[attribute],
            `job_${attribute}_${recruit.id}`
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
            `flex truncate justify-center my-2 w-1/2 cursor-pointer border-b border-[#373737] hover:underline font-semibold job-company-${recruit.id}`,
            recruit.company.name,
            `job_company_${recruit.id}`
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
            `grid grid-cols-1 grid-rows-3 job-body-wrap-${recruit.id}`,
            null,
            `job_body_wrap_${recruit.id}`
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
            `flex flex-col my-1 items-center xl:flex-row bottom-wrap-${recruit.id}`,
            null,
            `bottom_wrap_${recruit.id}`
        );
        const regionWrap = createNewElement(
            "div",
            `flex items-center w-full xl:w-auto region-wrap-${recruit.id}`,
            null,
            `region_wrap_${recruit.id}`
        );
        const jobRegion = createNewElement(
            "div",
            `mr-2 w-8 font-semibold job-region-${recruit.id}`,
            recruit.detail_region.region.name,
            `job_region_${recruit.id}`
        );
        const likeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        `;
        const likeParser = new DOMParser();
        const likeSvgDOM = likeParser.parseFromString(likeSvg, "image/svg+xml");
        const likeSvgBtn = likeSvgDOM.documentElement;
        const scrapSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
        `;
        const scrapParser = new DOMParser();
        const scrapSvgDOM = scrapParser.parseFromString(scrapSvg, "image/svg+xml");
        const scrapSvgBtn = scrapSvgDOM.documentElement;

        const skillWrap = createNewElement(
            "div",
            `flex items-center w-full truncate mt-2 xl:mt-0 xl:w-auto skill-wrap-${recruit.id}`,
            null,
            `skill_wrap_${recruit.id}`
        );
        recruit.skills.forEach((skill) => {
            const skillElement = createNewElement(
                "div",
                `p-1 mx-1 text-xs text-white rounded skill-${recruit.id}-${skill.id}`,
                skill.name,
                `skill_${recruit.id}_${skill.id}`
            );
            skillElement.style.backgroundColor = "#d9d9d9";
            hoverChangeBackgroundColor(skillElement, "#373737", "#d9d9d9");
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
            `w-full flex justify-center flex-col border p-2 hover:shadow-lg job-card-wrap-${recruit.id}`,
            null,
            `job_card_wrap_${recruit.id}`
        );
        const jobPosition = createNewElement(
            "div",
            `p-2 h-10 overflow-hidden hover:underline cursor-pointer hover:text-[#66FF99] font-semibold bg-[#373737] text-white job-position-${recruit.id}`,
            recruit.position,
            `job_position_${recruit.id}`
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
        companyTagData.forEach((companyTag, idx) => {
            const companyTagDiv = createNewElement(
                "div",
                `rounded mr-2 post-modal-company-tag-${recruit.id}-${idx}`,
                `${companyTag}`,
                `post_modal_company-tag_${recruit.id}_${idx}`
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
            postModal.classList.add("hidden");
            // body의 스크롤 원상복구
            const body = getElFromSel("body");
            body.style.overflow = "";
        });

        postModalBtnWrap.appendChild(postModalLikeSvgBtn);
        postModalBtnWrap.appendChild(postModalScrapSvgBtn);
        postModalBtnWrap.appendChild(postModalCloseSvgBtn);

        // esc 버튼 클릭 시 모달창 닫기
        setKeyForFunction(document, "Escape", () => {
            postModal.classList.add("hidden");
            const body = getElFromSel("body");
            body.style.overflow = "";
        });
    };

    const renderTemplate = async (queryParameterDict) => {
        let groupURL;
        let categoryUrl = "categories";
        let countryUrl;
        let regionURL = "regions";
        let detailRegionURL = "detail_regions";

        if (queryParameterDict.group) {
            categoryUrl += `?group_id=${queryParameterDict.group}`;
        }

        if (queryParameterDict.country) {
            regionURL += `?country_id=${queryParameterDict.country}`;
            detailRegionURL += `?country_id=${queryParameterDict.country}`;
        }

        if (queryParameterDict.region) {
            if (queryParameterDict.country) {
                detailRegionURL += `&region_id=${queryParameterDict.region}`;
            } else {
                detailRegionURL += `?region_id=${queryParameterDict.region}`;
            }
        }

        makeSelectOptions(JobURL, "sites", "filter_site", false, queryParameterDict.site);
        makeSelectOptions(JobURL, "groups", "filter_group", true, queryParameterDict.group);
        makeSelectOptions(
            JobURL,
            categoryUrl,
            "filter_category",
            true,
            queryParameterDict.category
        );
        makeSelectOptions(JobURL, "countries", "filter_country", true, queryParameterDict.country);
        makeSelectOptions(JobURL, regionURL, "filter_region", true, queryParameterDict.region);
        makeSelectOptions(
            JobURL,
            detailRegionURL,
            "filter_detail_region",
            true,
            queryParameterDict.detail_region
        );
        let initJobListURL = `${JobURL}/recruits?${makeQueryParameter(queryParameterDict)}`;
        console.log("initJobListURL", initJobListURL);

        const data = setFetchData("get", {});

        // Job Card List 렌더링
        const jobCardList = getElFromId("job_card_list");
        removeAllNode(jobCardList);

        const get_recruits_response = await fetch(initJobListURL, data);

        if (get_recruits_response.status === 200) {
            let recruits = await get_recruits_response.json();
            console.log(recruits);
            recruits.forEach((recruit) => {
                jobCardList.appendChild(makeJobCard(recruit));
            });
        }

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

    // init
    changeJobListURL(siteSelect, "site_id");
    changeJobListURL(groupSelect, "group_id");
    changeJobListURL(categorySelect, "category_ids");
    changeJobListURL(countrySelect, "country_id");
    changeJobListURL(regionSelect, "region_id");
    changeJobListURL(detailRegionSelect, "detail_region_id");

    changeSelectOptions(
        JobURL,
        "filter_group",
        "group_id",
        "categories",
        "filter_category",
        true,
        null
    );

    changeSelectOptions(
        JobURL,
        "filter_country",
        "country_id",
        "regions",
        "filter_region",
        true,
        null
    );

    changeSelectOptions(
        JobURL,
        "filter_region",
        "region_id",
        "detail_regions",
        "filter_detail_region",
        true,
        null
    );

    renderTemplate(queryParameterDict);

    imageHover(categorySubmitBtn, "/static/img/icon/enter02.png", "/static/img/icon/enter01.png");
    imageHover(regionSubmitBtn, "/static/img/icon/enter02.png", "/static/img/icon/enter01.png");
    imageHover(skillTagSubmitBtn, "/static/img/icon/enter02.png", "/static/img/icon/enter01.png");
});
