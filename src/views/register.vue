<template>
<div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

        <!-- Login v1 -->
        <b-card class="mb-0" v-if="!mail_sent">
            <b-link class="brand-logo">
                <vuexy-logo />

            </b-link>

            <b-card-title class="mb-1">
               Create Account

            </b-card-title>
            <b-card-text class="mb-2">
              Start with Us.
            </b-card-text>

            <!-- form -->
            <validation-observer ref="loginForm" #default="{invalid}">

                <b-form class="auth-login-form mt-2" @submit.prevent>
                    <b-alert variant="danger" :show="myerrors != ''" class="mb-0">
                        <div class="alert-body">
                            <feather-icon icon="InfoIcon" class="mr-50" />
                            {{ myerrors }}
                        </div>
                    </b-alert>
                    <!-- email -->
                    <b-form-group label-for="Username" label="Username">
                        <validation-provider #default="{ errors }" name="Username" rules="required">
                            <b-form-input id="Username" v-model="Username" name="Username" :state="errors.length > 0 ? false:null" placeholder="Your Username" autofocus />
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </b-form-group>
                    <!-- email -->
                    <b-form-group label-for="email" label="Email">
                        <validation-provider #default="{ errors }" name="Email" rules="required|email">
                            <b-form-input id="email" v-model="email" name="login-email" :state="errors.length > 0 ? false:null" placeholder="john@example.com" autofocus />
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </b-form-group>

                    <!-- password -->
                    <b-form-group>

                        <validation-provider #default="{ errors }" name="Password" rules="required">
                            <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid':null">
                                <b-form-input id="password" v-model="password" :type="passwordFieldType" class="form-control-merge" :state="errors.length > 0 ? false:null" name="login-password" placeholder="Password" />

                                <b-input-group-append is-text>
                                    <feather-icon class="cursor-pointer" :icon="passwordToggleIcon" @click="togglePasswordVisibility" />
                                </b-input-group-append>
                            </b-input-group>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </b-form-group>

                    <!-- submit button -->
                    <b-button variant="primary" type="submit" block :disabled="invalid" @click="register()">
                        Sign Up
                    </b-button>
                    <span ref="loginload" />
                </b-form>

              
            </validation-observer>

            <b-card-text class="text-center mt-2">
                <span>Already have an account? </span>
                <b-link :to="{name:'login'}">
                    <span>Sign In</span>
                </b-link>
            </b-card-text>

        </b-card>
        <b-card v-else>
               <b-link class="brand-logo">
                <vuexy-logo />

            </b-link>
          <verfiycomp :email="email"></verfiycomp>
        </b-card>
        <!-- /Login v1 -->
    </div>
</div>
</template>

<script>
import verfiycomp from '@/views/verfiy/verfiymail.vue'
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
        verfiycomp
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
        register() {
            this.openLoading('default', 'loginload')
            const userData = {
                email: this.email,
                password: this.password,
                name: this.Username,
            }
            this.$refs.loginForm.validate().then(success => {
                if (success) {
                    axios
                        .post('/register/',
                            userData)
                        .then(response => {
                            this.closeLoading()
                            this.mail_sent = true
                          //  useJwt.setToken(response.data.access_token)
                           // useJwt.setRefreshToken(response.data.access_token)
                           // localStorage.setItem('userData', JSON.stringify(response.data))
                            console.log(response)
                        })
                        .catch(error => {
                            this.myerrors = error.response.data.errors[0]
                            this.closeLoading()
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
