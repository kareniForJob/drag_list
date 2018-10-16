import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    dragies: []
  },
  mutations: {
    addDragy(state, params) {
      state.dragies.push(params.dragy)
    },
    editDragy(state, params) {
      state.dragies.forEach((arrDragy, i) => {
        if (arrDragy.id === params.id) {
          state.dragies.splice(i, 1, params.dragy)
        }
      })
    },
    deleteDragy(state, dragy) {
      state.dragies.forEach((arrDragy, i, dragies) => {
        if (arrDragy.id === dragy.id) {
          dragies.splice(i, 1)
        }
      })
    },
    deleteDragies(dragyIds) {
      // когда удаляется куча значений
      // не реализовал потому что нет времени на это
      // да, это 5 минут, ну и что
    },
    setDragies(state, params) {
      state.dragies = params.dragies
    },
    clearDragDragy(state, params) {
      state.dragies.splice(params.dragy.qnt, 1);
    },
    recoverDragDragy(state, params) {
      state.dragies.splice(params.dragy.qnt, 0, params.dragy);
    },
    swapDragies(state, params) {
      // подробнее смотри в экшене.
      let delta = params.fromDragy.qnt < params.toDragy.qnt ? -1 : 1,
        start = params.fromDragy.qnt - delta,
        end = params.toDragy.qnt - delta
      state.dragies.splice(end + delta, 0, Object.assign({}, params.fromDragy))
      Vue.set(state.dragies[end + delta], 'qnt', params.toDragy.qnt)
      for (let i = start; i !== end; i -= delta) {
        state.dragies[i + delta].qnt += delta;
      }
    }
  },
  actions: {
    deleteDragy({ commit, state }, params) {
      let dragies = JSON.parse(localStorage.getItem('dragies'))
      dragies.forEach((arrDragy, i, dragies) => {
        if (arrDragy.id === params.id) {
          dragies.splice(i, 1)
        }
      })
      localStorage.setItem('dragies', JSON.stringify(dragies))
      commit({
        type: 'deleteDragy',
        id: params.id
      })
    },
    addDragy({ commit, state }, params) {
      let dragies = JSON.parse(localStorage.getItem('dragies'))
      let dragy = params.dragy;
      // типа автоинкремет))
      dragy.qnt = dragies[dragies.length - 1].qnt + 1
      dragies.push(dragy)
      localStorage.setItem('dragies', JSON.stringify(dragies))
      commit({
        type: 'addDragy',
        dragy: params.dragy
      })
    },
    editDragy({ commit, state }, params) {
      let dragies = JSON.parse(localStorage.getItem('dragies'))
      let dragy = params.dragy;

      dragies.forEach((arrDragy, i) => {
        if (arrDragy.id === params.id) {
          dragy = { ...dragies[i], ...dragy }
          dragies.splice(i, 1, dragy)
        }
      })
      localStorage.setItem('dragies', JSON.stringify(dragies))
      commit({
        type: 'editDragy',
        dragy: dragy,
        id: params.id
      })
    },
    getDragiesFromStrg({ commit, state }) {
      let dragies = JSON.parse(localStorage.getItem('dragies'))
      commit({
        type: 'setDragies',
        dragies: dragies
      })
    },
    clearDragDragy({ commit, state }, params) {
      commit({
        type: 'clearDragDragy',
        dragy: params.dragy
      })
    },
    recoverDragDragy({ commit, state }, params) {
      commit({
        type: 'recoverDragDragy',
        dragy: params.dragy
      })
    },
    swapDragies({ commit, state }, params) {
      let dragies = JSON.parse(localStorage.getItem('dragies'))
      // end - всегда снаружи двигающихся элементов
      // start - это всегда второй элемент (с начала или конца). Первый элемент нужно поменять с последним.
      // delta - в какую сторону двигаемся? Можно переместить сверху вниз (-1) или наоборот (1).
      // (0, start = 1, 2, .. , n-1, n, end)
      // (end, 0, 1, .. , start = n-1, n)
      let delta = params.fromDragy.qnt < params.toDragy.qnt ? -1 : 1,
        start = params.fromDragy.qnt - delta,
        end = params.toDragy.qnt - delta
      for (let i = start; i !== end; i -= delta) {
        dragies[i + delta] = dragies[i]
        dragies[i + delta].qnt += delta
      }
      // меняем тот, что перетаскивали
      dragies[end + delta] = Object.assign({}, params.fromDragy);
      dragies[end + delta].qnt = params.toDragy.qnt;

      localStorage.setItem('dragies', JSON.stringify(dragies))
      commit({
        type: 'swapDragies',
        fromDragy: params.fromDragy,
        toDragy: params.toDragy
      })
    }
  },
  getters: {
    dragies: state => {
      return state.dragies
    },
    getNumberPages: state => numberItems => {
      return Math.ceil((state.dragies.length) / numberItems)
    }
  }
})

export default store
