<template>
    <div class="good_list_container">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users' }">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <!-- 搜索框组件 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入商品名称进行查询"  :clearable="true" v-model="queryInfo.query" @clear="getGoodsInfo">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsInfo"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="goAddPage">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格组件 -->
            <el-table :data="userInfo" style="width: 100%" :border="true" :stripe="true">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
                <el-table-column prop="add_time" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGood (scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalpage">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
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
                userInfo: [],
                // 接收总页数数组
                totalpage: 0,
                // 所有角色列表
                roleList: [],
                // 当前的用户信息
                currentUser: '',
                // 当前选中的ID
                selectedRoleId: ''
            }
        },
        created () {
            this.getGoodsInfo()
        },
        methods: {
            // 获取用户信息函数
            async getGoodsInfo () {
                const { data: result } = await this.$http.get('goods', {
                    params: this.queryInfo
                })
                if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
                this.userInfo = result.data.goods
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
            // 跳转到添加页面
            goAddPage () {
                this.$router.push('/goods/add')
            },
            // 删除用户函数
            deleteGood (goodInfo) {
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const { data: result } = await this.$http.delete(`goods/${goodInfo.goods_id}`)
                    if (result.meta.status !== 200) {
                       return this.$message.error('删除失败，请重试删除')
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    // 重新加载页面
                    this.getGoodsInfo()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        }
    }
</script>
