<template>
  <v-container
    fluid
    class="navigation pa-0 mb-2">
    <v-layout
      row
      wrap>
      <v-btn
        block
        color='blue accent-1'
        class="key-btn left-btn white--text my-0 mx-2"
        :ripple="false"
        @mousedown="prevPage">
        <v-icon>arrow_left</v-icon>
      </v-btn>
      <v-text-field
        solo
        class="input-page"
        :suffix="'/ ' + numberPages"
        v-model="pageNum"
        @keyup.13="goToPage(pageNumber)"
        @keydown="validationPageNumber"
        @blur="setPageOnBlur"
      ></v-text-field>
      <v-btn
        block
        color='blue accent-1'
        class="key-btn right-btn white--text my-0 mx-2"
        :ripple="false"
        @mousedown="nextPage">
        <v-icon>arrow_right</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "navigation",

  data() {
    return {
      pageNum: 1,
      prevPageNum: 1
    };
  },

  props: ["numberPages", "currentPage"],

  watch: {
    currentPage: function(value) {
      if (this.pageNum !== value) {
        this.pageNum = value;
        this.prevPageNum = value;
      }
    }
  },

  mounted() {
    this.getStyles();
    this.pageNum = this.currentPage;
    this.$children[1].$el.addEventListener("wheel", this.onScrollOverInput);
  },

  created() {
    window.addEventListener("keyup", this.onLeftRightUp);
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.onLeftRightUp);
    this.$children[1].$el.removeEventListener("wheel", this.onScrollOverInput);
  },

  computed: {
    pageNumber: {
      get: function() {
        return this.pageNum;
      },
      set: function(newValue) {
        this.prevPageNum = this.pageNum || 1;
        newValue = ("" + newValue).replace(/^0+/, "");
        switch (true) {
          case isNaN(newValue):
            this.pageNum = 1;
            break;
          case +newValue < 1 && newValue !== "":
            this.pageNum = 1;
            break;
          case +newValue > this.numberPages && newValue !== "":
            this.pageNum = this.numberPages;
            break;
          default:
            this.pageNum = +newValue || "";
        }
      }
    }
  },
  methods: {
    getStyles: function() {
      // оп ничессе, круто! но лучше на это не смотреть - нет времени обьяснять)
      let inputPageEl = this.$children[1].$el;
      inputPageEl.children[0].children[0].style.width = "104px";
      inputPageEl.children[0].children[0].children[0].children[0].style.textAlign =
        "center";
    },
    nextPage: function() {
      if (this.pageNumber < this.numberPages) {
        this.$emit("nextPage");
      }
    },
    prevPage: function() {
      if (this.pageNumber > 1) {
        this.$emit("prevPage");
      }
    },
    goToPage: function(page) {
      this.$emit("goToPage", { num: page });
    },
    validationPageNumber: function(event) {
      let isBackspace = event.key === "Backspace";
      switch (true) {
        case isBackspace:
          break;
        case isNaN(+event.key):
          event.preventDefault();
          break;
        case +("" + this.pageNum + event.key) < 1:
          this.pageNum = 1;
          event.preventDefault();
          break;
        case this.pageNum === this.numberPages && +event.key < this.numberPages:
          this.pageNum = +event.key;
          event.preventDefault();
          break;
        case +("" + this.pageNum + event.key) >= this.numberPages:
          this.pageNum = this.numberPages;
          event.preventDefault();
          break;
        default:
          this.pageNum = +event.key;
      }
      this.goToPage(this.pageNum);
    },
    setPageOnBlur() {
      this.pageNum = this.pageNumber == "" ? this.prevPageNum : this.pageNumber;
      this.goToPage(this.pageNum);
    },
    onLeftRightUp(event) {
      switch (true) {
        case event.keyCode === 39:
          this.nextPage();
          break;
        case event.keyCode === 37:
          this.prevPage();
          break;
      }
    },
    onScrollOverInput(event) {
      event.preventDefault();
      switch (true) {
        case event.wheelDeltaY > 0:
          this.nextPage();
          break;
        case event.wheelDeltaY < 0:
          this.prevPage();
          break;
      }
    }
  }
};
</script>

<style scoped>
.navigation {
  width: 312px;
  bottom: 0;
  position: fixed;
  z-index: 10;
}
.key-btn {
  height: 48px;
}
.input-page {
  flex: 0;
  font-size: 24px;
  height: 48px;
  width: 104px;
}
</style>
