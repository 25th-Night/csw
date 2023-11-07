/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./templates/**/*.html"],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ["Montserrat", "sans"],
                prtendard: ["Pretendard-Regular", "sans"],
                elice: ["EliceDigitalBaeum", "monospace"],
                yedstreet: ["YDestreet", "monospace"],
            },
        },
    },
    variants: {},
    plugins: [
        ({ addUtilities }) => {
            addUtilities({
                ".screen-width": {
                    "@apply mx-auto w-[90%] xl:max-w-[1024px] lg:max-w-[920px] md:max-w-[800px] sm:max-w-[576px]":
                        "",
                },
                ".title": {
                    "@apply text-2xl": "",
                },
                ".select-option": {
                    "@apply text-sm checked:bg-black checked:text-white": "",
                },
                ".url-list-1": {
                    "@apply w-[calc(100%-90px)] text-center md:max-w-[300px] lg:max-w-[270px] text-sm md:text-base truncate":
                        "",
                },
                ".url-list-2": {
                    "@apply hidden lg:block text-center lg:w-[calc(100%-670px)] text-sm md:text-base truncate":
                        "",
                },
                ".url-list-3": {
                    "@apply hidden min-[565px]:block w-[calc(100%-340px)] text-center md:w-[100px] lg:w-[120px] text-xs md:text-base truncate":
                        "",
                },
                ".url-list-4": {
                    "@apply hidden md:flex justify-center md:w-[60px] text-center text-xs md:text-sm":
                        "",
                },
                ".url-list-5": {
                    "@apply flex justify-center w-[45px] md:w-[50px] text-center text-xs md:text-sm":
                        "",
                },
                ".url-link": {
                    "@apply underline cursor-pointer hover:font-semibold text-black hover:text-[#0000FF]":
                        "",
                },
            });
        },
        ({ addBase }) => {
            addBase({
                body: {
                    fontFamily: "EliceDigitalBaeum",
                    color: "#373737",
                },
            });
        },
    ],
};
