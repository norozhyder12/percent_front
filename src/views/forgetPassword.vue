<template>
<div class="auth-wrapper auth-v1 px-2" ref="reset">
    <div class="auth-inner py-2">

        <!-- Login v1 -->
        <b-card class="mb-0">
            <b-link class="brand-logo">
                <vuexy-logo />
            </b-link>
            <b-card-title class="mb-1">
                Forgot Password? 🔒
            </b-card-title>
            <b-card-text class="mb-2">
                Enter your email and we'll send you instructions to reset your password
            </b-card-text>

            <!-- form -->
            <validation-observer ref="simpleRules" v-if="!mail_sent">
                    <b-alert :show="mail_errors" variant="danger" class="mb-0">
                <div class="alert-body d-flex align-items-center">
                    <feather-icon icon="InfoIcon" class="mr-50" />
                    <p>{{error_message}} </p>

                </div>
            </b-alert>
                <b-form class="auth-forgot-password-form mt-2" @submit.prevent="SendPassword">
                    <!-- email -->
                    <b-form-group label="Email" label-for="forgot-password-email">
                        <validation-provider #default="{ errors }" name="Email" rules="required|email">
                            <b-form-input id="forgot-password-email" v-model="userEmail" :state="errors.length > 0 ? false:null" name="forgot-password-email" placeholder="john@example.com" />
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </b-form-group>

                    <!-- submit button -->
                    <b-button variant="primary" block type="submit">
                        Send reset link
                    </b-button>
                </b-form>
            </validation-observer>
            <b-alert :show="true" variant="success" class="mb-0" v-else>
                <div class="alert-body">
                    <feather-icon icon="InfoIcon" class="mr-50" />
                    <p>click the link in your email to reset your password. if you can`t find the email check the spam folder </p>

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
            error_message:'',
            mail_errors: false,
            userEmail: '',
            password: '',
            Username: '',
            status: '',
            // validation rules
            myerrors: '',
            myloader: '',
            sent_again: false,
            countDown: 60,
            mail_sent: false,
            
        }
    },
    computed: {
        passwordToggleIcon() {
            return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
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
        countDownTimer() {
            if (this.countDown > 0) {
                setTimeout(() => {
                    this.countDown -= 1
                    this.countDownTimer()
                }, 1000)
            } else {
                this.sent_again = false;
                this.countDown = 60;
            }
        },
        openLoading(type, ref) {
            this.myloader = this.$vs.loading({
                target: this.$refs.reset,
                type,
            })
        },
        closeLoading() {
            this.myloader.close()
        },

        async SendPassword() {
            this.mail_errors = false;
            this.openLoading();
            var here = this;
            await this.$refs.simpleRules.validate().then(success => {
                if (success) {
                    var email = this.userEmail;
                     axios.post('password/email', {email:email}).then((response) => {
                        console.log(response)
                        here.mail_sent = true;
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
