URL_LICENSE = {
    1: {
        "grade": "FREE",
        "max_link_cnt": 10,
        "monthly_limit_click": 100,
        "allow_alias": False,
    },
    2: {
        "grade": "BASIC",
        "max_link_cnt": 1000,
        "monthly_limit_click": 300000,
        "allow_alias": True,
    },
    3: {
        "grade": "PREMIUM",
        "max_link_cnt": 3000,
        "monthly_limit_click": float("inf"),
        "allow_alias": True,
    },
    4: {
        "grade": "MASTER",
        "max_link_cnt": 6000,
        "monthly_limit_click": float("inf"),
        "allow_alias": True,
    },
}

JOB_LICENSE = {
    1: {
        "grade": "FREE",
        "daily_crawling_limit": 1,
    },
    2: {
        "grade": "BASIC",
        "daily_crawling_limit": 5,
    },
    3: {
        "grade": "PREMIUM",
        "daily_crawling_limit": 10,
    },
    4: {
        "grade": "MASTER",
        "daily_crawling_limit": 30,
    },
}
