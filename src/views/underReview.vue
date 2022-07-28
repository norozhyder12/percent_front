<template>
<div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2" style="width:40%;max-width:40%">

        <!-- Login v1 -->
        <b-card class="mb-0">
            <b-link class="brand-logo">
                <vuexy-logo />
            </b-link>
            <b-alert :show="true" variant="warning" class="mb-0 m-2" style="font-size:20px">
                <div class="alert-body">
                    <feather-icon icon="InfoIcon" class="mr-50" />
                   Thank you for submitting your business information. Your Account is under review and our team will contact you soon.
                </div>
            </b-alert>
            <b-card-text class="text-center mt-2">

                <b-btn variant="primary" :to="{name:'login'}">
                    <span>Sign In</span>
                </b-btn>
            </b-card-text>
        </b-card>
        <!-- /Login v1 -->
    </div>
</div>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'
import axios from '@axios'


import VuexyLogo from '@core/layouts/components/Logo.vue'

export default {
    components: {
        VuexyLogo,
 
    },

    data() {
        return {
            userEmail: '',
      
        }
    },

    methods: {
        openLoading(type, ref) {
            this.myloader = this.$vs.loading({
                target: this.$refs[ref][0],
                type,
            })
        },

    },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
