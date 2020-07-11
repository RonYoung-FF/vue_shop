<template>
     <div class="role-container">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <!-- 搜索框组件 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入角色名进行查询"  :clearable="true">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary"  @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 表格组件 -->
            <el-table :data="roleList" style="width: 100%" :border="true" :stripe="true">
                <el-table-column type="expand">
                    <template  slot-scope="scope">
                        <el-row :gutter="20"  v-for="(item1,index) in scope.row.children" :key="index" :class="[index === 0 ? 'topBorder' : '','bottomBorder']">
                            <!-- 一级权限列表 -->
                            <el-col :span="5">
                                <el-tag closable @close="deleteRoleRight(scope.row, item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                            </el-col>
                            <!-- 二三级权限列表 -->
                            <el-col :span="19">
                                <el-row :gutter="20"  v-for="(item2,index) in item1.children" :key="index" :class="[index === 0 ? '' : 'topBorder']">
                                    <!-- 二级权限列表 -->
                                    <el-col :span="5">
                                        <el-tag type="success" closable @close="deleteRoleRight(scope.row, item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                    </el-col>
                                    <!-- 三级权限列表 -->
                                    <el-col :span="14">
                                        <el-tag type="warning" closable v-for="(item3,index) in item2.children" :key="index" @close="deleteRoleRight(scope.row, item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="getRole (scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole (scope.row)">删除</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting"  @click="getRightList (scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
        </el-card>
        <!-- 角色添加对话框 -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" @close="resetAddRoleForm">
            <!-- 表单内容区域 -->
            <el-form :model="addRoleForm" :rules="addFromRules" ref="addRoleFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 角色编辑对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="30%">
            <!-- 表单内容区域 -->
            <el-form :model="editRoleForm" :rules="addFromRules" ref="editRoleFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
        <!--  分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="deployDialogVisible" width="30%"  @close="defChecked = []">
            <el-tree  ref="tree" :data="rightList" :props="deploySpecification" show-checkbox default-expand-all node-key="id" :default-checked-keys="defChecked"></el-tree>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="deployDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="less" scoped>
    .topBorder{
        border-top: 1px solid rgb(226, 226, 226);
    }
    .bottomBorder{
        border-bottom: 1px solid rgb(228, 228, 228);
    }
    .el-row{
        display: flex;
        align-items: center;
    }
</style>
<script>
export default {
    data () {
        return {
            // 角色列表数据
            roleList: [],
            // 添加角色表单数据
            addRoleForm: {
                roleName: '',
                roleDesc: ''
            },
            // 添加角色表单状态
            addDialogVisible: false,
            // 添加与编辑角色表单验证规则
            addFromRules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ]
            },
             // 编辑角色表单数据
            editRoleForm: {
                roleId: '',
                roleName: '',
                roleDesc: ''
            },
             // 编辑角色表单状态
            editDialogVisible: false,
            // 所有权限列表数据
            rightList: [],
            // 分配角色选项卡状态
            deployDialogVisible: false,
            // 分配角色配置项
            deploySpecification: {
                children: 'children',
                label: 'authName'
            },
            // 分配角色默认选中项
            defChecked: [],
            // 暂存当前选定的角色ID
            currentID: ''
        }
    },
    created () {
            this.getRightInfo()
        },
    methods: {
        async getRightInfo () {
                const { data: result } = await this.$http.get('roles')
                if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
                this.roleList = result.data
                console.log(this.roleList)
            },
        // 重置添加角色表单数据
        resetAddRoleForm () {
            this.$refs.addRoleFormRef.resetFields()
        },
        // 添加角色函数
        addRole () {
                this.$refs.addRoleFormRef.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查输入是否有误')
                    }
                    const { data: result } = await this.$http.post('roles', this.addRoleForm)
                    console.log(result)
                    if (result.meta.status !== 201) {
                       return this.$message.error('添加失败，请重试添加')
                    }
                    this.$message.success('添加用户成功')
                    // 关闭对话框
                    this.addDialogVisible = false
                    // 重新加载页面
                    this.getRightInfo()
                })
            },
        // 编辑角色函数
        async getRole (userInfo) {
                const { data: result } = await this.$http.get(`roles/${userInfo.id}`)
                if (result.meta.status !== 200) {
                    return this.$message.error(result.meta.msg)
                }
                this.editDialogVisible = true
                this.editRoleForm.roleId = result.data.roleId
                this.editRoleForm.roleName = result.data.roleName
                this.editRoleForm.roleDesc = result.data.roleDesc
            },
        // 更新用户数据函数
        editRole () {
            this.$refs.editRoleFormRef.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error('请检查输入是否有误')
                }
                const { data: result } = await this.$http.put(`roles/${this.editRoleForm.roleId}`, {
                    roleName: this.editRoleForm.roleName,
                    roleDesc: this.editRoleForm.roleDesc
                })
                console.log(result)
                if (result.meta.status !== 200) {
                    return this.$message.error('编辑失败，请重试添加')
                }
                this.$message.success('编辑用户成功')
                // 关闭对话框
                this.editDialogVisible = false
                // 重新加载页面
                this.getRightInfo()
            })
        },
         // 删除用户函数
        deleteRole (userInfo) {
           this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
           }).then(async () => {
               const { data: result } = await this.$http.delete(`roles/${userInfo.id}`)
               if (result.meta.status !== 200) {
                  return this.$message.error('删除失败，请重试删除')
               }
               this.$message({
                   type: 'success',
                   message: '删除成功!'
               })
               // 重新加载页面
               this.getRightInfo()
           }).catch(() => {
               this.$message({
                   type: 'info',
                   message: '已取消删除'
               })
           })
        },
        // 删除指定用户权限函数
        deleteRoleRight (rightInfo, right) {
           this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
           }).then(async () => {
               const { data: result } = await this.$http.delete(`roles/${rightInfo.id}/rights/${right}`)
               if (result.meta.status !== 200) {
                  return this.$message.error('删除失败，请重试删除')
               }
               this.$message({
                   type: 'success',
                   message: '删除成功!'
               })
               // 重新加载页面
               rightInfo.children = result.data
           }).catch(() => {
               this.$message({
                   type: 'info',
                   message: '已取消删除'
               })
           })
        },
        // 获取所有权限列表函数
        async getRightList (rightInfo) {
                this.currentID = rightInfo.id
                const { data: result } = await this.$http.get('rights/tree')
                if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
                this.rightList = result.data
                this.getLastChildrenId(rightInfo, this.defChecked)
                this.deployDialogVisible = true
        },
        // 递归获取第末级节点ID
        getLastChildrenId (node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLastChildrenId(item, arr)
            })
        },
        // 提交已选定权限函数
        async submitRights () {
            const arr = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
            console.log(arr)
            const { data: result } = await this.$http.post(`roles/${this.currentID}/rights`, { rids: arr.join(',') })
            if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
            this.$message.success('角色权限提交成功')
            this.getRightInfo()
            this.deployDialogVisible = false
        }
    }
}
</script>
