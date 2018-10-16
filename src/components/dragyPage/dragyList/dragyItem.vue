<template>
  <v-container
    class="dragyItem"
    pa-0
    @click="select">
    <v-card
      color="light-green lighten-3">
      <v-card-title
        primary-title
        class="pa-3">
        <v-layout row wrap>
          <v-flex
            xs12
            class="mb-2">
            <div>{{ dragy.name }}</div>
          </v-flex>
          <v-flex xs3>
            <div>id: {{ dragy.id }}</div>
          </v-flex>
          <v-flex xs9>
            <div>Описание: {{ dragy.note }}</div>
          </v-flex>
        </v-layout>
      </v-card-title>
      <div class="btns">
        <v-btn
          fab
          small
          color="blue accent-1"
          class="white--text edit-btn mt-1 mr-0"
          @click="editItem(dragy)">
          <v-icon dark>edit</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          color="red lighten-1"
          class="white--text delete-btn mt-1"
          @click="deleteItem(dragy.id)">
          <v-icon dark>delete_outline</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "dragyItem",
  data() {
    return {
      isSelected: false
    };
  },
  props: ["dragy", "resetSelected"],

  watch: {
    resetSelected: function(value) {
      if (value) {
        this.isSelected = false;
        this.$el.children[0].classList.remove("selected-item");
      }
    }
  },

  methods: {
    deleteItem: function(id) {
      event.stopPropagation();
      if (this.isSelected) {
        this.select();
      }
      this.$emit("deleteDragy", this.dragy);
    },
    editItem: function(dragy) {
      event.stopPropagation();
      this.$emit("editDragy", dragy);
    },
    select: function(event) {
      if (this.isSelected) {
        this.isSelected = false;
        this.$el.children[0].classList.remove("selected-item");
        this.$emit("addSelectedDragy", this.dragy, false);
      } else {
        this.isSelected = true;
        this.$el.children[0].classList.add("selected-item");
        this.$emit("addSelectedDragy", this.dragy, true);
      }
    }
  }
};
</script>

<style scoped>
.selected-item {
  background-color: #9ccc65 !important;
}
.dragyItem {
  cursor: pointer;
}
.btns {
  position: absolute;
  top: 0;
  right: 0;
}
.delete-btn {
  box-shadow: 0 0 !important;
  min-width: 0;
  width: 30px;
  height: 30px;
}
.edit-btn {
  box-shadow: 0 0 !important;
  min-width: 0;
  width: 30px;
  height: 30px;
}
</style>
