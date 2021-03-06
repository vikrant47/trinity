<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="$store.state.settings.uniqueOpened"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        :mode="navPosition"
      >
        <navigation-item v-for="route in navigations" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import NavigationItem from './NavigationItem';
import variables from '@/assets/styles/variables.scss';
import { NavigationService } from '@/modules/navigation/services/navigation.service';

export default {
  name: 'Navigation',
  components: { NavigationItem, Logo },
  props: {
    position: {
      type: String,
      default: 'sidebar'
    }
  },
  data() {
    return {
      navigations: [],
      navPosition: this.position === 'sidebar' ? 'vertical' : 'horizontal'
    };
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.position === 'sidebar' && this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created() {
    NavigationService.getInstance(this.position).getNavigations(this.position).then(nav => {
      this.navigations = nav;
    });
  }
};
</script>
