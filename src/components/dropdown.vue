<template>
  <div class="wrap">
    <input type="text" placeholder="Быстрый поиск" @focus="isOpen = true" v-model="filter">
    <transition name="slide">
      <div class="dropdown" v-show="isOpen">
        <tree :filter="filter" :tree-data="treeData" :options="options"></tree>
      </div>
    </transition>
  </div>
</template>

<script>
  import Tree from "./tree";
  import clickOut from '../mixins/clickOut/clickOut'

  /**
   * @event outside - close dropdown if click out
   * @options {
   *  label - name value in data list
   *  checkedOpen - open checked folder or no
   *  halfCheckedIcon - class for half state
   *  checkedIcon - class for checked state
   *  depthOpen - depth opened folders by default
   *  uncheckedIcon - class for unchecked state
   * }
   */
  export default {
    mixins: [clickOut],
    components: { Tree },
    name: "dropdown",
    data () {
      return {
        filter: '',
        isOpen: false,
        options: {
          label: 'label',
          checkbox: true,
          checkedOpen: true,
          idsWithParent: true,
          depthOpen: 1,
          halfCheckedIcon: 'check--half',
          checkedIcon: 'check--fill',
          uncheckedIcon: 'check--empty'
        },
        treeData: {
            children: [
              {label: '2 Level', id: 2},
              {label: '2 Level qwerwr', id: 98765},
              {label: '2 Level some', id: 965},
              {
                label: '2 Level',
                id: 4,
                children: [
                  {
                    label: '3 Level',
                    id: 5,
                    children: [
                      {label: '4 Level', id: 6},
                      {label: '4 Level', id: 8},
                      {label: '4 Level', id: 30}
                    ]
                  },
                  {label: '3 Level', id: 34234},
                ]
              }
            ]
          }
      }
    },
    methods: {
      outside() {
        this.isOpen = false;
      }
    },
    mounted () {
      this.$on('clickOut', this.outside);
    }
  }
</script>

<style scoped lang="scss">
  .wrap {
    float: left;
    position: relative;
    width: 300px;
    * {
      box-sizing: border-box;
    }
  }

  input {
    padding: 0 10px;
    border-radius: 2px;
    background-color: #ffffff;
    border: solid 1px #0064b1;
    font-size: 13px;
    font-weight: 500;
    height: 30px;
    width: 100%;
  }

  .dropdown {
    width: 100%;
    padding: 10px;
    border-radius: 3px;
    border: solid 1px #0064b1;
    height: 200px;
    margin-top: 5px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background-color: #FFFFFF;
      border: solid 1px #ececec;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: #0064b1;
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: all ease-in-out .2s;
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
