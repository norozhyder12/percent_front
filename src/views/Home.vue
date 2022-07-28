<template>
<div>
    <b-row>

        <b-col @click="$router.push('/bills/list')" style="cursor:pointer">
            <statistic-card-horizontal   icon="FileTextIcon" :statistic="billscount" statistic-title="Bills" />
        </b-col>
        <b-col @click="$router.push('/bills/list')" style="cursor:pointer">
            <statistic-card-horizontal icon="FilePlusIcon" :statistic="invoicescount" statistic-title="Invoices" />
        </b-col>

    </b-row>
    <b-row class="pt-4 pb-4">
        <b-col md="4">
            <b-card class="home-btn" @click="$router.push('/upload-bill')">
                <feather-icon icon="UploadIcon" class="mr-50" />
                <span class="align-middle">Upload Bill</span>
            </b-card>
        </b-col>
        <b-col md="4" @click="$router.push('/upload-invoice')">
            <b-card class="home-btn">
                <feather-icon icon="FileTextIcon" class="mr-50" />
                <span class="align-middle">Upload Invoice</span>
            </b-card>
        </b-col>
        <b-col md="4" @click="$router.push('/payroll/list')">
            <b-card class="home-btn">
                <feather-icon icon="DollarSignIcon" class="mr-50" />
                <span class="align-middle">Payroll</span>
            </b-card>
        </b-col>

        <b-col md="4">
            <b-card class="home-btn" @click="$router.push('/petty-cash/top-up/list')">
                <feather-icon icon="ArrowUpIcon" class="mr-50" />
                <span class="align-middle">Top Up</span>
            </b-card>
        </b-col>
        <b-col md="4">
            <b-card class="home-btn"  @click="$router.push('/settlements/list')">
                <feather-icon icon="ArrowDownIcon" class="mr-50" />
                <span class="align-middle">Settlements</span>
            </b-card>
        </b-col>
          <b-col md="4">
            <b-card class="home-btn"  @click="$router.push('/petty-cash/transactions')">
                <feather-icon icon="FileTextIcon" class="mr-50" />
                <span class="align-middle">Transactions</span>
            </b-card>
        </b-col>

    </b-row>

</div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import axios from '@axios'

import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'
import {
    getUserData
} from '@/auth/utils'

import {
    BCard,
    BCardText,
    BLink
} from 'bootstrap-vue'

export default {
    components: {
        BCard,
        BCardText,
        BLink,
        StatisticCardHorizontal,
        VueApexCharts
    },
    data() {
        return {
            billscount:0,
            invoicescount:0,
            series: [{
                name: 'Sessions',
                data: [75, 125, 225, 175, 125, 75, 25],
            }, ],
            areaChartOptions: {
                grid: {
                    show: true,
                    padding: {
                        left: 0,
                        right: 0,
                    },
                },
                chart: {
                    toolbar: {
                        show: false,
                    },
                    sparkline: {
                        enabled: true,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'smooth',
                    width: 2.5,
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 0.9,
                        opacityFrom: 0.5,
                        opacityTo: 0.2,
                        stops: [0, 80, 100],
                    },
                },
                xaxis: {
                    type: 'numeric',
                    lines: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        show: false
                    },
                },
                yaxis: [{
                    y: 0,
                    offsetX: 0,
                    offsetY: 0,
                    padding: {
                        left: 0,
                        right: 0,
                    },
                }, ],
                tooltip: {
                    x: {
                        show: false
                    },
                },
                theme: {
                    monochrome: {
                        enabled: true,
                        color: "#00a4e5",
                        shadeTo: 'light',
                        shadeIntensity: 0.65,
                    },
                },
            }
        }
    },
    computed: {
        myuser() {
            return getUserData()
        },
    },
    methods: {
        fetchBillsCount() {
            axios.get('bills/total-count')
                .then(response => {
                    console.log(response)
                    this.billscount = response.data.data;

                })
                .catch(error => {
                    this.myerrors = error.response.data.message
                    this.closeLoading()
                })
        },
            fetchInvoicesCount() {
            axios.get('invoices/total-count')
                .then(response => {
                    console.log(response)
                    this.invoicescount = response.data.data;

                })
                .catch(error => {
                    this.myerrors = error.response.data.message
                    this.closeLoading()
                })
        }
    },
    mounted() {

       
         this.fetchBillsCount();
         this.fetchInvoicesCount();

    },
}
</script>

<style lang="scss">
.home-btn {
    font-size: 2rem;
    height: 150px;
    min-width: 300px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;

    .card-body {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        height: 30px;
        width: 30px;
        stroke: #00a4e5
    }
}
</style>
