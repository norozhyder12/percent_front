<template>
<div>
    <b-row>
        <b-col>
            <statistic-card-horizontal icon="FileTextIcon" :statistic="myPayroll.employees.length" statistic-title="Employees" />
        </b-col>
        <b-col>
            <statistic-card-horizontal icon="FilePlusIcon" :statistic=" moneyFormat(myPayroll.employees.reduce(function (acc, obj) { return acc + obj.net; }, 0) )" statistic-title="Total Net" />
        </b-col>

    </b-row>
    <b-row>
        <b-col>
            <b-card :title="'Payroll Month  -- '+ myPayroll.month + ' ' + myPayroll.year + ' --'">
                <empList :myPayroll="myPayroll.employees" @refetch-employees="fetchPayroll"></empList>
            </b-card>
        </b-col>

    </b-row>
</div>
</template>

<script>
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'

import axios from '@axios'
import vSelect from 'vue-select'
import empList from './employees/list'
export default {
    components: {
        vSelect,
        empList,
        StatisticCardHorizontal
    },

    data() {
        return {
            type_name: '',
            type_dec: '',
            myloader: null,
            myPayroll: {}

        }
    },
    mounted() {
        this.fetchPayroll();
    },
    methods: {
        async fetchPayroll() {
            this.openLoading();
            await axios
                .get('/payroll/' + this.$route.params.id)
                .then(response => {
                    this.myPayroll = response.data.data;
                    this.myloader.close();
                    console.log(response.data.data)
                })
                .catch(error => {
                    this.myloader.close();
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
  moneyFormat(money) {
            var formatter = Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'SAR',

                // These options are needed to round to whole numbers if that's what you want.
                //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
            });
            return formatter.format(money); /* $2,500.00 */

        },
        openLoading() {
            this.myloader = this.$vs.loading({
                target: this.$refs.myform,

            })
        },
        openNotification(position = 'top-right', color, title, message) {
            const noti = this.$vs.notification({
                color,
                position,
                title,
                text: message,
            })
        },
    },

}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
