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
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
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
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="getUser (scope.row)"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser (scope.row)"></el-button>
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
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="resetAddUserForm">
            <!-- 表单内容区域 -->
            <el-form :model="addUserForm" :rules="addFromRules" ref="addUserFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username" required>
                  <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" required>
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" required>
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile" required>
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 用户编辑对话框 -->
         <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="30%">
            <!-- 表单内容区域 -->
            <el-form :model="editUserForm" :rules="editFromRules" ref="editUserFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" required>
                    <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile" required>
                    <el-input v-model="editUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
         data () {
            var validateEmail = (rule, value, callback) => {
                var mailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                if (value === '') {
                    return callback(new Error('请输入邮箱'))
                } else if (!mailReg.test(value)) {
                    return callback(new Error('您输入的邮箱有误'))
                } else {
                    callback()
                }
            }
            var validateTel = (rule, value, callback) => {
                var telReg = /^[1][3,4,5,7,8][0-9]{9}$/
                if (value === '') {
                    return callback(new Error('请输入电话号码'))
                } else if (!telReg.test(value)) {
                    return callback(new Error('您输入的号码有误'))
                } else {
                    callback()
                }
            }
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
                //  添加用户对话框状态
                addDialogVisible: false,
                // 编辑用户
                editDialogVisible: false,
                // 添加用户表单数据
                addUserForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 添加用户表单验证规则
                addFromRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { validator: validateTel, trigger: 'blur' }
                    ]
                },
                // 编辑用户表单数据
                editUserForm: {
                    id: '',
                    username: '',
                    email: '',
                    mobile: ''
                },
                // 编辑用户表单验证规则
                editFromRules: {
                    email: [
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { validator: validateTel, trigger: 'blur' }
                    ]
                }
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
            // 更新用户状态函数
            async userStateChange (userInfo) {
               const { data } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (data.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error(data.meta.msg)
                }
                this.$message.success('用户状态更新成功')
            },
            // 添加用户相关
            resetAddUserForm () {
                this.$refs.addUserFormRef.resetFields()
            },
            addUser () {
                this.$refs.addUserFormRef.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查输入是否有误')
                    }
                    const { data: result } = await this.$http.post('users', this.addUserForm)
                    console.log(result)
                    if (result.meta.status !== 201) {
                       return this.$message.error('添加失败，请重试添加')
                    }
                    this.$message.success('添加用户成功')
                    // 关闭对话框
                    this.addDialogVisible = false
                    // 重新加载页面
                    this.getUserInfo()
                })
            },
            async getUser (userInfo) {
                const { data: result } = await this.$http.get(`users/${userInfo.id}`)
                if (result.meta.status !== 200) {
                    return this.$message.error(result.meta.msg)
                }
                this.editDialogVisible = true
                console.log(result)
                this.editUserForm.id = result.data.id
                this.editUserForm.username = result.data.username
                this.editUserForm.email = result.data.email
                this.editUserForm.mobile = result.data.mobile
            },
             // 更新用户数据函数
            editUser () {
                this.$refs.editUserFormRef.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查输入是否有误')
                    }
                    const { data: result } = await this.$http.put(`users/${this.editUserForm.id}`, {
                        id: this.editUserForm.id,
                        email: this.editUserForm.email,
                        mobile: this.editUserForm.mobile
                    })
                    console.log(result)
                    if (result.meta.status !== 200) {
                        return this.$message.error('编辑失败，请重试添加')
                    }
                    this.$message.success('编辑用户成功')
                    // 关闭对话框
                    this.editDialogVisible = false
                    // 重新加载页面
                    this.getUserInfo()
                })
            },
            // 删除用户函数
             deleteUser (userInfo) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const { data: result } = await this.$http.delete(`users/${userInfo.id}`, { id: userInfo.id })
                    if (result.meta.status !== 200) {
                       return this.$message.error('删除失败，请重试删除')
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    // 重新加载页面
                    this.getUserInfo()
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
