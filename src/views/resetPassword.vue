<template>
<div class="auth-wrapper auth-v1 px-2" ref="re2">
    <div class="auth-inner py-2">

        <!-- Login v1 -->
        <b-card class="mb-0">
            <b-link class="brand-logo">
                <vuexy-logo />
            </b-link>
            <b-card-title class="mb-1">
                Reset Password 🔒
            </b-card-title>
            <b-card-text class="mb-2">
                Your new password must be different from previously used passwords
            </b-card-text>

            <!-- form -->
            <validation-observer ref="simpleRules" v-if="!password_changed">
                             <b-alert :show="mail_errors" variant="danger" class="mb-0">
                <div class="alert-body d-flex align-items-center">
                    <feather-icon icon="InfoIcon" class="mr-50" />
                    <p>{{error_message}} </p>

                </div>
            </b-alert>
                <b-form method="POST" class="auth-reset-password-form mt-2" @submit.prevent="resetPassword">

                    <!-- password -->
                    <b-form-group label="New Password" label-for="reset-password-new">
                        <validation-provider #default="{ errors }" name="Password" vid="Password" rules="required|password">
                            <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid':null">
                                <b-form-input id="reset-password-new" v-model="password" :type="password1FieldType" :state="errors.length > 0 ? false:null" class="form-control-merge" name="reset-password-new" placeholder="············" />
                                <b-input-group-append is-text>
                                    <feather-icon class="cursor-pointer" :icon="password1ToggleIcon" @click="togglePassword1Visibility" />
                                </b-input-group-append>
                            </b-input-group>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </b-form-group>

                    <!-- confirm password -->
                    <b-form-group label-for="reset-password-confirm" label="Confirm Password">
                        <validation-provider #default="{ errors }" name="Confirm Password" rules="required|confirmed:Password">
                            <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid':null">
                                <b-form-input id="reset-password-confirm" v-model="cPassword" :type="password2FieldType" class="form-control-merge" :state="errors.length > 0 ? false:null" name="reset-password-confirm" placeholder="············" />
                                <b-input-group-append is-text>
                                    <feather-icon class="cursor-pointer" :icon="password2ToggleIcon" @click="togglePassword2Visibility" />
                                </b-input-group-append>
                            </b-input-group>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </b-form-group>

                    <!-- submit button -->
                    <b-button block type="submit" variant="primary">
                        Set New Password
                    </b-button>
                </b-form>
            </validation-observer>
   <b-alert :show="true" variant="success" class="mb-0" v-else>
                <div class="alert-body">
                    <feather-icon icon="InfoIcon" class="mr-50" />
                    <p>Password has been successfully Reset.</p>

                </div>
            </b-alert>
            <b-card-text class="text-center mt-2">
                <b-link :to="{name:'auth-login-v1'}">
                    <feather-icon icon="ChevronLeftIcon" /> Back to login
                </b-link>
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
    ValidationObserver
} from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
    required
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
               required,
            error_message: '',
            mail_errors: false,
            userEmail: '',
            password: '',
            Username: '',
            cPassword: '',
            // validation rules
            myerrors: '',
            myloader: '',
            sent_again: false,
            countDown: 60,
            password_changed: false,
                password1FieldType: 'password',
            password2FieldType: 'password',

        }
    },
    computed: {
        password1ToggleIcon() {
            return this.password1FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
        },
        password2ToggleIcon() {
            return this.password2FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
        },
    },
    watch: {
        countDown(val) {
            if (val == 0) {
                this.sent_again = false;
                this.countDown = 60;
            }

        }
    },
    methods: {

        openLoading(type, ref) {
            this.myloader = this.$vs.loading({
                target: this.$refs.re2,
                type,
            })
        },
        closeLoading() {
            this.myloader.close()
        },
   togglePassword1Visibility() {
            this.password1FieldType = this.password1FieldType === 'password' ? 'text' : 'password'
        },
        togglePassword2Visibility() {
            this.password2FieldType = this.password2FieldType === 'password' ? 'text' : 'password'
        },
       async resetPassword() {
            this.mail_errors = false;
            this.openLoading();
            var here = this;
            await this.$refs.simpleRules.validate().then(success => {
                if (success) {
                    var data = {
                        email:here.$route.query.email,
                        token:here.$route.query.token,
                        password:here.password,
                        password_confirmation:here.password
                    }
                    console.log(data)
                    axios.post('password/reset', data).then((response) => {
                        console.log(response)
                        here.password_changed = true;
                          here.myloader.close();

                    }).catch(function (error) {
                        console.log(error.response);
                          here.myloader.close();
                        here.mail_errors = true;
                        here.error_message = error.response.data.message;

                    });
                }
            })
           
        },
    }

}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
