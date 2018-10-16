<template>
  <v-card>
    <v-card-title
      @click="hideSelectList">
      <v-layout justify-center>
        <v-flex xs12>
          <v-form v-model="valid">
            <v-text-field
              v-model="newDragy.name"
              :rules="nameRules"
              label="Название"
              required
            ></v-text-field>
            <v-text-field
              v-model="newDragy.note"
              :rules="fioRules"
              label="Описание"
              required
            ></v-text-field>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-card-actions
      @click="hideSelectList">
      <v-layout>
        <v-flex xs6>
          <v-btn
            block
            color="red darken-4"
            flat="flat"
            @click="close">
            Отмена
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn
            block
            color="green darken-4"
            flat="flat"
            @click="createDragy">
            Готово
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      dragies: [],
      isServerTimeOut: false,
      isOpenSelectList: false,
      currentNameNum: 0,
      newDragy: {
        name: "",
        note: ""
      },
      valid: false,
      nameRules: [v => !!v || "Заполните название"],
      fioRules: [v => !!v || "Запоните описание"]
    };
  },

  props: ["dragy"],

  watch: {
    dragy: function(dragy) {
      if (dragy.id) {
        this.newDragy.id = dragy.id;
        this.newDragy.name = dragy.name;
        this.newDragy.note = dragy.note;
      } else {
        this.newDragy = {
          id: "",
          name: "",
          note: ""
        };
      }
    }
  },

  methods: {
    close: function() {
      this.$emit("closeDialog");
    },
    createDragy: function() {
      if (!this.valid) return;
      this.newDragy.id = this.newDragy.id.trim();
      this.newDragy.name = this.newDragy.name.trim();
      this.newDragy.note = this.newDragy.note.trim();
      if (!this.dragy.id) {
        this.$emit("createDragy", this.newDragy);
      } else {
        this.$emit("editDragy", this.newDragy, this.dragy.id);
      }
    },
    validationid: function(event) {
      if (isNaN(+event.key) && event.key.length === 1) {
        event.preventDefault();
      }
      if (this.newDragy.id.length >= 12 && event.key.length === 1) {
        event.preventDefault();
      }
    },
    selectItem: function(item, i) {
      this.currentNameNum = i;
      this.newDragy.name = this.dragies[i].name;
      this.newDragy.id = this.dragies[i].id;
      this.newDragy.note = this.dragies[i].note;
      this.hideSelectList();
    },
    openSelectList: function(event) {
      if (this.newDragy.name.length < 2) return;
      if (this.isServerTimeOut) return;

      setTimeout(() => {
        this.isServerTimeOut = false;
        if (!this.isOpenSelectList) this.openSelectList();
      }, 500);
      this.isServerTimeOut = true;

      let entityMap = {
        "&": "38 ",
        "<": "60 ",
        ">": "62 ",
        '"': "34 ",
        "'": "39 ",
        "/": "47 ",
        "`": "96 ",
        "=": "61 "
      };

      function escapeHtml(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function(s) {
          return entityMap[s];
        });
      }
    },
    hideSelectList: function(event) {
      this.isOpenSelectList = false;
    },
    stopEvent: function(event) {
      event.stopPropagation();
    }
  }
};
</script>

<style scoped>
.select-list {
  position: absolute;
  top: 66px;
  background-color: white;
  min-width: 90%;
  z-index: 20;
}
</style>
