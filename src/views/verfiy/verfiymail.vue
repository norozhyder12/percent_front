<template>
</template><template>
    <div class="register-step text-center">
        <h1 class="mb-6"> We`ve sent a verification email to {{email}}
        </h1>
        <p>click the link in your email to verify your account. if you can`t find the email check the spam folder or <span variant="primary" style="cursor:pointer;font-weight:bold" v-if="!sent_again" class="primary--text" @click="resendEmail()">click here to Resend</span> <span style="font-weight:bold" v-if="sent_again" variant="primary" class="primary--text">Wait {{countDown}} sec to Resend.</span></p>
        <b-row class="text-center">

            <b-col cols="12" md="12">
                <div class="d-flex justify-content-center" style="padding:1rem;">
                    <p style="padding-right:5px">After Verifying your email</p>
                    <b-link to="/login"> Sign In</b-link>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    props: {
        email: String
    },
    data() {
        return {
            sent_again: false,
            countDown: 60,
        }
    },
    methods: {
        async resendEmail() {
            this.sent_again = true;
            this.countDownTimer();
            await this.$axios.post('/email/verify/resend').then((response) => {
                console.log(response)

            }).catch(function (error) {
                console.log(error.response)

            });
        },
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
        }

    },
    watch:{
        countDown(val){
            if(val == 0){
                this.sent_again = false;
                this.countDown = 60;
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.register-step {
    h1 {
        font-size: 1.5em;
        display: block;
    }

    .choose-box {
        margin: 4rem 0;
        margin-bottom: 2rem;
    }

    .radio-box {
        border-radius: 5px;
        border: 1px solid #d7d7d7;
        padding: 1rem;
        font-weight: 600;
        cursor: pointer;
        margin: 0 1rem;
        transition: 300ms ease-in-out;
        position: relative;

        i {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 18px;
        }

        &:hover {

         //   border-color: $primary_color;
            transition: 300ms ease-in-out;
        }
    }

    .active {
      //  border-color: $primary_color;

    }
}

.auth-btn {
    font-size: 18px;
    font-weight: 600;
    padding-top: 1rem;
    padding-bottom: 1rem;
    height: 55px !important;
}
</style>
