`
<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ $store.state.user.application.name }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <el-dropdown @command="onExecuteNavigation">
          <div class="el-dropdown-link">
            <img v-if="logo" :src="logo" class="sidebar-logo">
            <h1 class="sidebar-title">{{ $store.state.user.application.name }} </h1>
          </div>
          <el-dropdown-menu slot="dropdown" class="app-menu">
            <el-dropdown-item
              v-for="navigation in applist.navigations"
              :key="navigation.id"
              class="app-menu-item"
              :command="navigation"
            >
              {{ navigation.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </router-link>
    </transition>
  </div>
</template>

<script>
import Logo from '@/assets/images/logo.png';
import { NavigationService } from '@/modules/navigation/services/navigation.service';
import store from '@/store';

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Zion',
      logo: Logo,
      applist: NavigationService.getInstance('applist'),
      store: store
    };
  },
  mounted() {
    this.applist.getNavigations();
  },
  created() {
    this.$store.dispatch('GetInfo');
  },
  methods: {
    onExecuteNavigation(navigation) {
      this.applist.executeNavigation(navigation.meta);
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 6px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
