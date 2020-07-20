<template>
    <div class="good_list_container">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/orders' }">订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <!-- 搜索框组件 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入订单编号进行查询"  :clearable="true" v-model="queryInfo.query" @clear="getGoodsInfo">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsInfo"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表格组件 -->
            <el-table :data="orderInfo" style="width: 100%" :border="true" :stripe="true">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格（元）"></el-table-column>
                <el-table-column label="是否付款">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.pay_status === 1" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="addressDialogVisible = true"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location-outline" @click="showExpresInfo"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalpage">
            </el-pagination>
        </el-card>
        <!-- 修改地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="30%" @close="clrAddressDialog">
            <!-- 表单内容区域 -->
            <el-form :model="addressForm" :rules="addressFromRules" ref="addressFormRef" label-width="100px">
                <!-- 级联选择器 -->
                <el-form-item label="省市区(县)">
                    <el-cascader v-model="addressForm.address1" :options="cityInfo" clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                  <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressDialogVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 物流信息对话框 -->
         <el-dialog title="物流信息" :visible.sync="expressDialogVisible" width="50%">
            <el-timeline>
                <el-timeline-item v-for="(item, index) in expressInfo" :key="index" :timestamp="item.time">
                    {{item.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>
<script>
    import cityData from './citydata.js'
    export default {
         data () {
            return {
                // 页面参数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                //  接收用户数据数组
                orderInfo: [],
                // 接收总页数数组
                totalpage: 0,
                // 所有角色列表
                roleList: [],
                // 当前的用户信息
                currentUser: '',
                // 当前选中的ID
                selectedRoleId: '',
                // 修改地址对话框状态
                addressDialogVisible: false,
                //  级联选择器城市信息
                cityInfo: cityData,
                // 地址表单信息
                addressForm: {
                    address1: [],
                    address2: ''
                },
                // 地址表单验证规则
                addressFromRules: {
                    address2: [
                            { required: true, message: '请输入详细地址', trigger: 'blur' },
                            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
                        ]
                },
                // 储存物流信息数组
                expressInfo: [],
                // 物流对话框状态
                expressDialogVisible: false
            }
        },
        created () {
            this.getGoodsInfo()
        },
        methods: {
            // 获取用户信息函数
            async getGoodsInfo () {
                const { data: result } = await this.$http.get('orders', {
                    params: this.queryInfo
                })
                if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
                this.orderInfo = result.data.goods
                this.totalpage = result.data.total
            },
            // 分页数量函数
            handleSizeChange (val) {
                this.queryInfo.pagesize = val
                this.getGoodsInfo()
            },
            // 页面切换函数
            handleCurrentChange (val) {
                this.queryInfo.pagenum = val
                this.getGoodsInfo()
            },
            // 获取物流信息函数
            async getExpressInfo () {
                const { data: result } = await this.$http.get('/kuaidi/1106975712662')
                if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
                this.expressInfo = result.data
            },
            // 物流信息对话框展示函数
            showExpresInfo () {
                this.getExpressInfo()
                this.expressDialogVisible = true
            },
            // 清空地址对话框函数
            clrAddressDialog () {
                this.addressForm.address1 = []
                this.addressForm.address2 = ''
            }
        }
    }
</script>
