<template>
  <div class='headerPlace'>
    <v-toolbar
      dense
      fixed
      color='green darken-2'
    > <v-toolbar-title
        class='white--text pointer mr-3'
        @click="goTo(mainPage)"
      > Logo
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn
          flat
          class='capitalize white--text'
          v-for="item in menuItems"
          :key="item.pathName"
          :ripple="false"
          :id="item.pathName"
          @click="goTo(item.pathName)"
        > {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainPage: "home",
      currentPathName: "",
      menuItems: [
        {
          pathName: "dragyList",
          title: "Список потоскать"
        }
      ]
    };
  },
  mounted() {
    this.currentPathName = this.$router.history.current.matched[0].name;
  },
  methods: {
    goTo: function(name) {
      this.currentPathName = name;
      if (name === "dragyList") {
        this.$router.push({ name: name, params: { id: "1" } });
      } else {
        this.$router.push({ name: name });
      }
    }
  }
};
</script>

<style scoped>
.headerPlace {
  height: 48px;
}
.capitalize {
  text-transform: inherit;
}
.pointer {
  cursor: pointer;
}
</style>
