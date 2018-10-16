<template>
  <div class="dragyPage">
    <dragy-list
      class="dragy-list-margin"
      :dragies="dragies"
      :number-items="numberItems"
      :current-page="currentPage"
      :selected-dragies="selectedDragies"
      :is-last-page="numberPages==currentPage"
      @deleteDragy="showDeleteDragyDialog"
      @addSelectedDragy="addSelectedDragy"
      @editDragy="showCreateDragyDialog"
      @dragStart="resetSelectedDragies">
    </dragy-list>
    <v-layout justify-center>
        <navigation
          :number-pages="numberPages"
          :current-page="currentPage"
          @nextPage="nextPage"
          @prevPage="prevPage"
          @goToPage="goToPage">
        </navigation>
    </v-layout>
    <v-layout row justify-center>
      <v-layout row class="delete-btns">
        <v-flex xs9>
          <v-btn
            block
            large
            v-if="showDeleteSelectedBtn"
            color="red lighten-1"
            class="white--text"
            @click="showDeleteDragiesDialog">
            Удалить ({{selectedDragies.length}})
            <v-icon class="pl-1">delete_outline</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs3 class="ml-2">
          <v-btn
            block
            large
            v-if="showDeleteSelectedBtn"
            color="blue accent-1"
            class="white--text px-2 cancel-btn"
            @click="resetSelectedDragies">
            <v-icon class="pl-1">cancel</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-layout>
    <v-btn
      fab
      large
      color="blue accent-1"
      class="white--text create-btn"
      @click="showCreateDragyDialog">
      <v-icon dark>add</v-icon>
    </v-btn>
    <v-dialog v-model="isShowDeleteDragyDialog" max-width="350">
      <delete-dragy-dialog
        :dragy="dragyToDelete"
        @closeDialog="closeDeleteDragyDialog"
        @deleteDragy="deleteDragy">
      </delete-dragy-dialog>
    </v-dialog>
    <v-dialog v-model="isShowDeleteDragiesDialog" max-width="350">
      <delete-dragies-dialog
        :dragies="selectedDragies"
        @closeDialog="closeDeleteDragiesDialog"
        @deleteDragies="deleteDragies">
      </delete-dragies-dialog>
    </v-dialog>
    <v-dialog v-model="isShowCreateDragyDialog" max-width="350">
      <create-dragy-dialog
        :dragy="dragyToEdit"
        @closeDialog="closeCreateDragyDialog"
        @createDragy="createDragy"
        @editDragy="editDragy">
      </create-dragy-dialog>
    </v-dialog>
  </div>
</template>

<script>
import DragyList from "./dragyList/dragyList";
import Navigation from "./navigation/navigation";
import DeleteDragyDialog from "./dialogs/deleteDragyDialog";
import DeleteDragiesDialog from "./dialogs/deleteDragiesDialog";
import CreateDragyDialog from "./dialogs/createDragyDialog";
import { mapGetters } from "vuex";

