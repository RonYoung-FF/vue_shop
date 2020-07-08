<template>
    <div class="user-container">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <!-- 搜索框组件 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容"  :clearable="true" v-model="queryInfo.query" @clear="getUserInfo">
                        <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格组件 -->
            <el-table :data="userInfo" style="width: 100%" :border="true" :stripe="true">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="id" label="用户ID"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="用户状态">
                    <!-- 表格组件内部使用作用域插槽可以放置其他组件 -->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange (scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="dialogVisible = true"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalpage">
            </el-pagination>
        </el-card>
        <!-- 用户添加对话框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
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
                    pagesize: 1
                },
                //  接收用户数据数组
                userInfo: [],
                totalpage: 0,
                //  对话框状态
                dialogVisible: false
            }
        },
        created () {
            this.getUserInfo()
        },
        methods: {
            // 获取用户信息函数
            async getUserInfo () {
                const { data } = await this.$http.get('users', {
                    params: this.queryInfo
                })
                if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
                this.userInfo = data.data.users
                this.totalpage = data.data.total
            },
            // 分页数量函数
            handleSizeChange (val) {
                this.queryInfo.pagesize = val
                this.getUserInfo()
            },
            // 页面切换函数
            handleCurrentChange (val) {
                this.queryInfo.pagenum = val
                this.getUserInfo()
            },
            async userStateChange (userInfo) {
               const { data } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (data.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error(data.meta.msg)
                }
                this.$message.success('用户状态更新成功')
            }
        }
    }
</script>
