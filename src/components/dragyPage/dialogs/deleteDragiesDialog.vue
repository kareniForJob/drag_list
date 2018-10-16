<template>
  <v-card>
    <v-card-title>
      <v-layout justify-center align-center>
        Удалить компании?
        <v-icon color="red darken-4" class="pl-1">delete_outline</v-icon>
        <span>({{ dragies.length }})</span>
      </v-layout>
    </v-card-title>
    <v-card-actions>
      <v-layout
        row
        wrap>
        <v-flex xs6>
          <v-btn
            block
            color="green darken-4"
            flat="flat"
            @click="close">
            Нет
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn
            block
            color="red darken-4"
            flat="flat"
            @click="deleteDragy">
            Да
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["dragies"],
  methods: {
    close: function() {
      this.$emit("closeDialog");
    },
    deleteDragy: function() {
      this.$emit("deleteDragies", this.dragies);
    }
  }
};
</script>

<style scoped>
</style>
