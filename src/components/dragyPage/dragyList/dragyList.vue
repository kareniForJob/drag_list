<template>
  <v-container class="dragy-list pa-0">
    <v-layout row wrap>
      <v-flex
        xs12
        v-for="(dragy, index) in dragies"
        v-if="
          index >= (currentPage - 1) * numberItems &&
          index <= currentPage * numberItems - numberDrag
        "
        :key="index">
        <div class="dragndrop-container">
          <drop 
            class="drop list" 
            @drop="handleDrop(dragy, ...arguments)"
            @dragenter="onDragEnter(index, dragy, ...arguments)"
          >
            <drag
              :id="`drag-${index}`"
              class="drag"
              @dragstart="onDragStart(index, ...arguments)"
              @dragend="onDragEnd(index, ...arguments)"
              :transfer-data="{ dragy: dragy }">
              <dragy-item
                :dragy="dragy"
                :reset-selected="resetSelected"
                @deleteDragy="onDeleteDragy"
                @editDragy="onEditDragy"
                @addSelectedDragy="onAddSelectedDragy">
              </dragy-item>
            </drag>
          </drop>
        </div>
      </v-flex>
      <v-flex xs12>
        <drop 
          class="drop list last-drop" 
          @drop="handleDropToEnd(...arguments)"
          @dragenter="onDragEnter(isLastPage 
          ? dragies.length
          : currentPage * numberItems
          , null, ...arguments)"
        >
        </drop>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DragyItem from "./dragyItem";
import { mapGetters } from "vuex";

export default {
  name: "dragyList",

  data() {
    return {
      resetSelected: false,
      indexOverEl: -1,
      dragIndex: -1,
      dragDragy: {},
      currentHeight: "92px",
      PADDING_TOP: "8px",
      numberDrag: 0
    };
  },

  props: [
    "currentPage",
    "numberItems",
    "selectedDragies",
    "dragies",
    "isLastPage"
  ],

  watch: {
    selectedDragies: function(dragies) {
      if (dragies.length === 0) {
        this.resetSelected = true;
      }
    },
    isLastPage: function(dragies) {
      this.indexOverEl = -1;
    }
  },

  mounted() {
    this.PADDING_TOP = getComputedStyle(this.$children[0].$el).paddingTop;
  },

  methods: {
    onDeleteDragy: function(dragy) {
      this.$emit("deleteDragy", dragy);
    },
    onEditDragy: function(dragy) {
      this.$emit("editDragy", dragy);
    },
    onAddSelectedDragy: function(dragy, isSelected) {
      this.resetSelected = false;
      this.$emit("addSelectedDragy", dragy, isSelected);
    },
    handleDrop(dragy, data) {
      let toDragy = dragy;
      if (toDragy.qnt === this.dragDragy.qnt + 1) return;
      // если дропнули сверху вниз, то передавать компанию на 1 выше.
      if (toDragy.qnt > this.dragDragy.qnt) {
        toDragy = this.dragies[
          (this.currentPage - 1) * this.numberItems + this.indexOverEl - 1
        ];
      }
      const fromDragy = this.dragDragy;
      this.$store.dispatch({
        type: "swapDragies",
        fromDragy: fromDragy,
        toDragy: toDragy
      });
      this.dragIndex = -1;
    },
    handleDropToEnd(data) {
      if (!this.isLastPage) {
        this.handleDrop(
          this.dragies[this.currentPage * this.numberItems],
          data
        );
      } else {
        this.handleDrop(this.dragies[this.dragies.length - 1], data);
      }
    },
    onDragEnter(index, dragy, data) {
      if (index === this.indexOverEl) return;
      if (~this.indexOverEl) {
        this.$children[
          this.indexOverEl
        ].$el.style.paddingTop = this.PADDING_TOP;
      }
      this.indexOverEl = index - (this.currentPage - 1) * this.numberItems;
      this.$children[
        this.indexOverEl
      ].$el.style.paddingTop = this.currentHeight;
    },
    onDragStart(index, data) {
      this.$emit("dragStart");
      this.numberDrag = 1;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("dragIndex", index);
      this.dragIndex = index - (this.currentPage - 1) * this.numberItems;
      this.dragDragy = Object.assign({}, data.dragy);
      this.currentHeight = getComputedStyle(
        this.$children[this.dragIndex].$el
      ).height;
      this.$store.dispatch({
        type: "clearDragDragy",
        dragy: this.dragDragy
      });
    },
    onDragEnd(index, data) {
      if (~this.dragIndex) {
        this.$store.dispatch({
          type: "recoverDragDragy",
          dragy: this.dragDragy
        });
        this.dragIndex = -1;
      }
      this.$children[this.indexOverEl].$el.style.paddingTop = this.PADDING_TOP;
      this.numberDrag = 0;
    }
  },
  components: {
    "dragy-item": DragyItem
  }
};
</script>

<style scoped>
.dragy-list {
  width: 50%;
}
.drager {
  padding: 10px;
  background-color: #fe235498;
}
.drop {
  padding-top: 8px;
}
.last-drop {
  height: 42px;
}
</style>
