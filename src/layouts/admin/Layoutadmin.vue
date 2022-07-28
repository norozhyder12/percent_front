<template>
<div >
    <div v-if="loading">
        <b-card class="load_all" ref="myapp">
            <div class="fit_logo_block">
                <VuexyLogo class="fit_logo"></VuexyLogo>
            </div>
        </b-card>
    </div>
    <layout-vertical v-else>

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
import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue'
// import AppCustomizer from '@core/layouts/components/app-customizer/AppCustomizer.vue'
// import { $themeConfig } from '@themeConfig'
import Navbar from '../components/Navbar.vue'

export default {
  components: {
    // AppCustomizer,
    LayoutVertical,
    Navbar,
  },
  data() {
    return {
        loading: true
      // showCustomizer: $themeConfig.layout.customizer,
    }
  },
    async mounted() {
        const myloader = this.$vs.loading({
            target: this.$refs.myapp,
            text: 'Loading your data ...',
            color: '#00a4e5'

        })
        axios
            .get('/user')
            .then(response => {
                const userData = response.data.user
                useJwt.setToken(response.data.access_token)
                useJwt.setRefreshToken(response.data.access_token)
                localStorage.setItem('userData', JSON.stringify(userData))
            })
            .catch(error => {
                this.$router.push('/login')
            })

        this.loading = false;
        myloader.close();

    }
}
</script>
