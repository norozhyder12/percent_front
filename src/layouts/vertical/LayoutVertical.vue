<template>
<div >

    <layout-vertical>

        <router-view />

        <template #navbar="{ toggleVerticalMenuActive }">
            <navbar :toggle-vertical-menu-active="toggleVerticalMenuActive" />
        </template>
        <!-- <app-customizer
      v-if="showCustomizer"
      slot="customizer"
    /> -->
    </layout-vertical>
</div>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'

import VuexyLogo from '@core/layouts/components/Logo.vue'

import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue'
// import AppCustomizer from '@core/layouts/components/app-customizer/AppCustomizer.vue'
// import { $themeConfig } from '@themeConfig'
import Navbar from '../components/Navbar.vue'
import axios from '@axios'

export default {
    components: {
        // AppCustomizer,
        LayoutVertical,
        Navbar,
        VuexyLogo
    },
    data() {
        return {
            loading: true
            // showCustomizer: $themeConfig.layout.customizer,
        }
    },

}
</script>

<style lang="scss" scoped>
.fit_logo_block {
    padding: 5px 10px;
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 14rem;
    background: #fff;
    z-index: 3;

    i {
        font-size: 18px;
        padding-left: 55px;
    }
}

.fit_logo {
    display: flex;
    padding: 1rem 0;
    align-items: center;

    .fit_icon {
        height: 40px;
        margin-right: 15px;
    }

    .fit_logo_text {
        height: 40px;
    }
}

.load_all {

    height: 100vh;
    display: flex;
    align-items: center;

    justify-content: center;
    .card-body{
      display: flex;
    }
}
</style>
