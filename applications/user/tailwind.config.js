/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './templates/**/*.html'
    ],
    theme: {
        extend: {
            fontFamily: {
                'montserrat': ['Montserrat', 'sans'],
                'prtendard': ['Pretendard-Regular', 'sans'],
                'elice': ['EliceDigitalBaeum', 'monospace'],
                'yedstreet': ["YDestreet", 'monospace'],
            },
        }
    },
    variants: {},
    plugins: [
        ({ addUtilities }) => {
            addUtilities({
                '.screen-width': {
                    '@apply mx-auto w-[90%] xl:max-w-[1024px] lg:max-w-[920px] md:max-w-[700px] sm:max-w-[576px]':
                    '',
                },
            });
        },
        ({ addBase }) => {
            addBase({
                body: {
                    fontFamily: 'EliceDigitalBaeum',
                    color: '#373737',
                },
            });
        },
    ],
}

