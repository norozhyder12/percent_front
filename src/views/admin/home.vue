<template>
<div>
    <b-row>
        <b-col md="4" @click="$router.push({name:'clients-admin-list'})" style="cursor: pointer;">
            <b-card no-body>
                <b-card-body class="pb-0">
                    <b-avatar class="mb-1" variant="success" size="45">
                        <feather-icon size="21" icon="UsersIcon" />
                    </b-avatar>
                    <div class="truncate">
                        <h2 class="mb-25 font-weight-bolder">
                            {{activeclients}}
                        </h2>
                        <span>Active Clients</span>
                    </div>
                </b-card-body>

                <vue-apex-charts type="area" height="100" width="100%" :options="areaChartOptions" :series="series" />

            </b-card>
        </b-col>
        <b-col md="4" @click="$router.push({name:'clients-admin-list'})"  style="cursor: pointer;">
            <b-card no-body>
                <b-card-body class="pb-0">
                    <b-avatar class="mb-1" variant="warning" size="45">
                        <feather-icon size="21" icon="UsersIcon" />
                    </b-avatar>
                    <div class="truncate">
                        <h2 class="mb-25 font-weight-bolder">
                            {{pendingclients}}
                        </h2>
                        <span>Pending Clients</span>
                    </div>
                </b-card-body>

                <vue-apex-charts type="area" height="100" width="100%" :options="areaChartOptions2" :series="series" />

            </b-card>
        </b-col>
     <b-col md="4" @click="$router.push({name:'clients-admin-list'})"  style="cursor: pointer;">
            <b-card no-body>
                <b-card-body class="pb-0">
                    <b-avatar class="mb-1" variant="secondary" size="45">
                        <feather-icon size="21" icon="UsersIcon" />
                    </b-avatar>
                    <div class="truncate">
                        <h2 class="mb-25 font-weight-bolder">
                            {{unactiveclients}}
                        </h2>
                        <span>UnActive Clients</span>
                    </div>
                </b-card-body>

                <vue-apex-charts type="area" height="100" width="100%" :options="areaChartOptions3" :series="series" />

            </b-card>
        </b-col>
        <b-col>
            <statistic-card-horizontal icon="FileTextIcon" :statistic="billscount" statistic-title="Bills" />
        </b-col>
        <b-col>
            <statistic-card-horizontal icon="FilePlusIcon" statistic="0" statistic-title="Invoices" />
        </b-col>
        <b-col>
            <statistic-card-horizontal icon="UsersIcon" :statistic="clientsCount" statistic-title="Total Clients" />
        </b-col>
    </b-row>
    <b-row class="pt-4 pb-4">
        <b-col md="12">
            <billsTable></billsTable>
        </b-col>

    </b-row>

</div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import axios from '@axios'
import billsTable from './bills/List.vue'

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
        billsTable,
        StatisticCardHorizontal,
        VueApexCharts
    },
    data() {
        return {
            billscount: 0,
            clientsCount: 0,
            series: [{
                name: 'count',
                data: [75, 125, 225, 175, 50, 75, 25],
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
                        color: "#28c76f",
                        shadeTo: 'light',
                        shadeIntensity: 0.65,
                    },
                },
            },
            areaChartOptions2: {
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
                        color: "#ff9f43",
                        shadeTo: 'light',
                        shadeIntensity: 0.65,
                    },
                },
                
            },
              areaChartOptions3: {
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
                        color: "#82868b",
                        shadeTo: 'light',
                        shadeIntensity: 0.65,
                    },
                },
                
            },
            activeclients:0,
            pendingclients:0,
            unactiveclients:0,
        }
    },
    computed: {
        myuser() {
            return getUserData()
        },
    },
    mounted() {
        this.fetchclientsCount();
        this.fetchActiveClients();
        this.fetchBillsCount();
        this.fetchUnactiveClients();
        this.fetchPendingClients();
    },
    methods: {
        fetchclientsCount() {
            axios.get('/count/clients')
                .then(response => {
                    console.log(response)
                    this.clientsCount = response.data.data;

                })
                .catch(error => {
                    this.myerrors = error.response.data.message
                    this.closeLoading()
                })
        },
        fetchActiveClients() {
            axios.get('/count/clientsStatus/1')
                .then(response => {
                    console.log(response)
                    this.activeclients = response.data.data;

                })
                .catch(error => {
                    this.myerrors = error.response.data.message
                    this.closeLoading()
                })
        },
        fetchPendingClients(){
              axios.get('/count/clientsStatus/3')
                .then(response => {
                    console.log(response)
                    this.pendingclients = response.data.data;

                })
                .catch(error => {
                    this.myerrors = error.response.data.message
                    this.closeLoading()
                })
        },
        fetchUnactiveClients(){
              axios.get('/count/clientsStatus/0')
                .then(response => {
                    console.log(response)
                    this.unactiveclients = response.data.data;

                })
                .catch(error => {
                    this.myerrors = error.response.data.message
                    this.closeLoading()
                })
        },
        fetchBillsCount() {
            axios.get('/count/bills')
                .then(response => {
                    console.log(response)
                    this.billscount = response.data.data;

                })
                .catch(error => {
                    this.myerrors = error.response.data.message
                    this.closeLoading()
                })
        }
    }
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
        stroke: #00a4e5;
       
    }
}
</style>
