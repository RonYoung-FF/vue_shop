<template>
    <div class="good_list_container">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/reports' }">数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 1000px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
    import echarts from 'echarts'
    import _ from 'lodash'
    export default {
         data () {
            return {
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }
            }
        },
        created () {
        },
        async mounted () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'))
            //  发起请求获得数据
            const { data: result } = await this.$http.get('reports/type/1')
            if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
            // 拼合对象
            const mixed = _.merge(result.data, this.options)
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(mixed)
            // 指定图表的配置项和数据
            // var option = {
            //     title: {
            //         text: 'ECharts 入门示例'
            //     },
            //     tooltip: {},
            //     legend: {
            //         data: ['销量']
            //     },
            //     xAxis: {
            //         data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            //     },
            //     yAxis: {},
            //     series: [{
            //         name: '销量',
            //         type: 'bar',
            //         data: [5, 20, 36, 10, 10, 20]
            //     }]
            // }
        },
        methods: {
        }
    }
</script>
