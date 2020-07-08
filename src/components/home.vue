<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/homelogo.png" alt="">
                <h1>后台管理系统</h1>
            </div>
            <el-button type="info" @click='logout'>退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px' ">
                 <div @click='toggleAside' class="toggle-btn">|||</div>
                 <el-menu :default-active="currentMenu" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff"
                active-text-color="#409FFF" unique-opened :collapse="isCollapse" :collapse-transition="false"
                :router="true">
                <!-- 一级菜单 -->
                    <el-submenu :index='item.id + ""' :key='item.id' v-for='item in menulist'>
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index='"/" + sitem.path' :key='sitem.id' v-for='sitem in item.children' @click="addCurrent('/' + sitem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{sitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
     data () {
            return {
                menulist: [],
                iconsObj: {
                    125: 'el-icon-user-solid',
                    103: 'el-icon-s-cooperation',
                    101: 'el-icon-s-goods',
                    102: 'el-icon-s-order',
                    145: 'el-icon-s-marketing'
                },
                isCollapse: false,
                currentMenu: ''
            }
    },
    created () {
        this.getMenuList()
        this.currentMenu = window.sessionStorage.getItem('currentPath')
    },
    methods: {
        logout () {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        addCurrent (path) {
        window.sessionStorage.setItem('currentPath', path)
        this.currentMenu = path
        },
        async getMenuList () {
            const { data } = await this.$http.get('menus')
            if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
            this.menulist = data.data
        },
        toggleAside () {
            this.isCollapse = !this.isCollapse
        }
    }
}
</script>
<style lang="less" scoped>
.home-container{
    height:100vh;
    .el-header{
        display: flex;
        justify-content: space-between;
        background: #373D41;
        align-items: center;
        color: white;
        font-size: 20px;
        div{
            display: flex;
            align-items: inherit;
            height: inherit;
            h1{
            font-weight: 100;
            display: inline-block;
            margin: 0;
            }
            img{
            height:inherit;
            }
        }
    }
    .el-aside{
        background: #333744;
        .el-menu{
            border-right:0;
        }
        .toggle-btn{
            background:#4A5064;
            color: #fff;
            font-size: 10px;
            line-height: 24px;
            text-align: center;
            letter-spacing: 0.2em;
            cursor: pointer;
        }
    }
    .el-main{
        background: rgb(238, 238, 238);
    }
}
</style>
