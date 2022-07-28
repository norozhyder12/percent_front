<template>
<div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

        <!-- Login v1 -->
        <b-card class="mb-0">
            <b-link class="brand-logo">
                <vuexy-logo />
            </b-link>
            <b-alert :show="true" variant="success" class="mb-0">
                <div class="alert-body">
                    <feather-icon icon="InfoIcon" class="mr-50" />
                    Your email has been Verified Thank You.
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
            userEmail: '',
            password: '',
            Username: '',
            status: '',
            // validation rules
            required,
            email,
            myerrors: '',
            myloader: '',
            mail_sent: false,
        }
    },
    computed: {
        passwordToggleIcon() {
            return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
        },

    },
    methods: {
        openLoading(type, ref) {
            this.myloader = this.$vs.loading({
                target: this.$refs[ref][0],
                type,
            })
        },
        closeLoading() {
            this.myloader.close()
        },
        resend_mail() {
            axios
                .post('/email/verify/resend')
                .then(response => {
                    this.closeLoading()
                    this.mail_sent = true
                    console.log(response)
                })
                .catch(error => {
                    this.myerrors = error.response.data.message
                    this.closeLoading()
                })
        },
        login() {
            this.openLoading('default', 'loginload')
            this.$refs.loginForm.validate().then(success => {
                const userData = {
                    email: this.email,
                    password: this.password,
                    name: this.Username,
                }
                if (success) {
                    axios
                        .post('/register/',
                            userData)
                        .then(response => {
                            this.closeLoading()
                            this.mail_sent = true
                            useJwt.setToken(response.data.access_token)
                            useJwt.setRefreshToken(response.data.access_token)
                            localStorage.setItem('userData', JSON.stringify(userData))
                            console.log(response)
                        })
                        .catch(error => {
                            this.myerrors = error.response.data.message
                            this.closeLoading()
                        })
                }
            })
        },
        validationForm() {
            this.$refs.loginValidation.validate().then(success => {
                if (success) {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Form Submitted',
                            icon: 'EditIcon',
                            variant: 'success',
                        },
                    })
                }
            })
        },

    },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
