<template>
  <div class="v-file">
    <input ref="inputFile" type="file" :name="name" :accept="accept" :multiple="multiple" @input="change" />
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'v-file',
    props: {
      accept: {
        type: String,
        default: '*',
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      name: {
        type: String,
        default: 'file',
      },
    },
    methods: {
      change(e) {
        if (this.multiple) {
          this.$emit('change', e.target.files)
        } else {
          this.$emit('change', e.target.files[0])
        }
        this.$refs.inputFile.value = ''
      },
    },
    mounted() {
      try {
        const btn = this.$children[0]
        btn.$on('click', () => {
          this.$refs.inputFile.click()
        })
      } catch (error) {
        console.log(error)
      }
    },
  }
</script>

<style scoped>
  .v-file input[type='file'] {
    display: none;
  }
</style>