<!-- Ой как тут, пойдем лучше я тебе тестовое покажу. оно дальше по коридору -->
<template>
  <div class="home">
    <v-layout justify-center class="mt-4">
      <v-flex xs4>
        <div class="home mb-2">
          {{ helloMyLove }}
        </div>
        <video width="100%" height="70%" controls="controls" poster="video/duel.jpg">
          <source src="@/assets/енот2.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
        </video>
        <v-layout align-center justify-center>
          <v-flex xs2 >
            <div class="home">
              {{ gotoApp }}
            </div>
          </v-flex>
          <v-flex xs3>
            <v-btn color="green darken-2" class="white--text" @click="go">Погнали</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      helloMyLove: `Здравия желаю! 
        Я солдат Евгений Рипачев. 
        Хочу на фронт! Родину защищать`,
      gotoApp: "Кликай и"
    };
  },
  methods: {
    go() {
      this.$router.push({ name: "dragyList", params: { id: "1" } });
    }
  }
};
</script>

<style scoped>
</style>
