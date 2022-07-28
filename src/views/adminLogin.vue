<template>
<div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

        <!-- Login v1 -->
        <b-card class="mb-0">
            <b-link class="brand-logo">
                <vuexy-logo />
            </b-link>
            <b-alert :show="true" variant="warning" class="mb-0">
                <div class="alert-body">
                    <feather-icon icon="InfoIcon" class="mr-50" />
                    Logging in...
                </div>
            </b-alert>

        </b-card>
        <!-- /Login v1 -->
    </div>
</div>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'
import axios from '@axios'

import {
    ValidationProvider,
    ValidationObserver,
} from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
    required,
    email,
} from '@validations'
import {
    togglePasswordVisibility,
} from '@core/mixins/ui/forms'

export default {
    components: {
        VuexyLogo,
        ValidationProvider,
        ValidationObserver,
    },
    mixins: [togglePasswordVisibility],
    data() {
        return {
            token: '',
            myuser: ''
        }
    },
    async mounted() {
            await localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
        await localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

        // Remove userData from localStorage
        await localStorage.removeItem('userData')

        const myloader = this.$vs.loading({
            target: this.$refs.myapp,
            text: 'Logging in...',
            color: '#00a4e5'

        })
    
        this.token = this.$route.query.token;
        var here = this;
        if (this.token) {
            useJwt.setToken(this.token)
            await axios.get('/user').then((response) => {
                this.myuser = response.data.user;
                useJwt.setToken(this.token)
                useJwt.setRefreshToken(this.token)
                localStorage.setItem('userData', JSON.stringify(here.myuser))
                here.$router.push('/')
            }).catch(function (error) {
                console.log(error)

            });
        }
        myloader.close();

    },
    methods: {

    },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
