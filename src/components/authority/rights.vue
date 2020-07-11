<template>
    <div class="right-container">
         <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <!-- 表格组件 -->
            <el-table :data="rightList" border style="width: 100%" :stripe="true">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.level == 2">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            rightList: []
        }
    },
    created () {
            this.getRightInfo()
        },
    methods: {
        async getRightInfo () {
                const { data: result } = await this.$http.get('rights/list')
                if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
                this.rightList = result.data
            }
    }
}
</script>