export default {
  name: "dragyPage",
  data() {
    return {
      numberPages: 0,
      numberItems: 50,
      currentPage: 1,
      isShowDeleteDragyDialog: false,
      dragyToDelete: {},
      dragyToEdit: {},
      selectedDragies: [],
      showDeleteSelectedBtn: false,
      isShowDeleteDragiesDialog: false,
      isShowCreateDragyDialog: false
    };
  },

  watch: {
    numberPages: function(value) {
      this.currentPage = this.currentPage > value ? value : this.currentPage;
    },
    selectedDragies: function(dragies) {
      if (dragies.length === 0) this.showDeleteSelectedBtn = false;
      else this.showDeleteSelectedBtn = true;
    }
  },

  beforeMount() {
    this.setLocalStorage();
    this.getDragiesFromStrg();
    this.updateNumberPages();
    let id = this.$route.params.id;
    if (id >= 1 && id <= this.numberPages) {
      this.currentPage = id;
    } else {
      this.$router.push({ name: "404" });
    }
  },

  computed: {
    ...mapGetters(["dragies", "getNumberPages"])
  },

  methods: {
    updateNumberPages() {
      this.numberPages = this.getNumberPages(this.numberItems);
    },
    nextPage() {
      this.currentPage++;
      this.pushRoute(this.currentPage);
    },
    prevPage() {
      this.currentPage--;
      this.pushRoute(this.currentPage);
    },
    pushRoute(id) {
      this.$router.push({ params: { id: id } });
      this.resetSelectedDragies();
    },
    goToPage(page) {
      this.currentPage = page.num;
      this.pushRoute(this.currentPage);
    },
    showDeleteDragyDialog(dragy) {
      this.dragyToDelete = dragy;
      this.isShowDeleteDragyDialog = true;
    },
    deleteDragy(dragy) {
      this.isShowDeleteDragyDialog = false;
      this.$store.dispatch({
        type: "deleteDragy",
        id: dragy.id
      });
      this.dragyToDelete = {};
      this.updateNumberPages();
    },
    closeDeleteDragyDialog() {
      this.isShowDeleteDragyDialog = false;
      this.dragyToDelete = {};
    },
    showDeleteDragiesDialog() {
      this.isShowDeleteDragiesDialog = true;
    },
    deleteDragies(dragy) {
      this.isShowDeleteDragiesDialog = false;
      this.selectedDragies.forEach((dragy, i, dragies) => {
        this.deleteDragy(dragy);
      });
      this.selectedDragies = [];
    },
    closeDeleteDragiesDialog() {
      this.isShowDeleteDragiesDialog = false;
      this.dragyToDelete = {};
    },
    addSelectedDragy(dragy, isSelected) {
      if (isSelected) {
        this.selectedDragies.push(dragy);
      } else {
        this.selectedDragies.forEach((arrDragy, i, dragies) => {
          if (arrDragy.id === dragy.id) {
            dragies.splice(i, 1);
          }
        });
      }
    },
    resetSelectedDragies() {
      this.selectedDragies = [];
    },
    showCreateDragyDialog(dragy) {
      this.dragyToEdit = dragy;
      this.isShowCreateDragyDialog = true;
    },
    createDragy(dragy) {
      this.$store.dispatch({
        type: "addDragy",
        dragy: dragy
      });
      this.isShowCreateDragyDialog = false;
      this.dragyToEdit = {};
      this.updateNumberPages();
    },
    editDragy(dragy, id) {
      this.$store.dispatch({
        type: "editDragy",
        dragy: dragy,
        id: id
      });
      this.isShowCreateDragyDialog = false;
      this.dragyToEdit = {};
    },
    closeCreateDragyDialog() {
      this.isShowCreateDragyDialog = false;
      this.dragyToEdit = {};
    },
    getDragiesFromStrg() {
      this.$store.dispatch({
        type: "getDragiesFromStrg"
      });
    },
    setLocalStorage() {
      // Друзья, ну не руками ж вы будете их туда впиливать
      let dragies = [
        {
          qnt: 0,
          id: "441172376563",
          name: "Название номер -0",
          note: "Авщрноо Ю.Ф."
        },
        {
          qnt: 1,
          id: "441172374463",
          name: "Название номер 0",
          note: "Авщрноо Ю.Ф."
        },
        {
          qnt: 2,
          id: "622359099140",
          name: "Название номер 1",
          note: "Юххемрхдд Х.Х."
        },
        {
          qnt: 3,
          id: "332539619892",
          name: "Название номер 302",
          note: "Ечшяацкч Х.И."
        },
        {
          qnt: 4,
          id: "295613441012",
          name: "Название номер 303",
          note: "Нжоеаны Д.Е."
        },
        {
          qnt: 5,
          id: "106940022720",
          name: "Название номер 304",
          note: "Флурдмпыи Т.Я."
        },

        {
          qnt: 6,
          id: "996177431007",
          name: "Название номер 2",
          note: "Рднвлхшеа М.Д."
        },
        {
          qnt: 7,
          id: "110003644258",
          name: "Название номер 3",
          note: "Оцяыняяж Г.Ц."
        },
        {
          qnt: 8,
          id: "329703430794",
          name: "Название номер 4",
          note: "Фалойшйщнй П.Д."
        },
        {
          qnt: 9,
          id: "368646382079",
          name: "Название номер 5",
          note: "Рчкпщдужмйии Л.Н."
        },
        {
          qnt: 10,
          id: "292363870166",
          name: "Название номер 53",
          note: "Хнесжвчмяу Ч.Я."
        },
        {
          qnt: 11,
          id: "961783424781",
          name: "Название номер 54",
          note: "Фщечмхцо П.Л."
        },
        {
          qnt: 12,
          id: "312231081654",
          name: "Название номер 55",
          note: "Дзаузпсш Ж.Ю."
        },
        {
          qnt: 13,
          id: "738566017337",
          name: "Название номер 56",
          note: "Рсиоллцмге Л.Ю."
        },
        {
          qnt: 14,
          id: "341055223927",
          name: "Название номер 57",
          note: "Арафщхжс Х.У."
        },
        {
          qnt: 15,
          id: "852839406553",
          name: "Название номер 58",
          note: "Беылшичпгя Х.Х."
        },
        {
          qnt: 16,
          id: "211249386275",
          name: "Название номер 59",
          note: "Ожегуамя Е.М."
        },
        {
          qnt: 17,
          id: "904912375427",
          name: "Название номер 60",
          note: "Вмцомлчд Х.Х."
        },
        {
          qnt: 18,
          id: "145553178619",
          name: "Название номер 61",
          note: "Гыпвщшшщхр Ж.М."
        },
        {
          qnt: 19,
          id: "933325950575",
          name: "Название номер 62",
          note: "Уиижшгщях Ж.С."
        },
        {
          qnt: 20,
          id: "671805993537",
          name: "Название номер 63",
          note: "Нозгцхзы Р.Ю."
        },
        {
          qnt: 21,
          id: "555370605209",
          name: "Название номер 64",
          note: "Дйрвриирыд З.П."
        },
        {
          qnt: 22,
          id: "912604573342",
          name: "Название номер 65",
          note: "Ещкдвмсы Х.Х."
        },
        {
          qnt: 23,
          id: "381780106404",
          name: "Название номер 66",
          note: "Чзмфкйду Р.Ю."
        },
        {
          qnt: 24,
          id: "223072939704",
          name: "Название номер 67",
          note: "Тцлягйфафпцк У.Ф."
        },
        {
          qnt: 25,
          id: "710992184005",
          name: "Название номер 68",
          note: "Фвнжорр О.В."
        },
        {
          qnt: 26,
          id: "641110164333",
          name: "Название номер 69",
          note: "Тмуосизс Н.Ц."
        },
        {
          qnt: 27,
          id: "417807845962",
          name: "Название номер 70",
          note: "Тунщшжо У.К."
        },
        {
          qnt: 28,
          id: "286160892051",
          name: "Название номер 71",
          note: "Бфыыскфщйз Ц.П."
        },
        {
          qnt: 29,
          id: "867098127115",
          name: "Название номер 72",
          note: "Сйыахпйжцл В.Б."
        },
        {
          qnt: 30,
          id: "782600903432",
          name: "Название номер 73",
          note: "Юуяваац Н.П."
        },
        {
          qnt: 31,
          id: "413938249453",
          name: "Название номер 74",
          note: "Кчуаяыавфц И.Х."
        },
        {
          qnt: 32,
          id: "674044267452",
          name: "Название номер 75",
          note: "Ишнппимли Ц.Ц."
        },
        {
          qnt: 33,
          id: "416450980115",
          name: "Название номер 76",
          note: "Хуфмайдрд Ш.В."
        },
        {
          qnt: 34,
          id: "730329259264",
          name: "Название номер 77",
          note: "Лфзежащрж Х.Р."
        },
        {
          qnt: 35,
          id: "847988646847",
          name: "Название номер 78",
          note: "Цаксмшед Я.А."
        },
        {
          qnt: 36,
          id: "591721394123",
          name: "Название номер 79",
          note: "Вчеанпйдси З.Д."
        },
        {
          qnt: 37,
          id: "143368467184",
          name: "Название номер 80",
          note: "Муцнкцфея Ж.Т."
        },
        {
          qnt: 38,
          id: "187457220019",
          name: "Название номер 81",
          note: "Ршкнмцм А.Д."
        },
        {
          qnt: 39,
          id: "569205104379",
          name: "Название номер 82",
          note: "Лйпцлкужг Е.В."
        },
        {
          qnt: 40,
          id: "999644570374",
          name: "Название номер 83",
          note: "Смыжцаа Ю.И."
        },
        {
          qnt: 41,
          id: "183262296908",
          name: "Название номер 84",
          note: "Хрячыгрижцду Ф.К."
        },
        {
          qnt: 42,
          id: "885501177751",
          name: "Название номер 85",
          note: "Ехрхяжви П.Ю."
        },
        {
          qnt: 43,
          id: "923415665011",
          name: "Название номер 86",
          note: "Ещйкыыну Ч.Т."
        },
        {
          qnt: 44,
          id: "222798152738",
          name: "Название номер 87",
          note: "Снчхщвмп С.Д."
        },
        {
          qnt: 45,
          id: "738567088336",
          name: "Название номер 88",
          note: "Мщаменыкдч У.А."
        },
        {
          qnt: 46,
          id: "785596348967",
          name: "Название номер 89",
          note: "Врипцлфсжоы О.А."
        },
        {
          qnt: 47,
          id: "419695870603",
          name: "Название номер 90",
          note: "Яызйчцоне Ф.Н."
        },
        {
          qnt: 48,
          id: "949664276634",
          name: "Название номер 91",
          note: "Хешмплк Ц.Т."
        },
        {
          qnt: 49,
          id: "784800107160",
          name: "Название номер 92",
          note: "Кнчроысжяф Т.Х."
        },
        {
          qnt: 50,
          id: "327188046632",
          name: "Название номер 93",
          note: "Кззчпвчрйз Б.Я."
        },
        {
          qnt: 51,
          id: "202739998790",
          name: "Название номер 94",
          note: "Азпгкйха П.Ш."
        },
        {
          qnt: 52,
          id: "273443829689",
          name: "Название номер 95",
          note: "Фдцучрнп О.Ж."
        },
        {
          qnt: 53,
          id: "399412848900",
          name: "Название номер 96",
          note: "Лщдоовзмш В.Ч."
        },
        {
          qnt: 54,
          id: "681606946606",
          name: "Название номер 97",
          note: "Фзкснлахя О.С."
        },
        {
          qnt: 55,
          id: "249561891274",
          name: "Название номер 98",
          note: "Цсрищчзиыы Х.Н."
        },
        {
          qnt: 56,
          id: "763027979680",
          name: "Название номер 99",
          note: "Лунасркфо Д.М."
        },
        {
          qnt: 57,
          id: "912496679464",
          name: "Название номер 100",
          note: "Аоячяшзечкф Т.Ч."
        },
        {
          qnt: 58,
          id: "254067265993",
          name: "Название номер 101",
          note: "Лжарсшсыв Н.Х."
        },
        {
          qnt: 59,
          id: "609997298232",
          name: "Название номер 102",
          note: "Санчаыинсй Ч.П."
        },
        {
          qnt: 60,
          id: "135865330761",
          name: "Название номер 103",
          note: "Нснгырнаш Д.З."
        },
        {
          qnt: 61,
          id: "991103873667",
          name: "Название номер 104",
          note: "Злрыщнпн А.О."
        },
        {
          qnt: 62,
          id: "934817047345",
          name: "Название номер 105",
          note: "Кпфпызф В.Г."
        },
        {
          qnt: 63,
          id: "177628560228",
          name: "Название номер 106",
          note: "Цжсвечзхцфра Б.Т."
        },
        {
          qnt: 64,
          id: "711006049528",
          name: "Название номер 107",
          note: "Иппначхшх Ч.Н."
        },
        {
          qnt: 65,
          id: "373088783059",
          name: "Название номер 108",
          note: "Оеняжофщжех Б.Х."
        },
        {
          qnt: 66,
          id: "209793402554",
          name: "Название номер 109",
          note: "Грххфцяу М.Е."
        },
        {
          qnt: 67,
          id: "769321332057",
          name: "Название номер 110",
          note: "Хкукзячфв Я.О."
        },
        {
          qnt: 68,
          id: "306221307163",
          name: "Название номер 111",
          note: "Хцурингвз Л.Я."
        },
        {
          qnt: 69,
          id: "674516737811",
          name: "Название номер 112",
          note: "Гмфяяивяааы М.Ф."
        }
      ];
      let firstEntry = localStorage.getItem("firstEntry");
      if (firstEntry !== "no") {
        localStorage.setItem("dragies", JSON.stringify(dragies));
      }
      localStorage.setItem("firstEntry", "no");
    }
  },

  components: {
    "dragy-list": DragyList,
    navigation: Navigation,
    "delete-dragy-dialog": DeleteDragyDialog,
    "delete-dragies-dialog": DeleteDragiesDialog,
    "create-dragy-dialog": CreateDragyDialog
  }
};
</script>

<style scoped>
.delete-btns {
  position: fixed;
  top: 48px;
  width: 312px;
}
.cancel-btn {
  min-width: 0;
}
.create-btn {
  position: fixed;
  bottom: 0;
  right: 10%;
}
.dragy-list-margin {
  margin-bottom: 60px;
}
</style>
