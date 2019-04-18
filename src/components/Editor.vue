<template id='editor'>
  <div class="content-container">
    <div class='button' v-if='mode == "import"' id='choose_butt' @click='choose_file'>Choose File</div>
    <!-- Invisible -->
    <div
      v-bind:class='["button", {invisible: (mode == "import")}]'
      v-if='ifVisualize'
      id='editor_butt'
      @click='no_visualize'>Edit EDL</div>
    <div
      v-bind:class='["button", {invisible: (mode == "import")}]'
      v-if='!ifVisualize'
      id='visual_butt'
      @click='visualize'>Visualize EDL</div>
    <div
      v-bind:class='["button", {invisible: (mode == "import")}]'
      id='save_butt'
      @click="save">Save EDL</div>
    <input
      type="file"
      id='file'
      class='invisible'
      v-if='mode == "import"'
      v-on:change='read_file'>
    <textarea
      ref='editor'
      id='editor'
      v-if='!ifVisualize'
      v-bind:class='[{invisible: (mode == "import")}]'
      v-on:keydown='handle_keys'
      v-model='input'></textarea>
    <p class="error-hint" v-if="errorMessage">{{errorMessage}}</p>
    <div class="visualize-container" v-if='ifVisualize && (errorMessage == "")'>
      <div class="exp-container" v-for='item in parsedContent[1]'>
        <div class="exp-item">
          <span class="attr-name">EXP</span>
          {{item.name}}
        </div>
        <!-- PLACE -->
        <div class="exp-subitem">
          <span class="attr-name">PLACE</span>
          <template v-if='item.place.name == "" && !item.place.attr_group'>ANY</template>
          <template v-else>{{item.place.name}}</template>
        </div>
        <div
          class="exp-subitem-attr"
          v-for='attr_item in item.place.attr_group'
          @click='view(attr_item.attr_name, attr_item.value)'>
          <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
        </div>
        <!-- ROLE -->
        <div class="exp-subitem">
          <span class="attr-name">ROLE</span>
          <template v-if='item.role.name == "" && !item.role.attr_group'>ANY</template>
          <template>{{item.role.name}}</template>
        </div>
        <div
          class="exp-subitem-attr"
          v-for='attr_item in item.role.attr_group'
          @click='view(attr_item.attr_name, attr_item.value)'>
          <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
        </div>
        <!-- TIME -->
        <div class="exp-subitem">
          <span class="attr-name">TIME</span>
          <template v-if='item.time.name == "" && !item.time.attr_group'>ANY</template>
          <template>{{item.time.name}}</template>
        </div>
        <div
          class="exp-subitem-attr"
          v-for='attr_item in item.time.attr_group'
          @click='view(attr_item.attr_name, attr_item.value)'>
          <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
        </div>
        <!-- INPUT -->
        <div class="exp-subitem" v-if='item.input'>
          <span class="attr-name">INPUT</span>
          {{item.input.name}}
        </div>
        <template v-if='item.input'>
          <div
            class="exp-subitem-attr"
            v-for='attr_item in item.input.attr_group'
            @click='view(attr_item.attr_name, attr_item.value)'>
            <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
          </div>
        </template>
        <!-- OUTPUT -->
        <div class="exp-subitem" v-if='item.output'>
          <span class="attr-name">OUTPUT</span>
          {{item.output.name}}
        </div>
        <template v-if='item.output'>
          <div
            class="exp-subitem-attr"
            v-for='attr_item in item.output.attr_group'
            @click='view(attr_item.attr_name, attr_item.value)'>
            <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
          </div>
        </template>
        <!-- PROCESS -->
        <div class="exp-subitem">
          <span class="attr-name">PROCESS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    mode: String,
    index: {type: Number, default: -1}
  },
  data() {
    return {
      saved: -1,
      input: '',
      parsedContent: '',
      errorMessage: '',
      ifVisualize: false,
    }
  },
  created() {
    let index = this.index
    if (index != -1) {
      let list = JSON.parse(localStorage.getItem('savedList'))
      this.saved = index
      this.input = list[index].content
      this.parsedContent = list[index].parsedContent
    }
  },
  methods: {
    save() {
      if (this.errorMessage == '') {
        let result = confirm("There's an error in your EDL. Are you sure you want to save it without correcting?")
        if (result) {
          let list = JSON.parse(localStorage.getItem('savedList'))
          if (this.saved == -1) {
            let myDate = new Date()
            let obj = {
              name: myDate.toLocaleString(),
              content: this.input,
              parsedContent: this.parsedContent
            }
            if (!list) {
              this.saved = 0
              localStorage.setItem('savedList', JSON.stringify([obj]))
            } else {
              list.push(obj)
              this.saved = list.length - 1
              localStorage.setItem('savedList', JSON.stringify(list))
            }
          } else {
            list[this.saved].content = this.input
            list[this.saved].parsed = this.parsedContent
            localStorage.setItem('savedList', JSON.stringify(list))
          }
          alert('Save successfully')
        }
      }
    },
    view(type, val) {
      val = val.slice(1, (val.length-1))
      if (type == 'link') {
        window.open(val)
      } else {
        alert(val)
      }
    },
    visualize() {
      this.ifVisualize = true
    },
    no_visualize() {
      this.ifVisualize = false
    },
    choose_file() {
      let obj = document.getElementById('file');

      obj.click();
    },
    read_file() {
      let that = this;
      let obj = document.getElementById('file');

      let reader = new FileReader();
      reader.readAsText(obj.files[0], 'UTF-8');
      reader.onload = function(e) {
        that.input = e.target.result;
        document.getElementById('editor').style.display = 'block';
        document.getElementById('editor_butt').style.display = 'block';
        document.getElementById('visual_butt').style.display = 'block';
        document.getElementById('save_butt').style.display = 'block';
      }
    },
    handle_keys(e) {
      if (e.keyCode == 9) {
        e.preventDefault()
        let start = this.$refs.editor.selectionStart
        let end = this.$refs.editor.selectionEnd
        this.input = this.input.substr(0, start) + '  ' + this.input.substr(end)
        this.$nextTick(() => {
          this.$refs.editor.selectionStart = this.$refs.editor.selectionEnd = start + 2
        })
      } else if (e.keyCode == 219 && e.shiftKey) {
        e.preventDefault()
        let start = this.$refs.editor.selectionStart
        let end = this.$refs.editor.selectionEnd
        this.input = this.input.substr(0, start) + '{\n  \n}' + this.input.substr(end)
        this.$nextTick(() => {
          this.$refs.editor.selectionStart = this.$refs.editor.selectionEnd = start + 4
        })
      } else if (e.keyCode == 57 && e.shiftKey) {
        e.preventDefault()
        let start = this.$refs.editor.selectionStart
        let end = this.$refs.editor.selectionEnd
        this.input = this.input.substr(0, start) + '()' + this.input.substr(end)
        this.$nextTick(() => {
          this.$refs.editor.selectionStart = this.$refs.editor.selectionEnd = start + 1
        })
      } else if (e.keyCode == 187) {
        e.preventDefault()
        let start = this.$refs.editor.selectionStart
        let end = this.$refs.editor.selectionEnd
        this.input = this.input.substr(0, start) + '=>' + this.input.substr(end)
        this.$nextTick(() => {
          this.$refs.editor.selectionStart = this.$refs.editor.selectionEnd = start + 2
        })
      }
    }
  },
  watch: {
    input: function(val) {
      let that = this
      let obj = {content: val}
      let stream = JSON.stringify(obj)
      axios.post('http://127.0.0.1:12580/analyse', stream).then(function(res) {
        res = res.data
        if (!res.status) {
          that.errorMessage = "Error: " + res.text
        } else {
          that.errorMessage = ""
          that.parsedContent = JSON.parse(res.text)
        }
      })
    },
    index: function(val) {
      let index = val
      if (index != -1) {
        let list = JSON.parse(localStorage.getItem('savedList'))
        this.saved = index
        this.input = list[index].content
        this.parsedContent = list[index].parsedContent
      }
    }
  }
}
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 60vh;

    padding: 8px;

    resize: none;
    outline: none;
  }

  .error-hint {
    color: #C51162;
  }

  .warning-hint {
    color: #FFD600;
  }

  .visualize-container {
    width: 100%;

    margin-top: 32px;

    float: left;
    overflow: hidden;
  }

  .attr-name {
    color: #90EE02;
  }

  .exp-container {
    width: 320px;

    float: left;
    overflow: hidden;
  }

  .exp-item {
    height: 64px;

    line-height: 64px;
    font-size: 1.5em;
    color: #FFFFFF;

    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
    box-sizing: border-box;

    background-color: #6002EE;

    width: 100%;

    padding-left: 8px;
    padding-right: 8px;

    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    cursor: pointer;
  }

  .exp-subitem {
    width: 288px;
    height: 48px;

    line-height: 48px;
    font-size: 1.2em;
    color: #FFFFFF;

    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
    box-sizing: border-box;

    background-color: #021AEE;

    width: 100%;

    margin-top: 8px;
    margin-left: 32px;
    padding-left: 8px;
    padding-right: 8px;

    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    cursor: pointer;
  }

  .exp-subitem-attr {
    width: 256px;
    height: 32px;

    line-height: 32px;
    color: #FFFFFF;

    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
    box-sizing: border-box;

    background-color: #263238;

    width: 100%;

    margin-top: 8px;
    margin-left: 64px;
    padding-left: 8px;
    padding-right: 8px;

    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    cursor: pointer;
  }
</style>
