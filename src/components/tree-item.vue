<template>
  <div class="wrap">
    <div class="tree-item__toggle" v-if="isFolder">
      <img @click="toggle" src="../assets/arrow-left.png" v-if="!open">
      <img @click="toggle" src="../assets/arrow-down.png" v-else>
    </div>
    <div class="tree-item">
      <div v-if="options.checkbox" class="check" :class="[labelIcon]" @click="toggleChecked">
        <div class="check__checkmark"></div>
      </div>
      <span class="tree-item__label" @click="handle">{{ model[options.label] }}</span>
      <tree-item
        v-if="isFolder" v-show="open"
        v-for="(item, idx) in model.children"
        :model="item"
        :options="options"
        :ids="ids"
        :depth="depth + 1"
        :ids-with-parent="idsWithParent"
        :half="half"
        :state="itemState"
        :key="idx"
        @handle="emitHandle"
        @child-change="childChange"
      ></tree-item>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'tree-item',

    props: {
      model: {
        type: Object,
        default: function () {
          return {}
        }
      },
      options: {
        type: Object,
        default: function () {
          return {}
        }
      },

      depth: {
        type: Number,
        default: 0
      },

      ids: {
        type: Array,
        default: function () {
          return []
        }
      },

      idsWithParent: {
        type: Array,
        default: function () {
          return []
        }
      },

      half: {
        type: Array,
        default: function () {
          return []
        }
      },

      state: {
        type: Number,
        default: 0
      }
    },

    data () {
      return {
        open: false,
        itemState: 0
      }
    },

    computed: {
      toggleIcon () {
        return this.open ? this.options.closeIcon : this.options.openIcon
      },

      labelIcon () {
        if (this.half.indexOf(this.model.id) !== -1) {
          return this.options.halfCheckedIcon
        } else if (this.idsWithParent.indexOf(this.model.id) !== -1) {
          return this.options.checkedIcon
        } else {
          return this.options.uncheckedIcon
        }
      },

      labelStatus () {
        if (this.half.indexOf(this.model.id) !== -1) {
          return 'half-checked'
        } else if (this.idsWithParent.indexOf(this.model.id) !== -1) {
          return 'checked'
        } else {
          return 'unchecked'
        }
      },

      isFolder () {
        return this.model.children && this.model.children.length
      },

      self () {
        let self = Object.assign({}, this.model, {children: []})
        delete self.children
        return self
      }
    },

    created () {
      if (this.isFolder && this.depth < this.options.depthOpen) {
        this.open = true
      }
      if (this.options.checkbox) {
        if (this.idsWithParent.indexOf(this.model.id) !== -1) {
          this.itemState = this.itemState + 1
          if (this.isFolder && !this.options.idsWithParent) {
            let index = this.ids.indexOf(this.model.id)
            if (index !== -1) {
              this.$delete(this.ids, index)
            }
          }
          this.$emit('child-change', true)
        }
        if (this.state > 0) {
          this.addChecked()
          this.itemState = this.itemState + 1
        }
      }
    },

    watch: {
      state (val, old) {
        if (val > old) {
          this.addChecked()
          this.itemState = this.itemState + 1
        } else {
          this.delChecked()
          this.deleteHalfChecked(this.model.id)
          this.itemState = this.itemState - 1
        }
      }
    },

    methods: {
      toggle () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },

      handle () {
        this.emitHandle(this.self)
      },

      emitHandle (item) {
        this.$emit('handle', item)
      },

      toggleChecked () {
        if (this.isFolder) {
          this.deleteHalfChecked()
        }
        if (this.idsWithParent.indexOf(this.model.id) !== -1) {
          this.delChecked()
          this.$emit('child-change', false)
          this.itemState = this.itemState - 1
        } else {
          this.addChecked()
          this.$emit('child-change', true)
          if (this.options.checkedOpen && this.isFolder) {
            this.open = true
          }
          this.itemState = this.itemState + 1
        }
      },

      addChecked () {
        if (this.idsWithParent.indexOf(this.model.id) === -1) {
          this.$set(this.idsWithParent, this.idsWithParent.length, this.model.id)
        }
        if (!this.isFolder || this.options.idsWithParent) {
          if (this.ids.indexOf(this.model.id) === -1) {
            this.$set(this.ids, this.ids.length, this.model.id)
          }
        }
      },

      delChecked () {
        let idx = this.idsWithParent.indexOf(this.model.id)
        let index = this.ids.indexOf(this.model.id)
        if (idx !== -1) {
          this.$delete(this.idsWithParent, idx)
        }
        if (index !== -1) {
          this.$delete(this.ids, index)
        }
      },

      setHalfChecked () {
        if (this.half.indexOf(this.model.id) === -1) {
          this.$set(this.half, this.half.length, this.model.id)
        }
      },

      deleteHalfChecked () {
        let idx = this.half.indexOf(this.model.id)
        if (idx !== -1) {
          this.$delete(this.half, idx)
        }
      },

      childChange (checked) {
        if (this.model.children.some((val) => this.half.indexOf(val.id) !== -1)) {
          this.addChecked()
          this.setHalfChecked()
          this.$emit('child-change', true)
          return
        }
        if (checked) {
          this.addChecked()
          if (this.model.children.some((val) => this.idsWithParent.indexOf(val.id) === -1)) {
            this.setHalfChecked()
          } else {
            this.deleteHalfChecked()
          }
          this.$emit('child-change', true)
        } else {
          if (this.model.children.some((val) => this.idsWithParent.indexOf(val.id) !== -1)) {
            this.setHalfChecked()
          } else {
            this.deleteHalfChecked()
            this.delChecked()
          }
          this.$emit('child-change', false)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  img {
    width: 14px;
    cursor: pointer;
  }
  .check {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all ease .2s;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    cursor: pointer;
    float: left;

    &--empty {
      background-color: #f5f5f5;
      .check__checkmark {
        &:after {
          display: none;
        }
      }
    }

    &--half {
      background-color: #0064b1;
      .check__checkmark {
        &:after {
          content: '';
          display: block;
          width: 6px;
          height: 0;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(180deg);
        }
      }
    }

    &--fill {
      background-color: #0064b1;
      .check__checkmark {
        &:after {
          content: '';
          display: block;
          width: 3px;
          height: 6px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
    }
  }

  .tree-item {
    padding-left: 20px;

    &__label {
      margin-bottom: 8px;
      display: inline-block;
    }
    &__toggle {
      float: left;
    }
  }
</style>
