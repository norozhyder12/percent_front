<template>
<div id="app" class="h-100" :class="[skinClasses]">
    <component :is="layout">
        <router-view />
    </component>

</div>
</template>

<script>
// This will be populated in `beforeCreate` hook
import {
    $themeColors,
    $themeBreakpoints,
    $themeConfig
} from '@themeConfig'
import {
    provideToast
} from 'vue-toastification/composition'
import {
    watch
} from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'

import {
    useWindowSize,
    useCssVar
} from '@vueuse/core'

import store from '@/store'

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue')
const LayoutHorizontal = () => import('@/layouts/horizontal/LayoutHorizontal.vue')
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue')
import axios from '@axios'
import useJwt from '@/auth/jwt/useJwt'

export default {
    components: {

        // Layouts
        LayoutHorizontal,
        LayoutVertical,
        LayoutFull,

    },
    // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
    // Currently, router.currentRoute is not reactive and doesn't trigger any change
    computed: {
        layout() {
            if (this.$route.meta.layout === 'full') return 'layout-full'
            return `layout-${this.contentLayoutType}`
        },
        contentLayoutType() {
            return this.$store.state.appConfig.layout.type
        },
    },
    async mounted() {
        const myloader = this.$vs.loading({
            target: this.$refs.myapp,
            text: 'Loading your data ...',
            color: '#00a4e5'

        })
        var here = this;
        console.log(localStorage.getItem('userData'))
        axios
            .get('/user')
            .then(response => {
                const userData = response.data.user
                useJwt.setToken(response.data.access_token)
                useJwt.setRefreshToken(response.data.access_token)
                localStorage.setItem('userData', JSON.stringify(userData))
            })
            .catch(error => {
                localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
                localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

                // Remove userData from localStorage
                localStorage.removeItem('userData')
                here.$router.push('/login')
            })

        myloader.close();

    },

    beforeCreate() {
        // Set colors in theme
        const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

        // eslint-disable-next-line no-plusplus
        for (let i = 0, len = colors.length; i < len; i++) {
            $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
        }

        // Set Theme Breakpoints
        const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

        // eslint-disable-next-line no-plusplus
        for (let i = 0, len = breakpoints.length; i < len; i++) {
            $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2))
        }

        // Set RTL
        const {
            isRTL
        } = $themeConfig.layout
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    },
    setup() {
        const {
            skin,
            skinClasses
        } = useAppConfig()

        // If skin is dark when initialized => Add class to body
        if (skin.value === 'dark') document.body.classList.add('dark-layout')

        // Provide toast for Composition API usage
        // This for those apps/components which uses composition API
        // Demos will still use Options API for ease
        provideToast({
            hideProgressBar: true,
            closeOnClick: false,
            closeButton: false,
            icon: false,
            timeout: 3000,
            transition: 'Vue-Toastification__fade',
        })

        // Set Window Width in store
        store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
        const {
            width: windowWidth
        } = useWindowSize()
        watch(windowWidth, val => {
            store.commit('app/UPDATE_WINDOW_WIDTH', val)
        })

        return {
            skinClasses,
        }
    },
}
</script>
