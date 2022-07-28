<template>
<div class="auth-wrapper auth-v1 px-2" style="background-color:#283046">
    <div class="auth-inner py-2">

        <!-- Login v1 -->
        <b-card class="mb-0">
            <b-link class="brand-logo">
                <vuexy-logo />

            </b-link>

            <b-card-title class="mb-1 text-center">
                Welcome Back Admin ! 👋
            </b-card-title>
            <b-card-text class="mb-2 text-center">
              Let`s Start mange Percent.
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
                    <b-form-group label-for="email" label="Email">
                        <validation-provider #default="{ errors }" name="Email" rules="required|email">
                            <b-form-input id="email" v-model="userEmail" name="login-email" :state="errors.length > 0 ? false:null" placeholder="john@example.com" autofocus />
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </b-form-group>

                    <!-- password -->
                    <b-form-group>
                        <div class="d-flex justify-content-between">
                            <label for="password">Password</label>
                            <b-link :to="{name:'forget-password'}">
                                <small>Forgot Password?</small>
                            </b-link>
                        </div>
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

                    <!-- checkbox -->
                    <b-form-group>
                        <b-form-checkbox id="remember-me" v-model="status" name="checkbox-1">
                            Remember Me
                        </b-form-checkbox>
                    </b-form-group>

                    <!-- submit button -->
                    <b-button variant="primary" type="submit" block :disabled="invalid" @click="login">
                        Sign in
                    </b-button>
                    <span ref="loginload" />
                </b-form>
            </validation-observer>

      

        </b-card>
        <!-- /Login v1 -->
    </div>
</div>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'

import {
    ValidationProvider,
    ValidationObserver,
} from 'vee-validate'
import {
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BAlert,
    BCard,
    BLink,
    BCardTitle,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
} from 'bootstrap-vue'
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
        // BSV
        BButton,
        BAlert,
        BForm,
        BFormInput,
        BFormGroup,
        BCard,
        BCardTitle,
        BLink,
        VuexyLogo,
        BCardText,
        BInputGroup,
        BInputGroupAppend,
        BFormCheckbox,
        ValidationProvider,
        ValidationObserver,
    },
    mixins: [togglePasswordVisibility],
    data() {
        return {
            userEmail: '',
            password: '',
            status: '',
            // validation rules
            required,
            email,
            myerrors: '',
            myloader: '',
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
        login() {
            this.openLoading('default', 'loginload')
            this.$refs.loginForm.validate().then(success => {
                if (success) {
                    useJwt
                        .login({
                            email: this.userEmail,
                            password: this.password,
                        })
                        .then(response => {
                             this.closeLoading()
                            const userData = response.data.user
                            useJwt.setToken(response.data.access_token)
                            useJwt.setRefreshToken(response.data.access_token)
                            localStorage.setItem('userData', JSON.stringify(userData))
                            this.$router.push('/admin')
                           
                        })
                        .catch(error => {
                             this.closeLoading()
                            console.log(error.response.data.message)
                            if(error.response.data.message == 'response.invalid_data'){
                            this.myerrors =  error.response.data.errors[0]

                            }
                            else{
                            this.myerrors =  error.response.data.message

                            }
                           
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
