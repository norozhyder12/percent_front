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
                    Check you email inbox to Verify
                </div>
            </b-alert>
            <b-card-text class="text-center mt-2">

                     <p>click the link in your email to verify your account. if you can`t find the email check the spam folder or <span variant="primary" style="cursor:pointer;font-weight:bold" v-if="!sent_again" class="primary--text" @click="resendEmail()">click here to Resend</span> <span style="font-weight:bold" v-if="sent_again" variant="primary" class="primary--text">Wait {{countDown}} sec to Resend.</span></p>
        <b-row class="text-center">

            <b-col cols="12" md="12">
                <div class="d-flex justify-content-center" style="padding:1rem;">
                    <p style="padding-right:5px">After Verifying your email</p>
                    <b-link to="/login"> Sign In</b-link>
                </div>
            </b-col>
        </b-row>
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
      watch:{
        countDown(val){
            if(val == 0){
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
            }else{
                  this.sent_again = false;
                this.countDown = 60;
            }
        },
        openLoading(type, ref) {
            this.myloader = this.$vs.loading({
                target: this.$refs[ref][0],
                type,
            })
        },
        closeLoading() {
            this.myloader.close()
        },
        
        async resendEmail () {
           this.sent_again = true;
            this.countDownTimer();
            await axios.post('/email/verify/resend').then((response) => {
                console.log(response)

            }).catch(function (error) {
                console.log(error.response)

            });
        },

   

    },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
