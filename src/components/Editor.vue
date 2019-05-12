<template id='editor'>
<div class="content-container">
  <div class='button' v-if='mode == "import"' id='choose_butt' @click='choose_file'>Choose File</div>
  <!-- Invisible -->
  <div v-bind:class='["button", {invisible: (mode == "import")}]' id='export_butt' @click='export_file'>Export EDL</div>
  <div v-bind:class='["button", {invisible: (mode == "import")}]' v-if='ifVisualize' id='editor_butt' @click='no_visualize'>Edit EDL</div>
  <div v-bind:class='["button", {invisible: (mode == "import")}]' v-if='!ifVisualize' id='visual_butt' @click='visualize'>Visualize EDL</div>
  <div v-bind:class='["button", {invisible: (mode == "import")}]' v-if='!ifVisualize' id='save_butt' @click="save">Save EDL</div>
  <div v-bind:class='["button", {invisible: (mode == "import")}]' v-if='!ifVisualize' id='analyse_butt' @click="analyse">Analyse EDL</div>
  <div v-bind:class='["button", {invisible: (mode == "import")}]' v-if='ifVisualize && (visualizeIndex > 0)' id='prev_butt' @click="previous">Previous Exp</div>
  <div v-bind:class='["button", {invisible: (mode == "import")}]' v-if='ifVisualize && (visualizeIndex < (parsedContent.length -1))' id='next_butt' @click="next">Next Exp</div>
  <input type="file" id='file' class='invisible' v-if='mode == "import"' v-on:change='read_file'>

  <textarea ref='editor' id='editor' v-if='!ifVisualize' v-bind:class='[{invisible: (mode == "import")}]' v-on:keydown='handle_keys' v-model='input'></textarea>

  <p class="error-hint" v-if="errorMessage">{{errorMessage}}</p>

  <div class="visualize-container" v-if='ifVisualize && (errorMessage == "")'>
    <div class="exp-container">
      <div class="exp-item">
        <span class="attr-name">EXP</span>
        {{parsedContent[visualizeIndex].name}}
      </div>
      <!-- PLACE -->
      <template v-for='place_item in parsedContent[visualizeIndex].place'>
        <div class="exp-subitem">
          <span class="attr-name">PLACE</span>
          <template>{{place_item.name}}</template>
        </div>
        <div class="exp-subitem-attr" v-for='(attr_item, attr_index) in place_item.attr_group' @click='view(attr_item.attr_name, attr_item.value)'>
          <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
        </div>
      </template>
      <!-- ROLE -->
      <template v-for='role_item in parsedContent[visualizeIndex].role'>
        <div class="exp-subitem">
          <span class="attr-name">ROLE</span>
          <template>{{role_item.name}}</template>
        </div>
        <div class="exp-subitem-attr" v-for='(attr_item, attr_index) in role_item.attr_group' @click='view(attr_item.attr_name, attr_item.value)'>
          <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
        </div>
      </template>
      <!-- TIME -->
      <template v-for='time_item in parsedContent[visualizeIndex].time'>
        <div class="exp-subitem">
          <span class="attr-name">TIME</span>
          <template>{{time_item.name}}</template>
        </div>
        <div class="exp-subitem-attr" v-for='(attr_item, attr_index) in time_item.attr_group' @click='view(attr_item.attr_name, attr_item.value)'>
          <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
        </div>
      </template>
      <!-- INPUT -->
      <div class="exp-subitem" v-if='parsedContent[visualizeIndex].input'>
        <span class="attr-name">INPUT</span>
        {{parsedContent[visualizeIndex].input}}
      </div>
      <template v-if='parsedContent[visualizeIndex].input'>
        <div class="exp-subitem-attr" v-for='(attr_item, attr_index) in parsedContent[visualizeIndex].input.attr_group' @click='view(attr_item.attr_name, attr_item.value)'>
          <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
        </div>
      </template>
      <!-- OUTPUT -->
      <div class="exp-subitem" v-if='parsedContent[visualizeIndex].output'>
        <span class="attr-name">OUTPUT</span>
        {{parsedContent[visualizeIndex].output}}
      </div>
      <template v-if='parsedContent[visualizeIndex].output'>
        <div class="exp-subitem-attr" v-for='(attr_item, attr_index) in parsedContent[visualizeIndex].output.attr_group' @click='view(attr_item.attr_name, attr_item.value)'>
          <span class="attr-name">{{attr_item.attr_name.toUpperCase()}}</span>
        </div>
      </template>
      <!-- MATERIAL -->
      <template v-if='parsedContent[visualizeIndex].material' v-for='material_item in parsedContent[visualizeIndex].material'>
        <div class="exp-subitem">
          <span class="attr-name">MATERIAL</span>
          <template>{{material_item}}</template>
        </div>
      </template>
    </div>
    <!-- PROCESS -->
    <div class="exp-process-container">
      <div class="exp-process-title">PROCESS</div>
      <div class="exp-process-inner" id='process-inner'>
        <template v-for="(process_item, process_index) in processItems">
          <div v-if='!process_item.exp_name' class="process-item" v-bind:style="{ left: process_item.left, top: process_item.top }" v-tooltip='process_item.name'>
            <span v-if='process_item.condition' class="process-condition">{{process_item.condition}}:</span>
            {{process_item.name}}
          </div>
          <div v-if='process_item.exp_name' @click='jumpExp(process_item.exp_name)' class="process-item clickable" v-bind:style="{ left: process_item.left, top: process_item.top }" v-tooltip='process_item.name'>
            <span v-if='process_item.condition' class="process-condition">{{process_item.condition}}:</span>
            {{process_item.name}}
            <span class='attr-name'>EXP</span>
          </div>
        </template>
        <template v-for="(line_item, line_index) in processLines">
          <div v-if='!line_item.vertical' class="process-line" v-bind:style="{ left: line_item.left, top: line_item.top, width: line_item.width }"></div>
          <div v-if='line_item.vertical' class="process-vertical-line" v-bind:style="{ left: line_item.left, top: line_item.top, height: line_item.height }"></div>
        </template>
      </div>
    </div>
  </div>

  <div v-if='parsedContent.length > 0'>
    <input id="target_input" placeholder="Targets, split with comma" type="text" v-model='target'>
    <div class="button" id="target_butt" @click='explain()'>Explain</div>
    <p v-if='filteredContent.length > 0'>
      Matched:
      <template v-for='item in filteredContent'>
        <span class="exp-link" @click='jumpExp(item.name)'>{{item.name}}</span>
      </template>
    </p>
    <p v-if='optionalContent.length > 0'>
      Optional:
      <template v-for='item in optionalContent'>
        <span class="exp-link" @click='jumpExp(item.name)'>{{item.name}}</span>
      </template>
    </p>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    mode: String,
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      saved: -1,
      input: '',
      target: '',
      parsedContent: [],
      filteredContent: [],
      optionalContent: [],
      extractedContent: [],
      errorMessage: '',
      processItems: [],
      processLines: [],
      ifAnalysed: false,
      ifVisualize: false,
      visualizeIndex: 0,
      ifAlreadyAlert: false
    }
  },
  created() {
    let index = this.index
    if (index != -1) {
      let list = JSON.parse(localStorage.getItem('savedList'))
      this.saved = index
      this.input = list[index].content
      this.parsedContent = list[index].parsed
    }
  },
  methods: {
    save() {
      if (this.input == '') {
        alert('Cannot save empty file')

        return false
      }

      if (this.errorMessage != '') {
        let result = confirm("There's an error in your EDL. Are you sure you want to save it without correcting?")
        if (!result) {
          return false
        }
      }

      let list = JSON.parse(localStorage.getItem('savedList'))
      if (this.saved == -1) {
        let myDate = new Date()
        let obj = {
          name: myDate.toLocaleString(),
          content: this.input,
          parsed: this.parsedContent
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
    },
    view(type, val) {
      val = val.slice(1, (val.length - 1))
      if (type == 'link') {
        window.open(val)
      } else {
        alert(val)
      }
    },
    explain() {
      let that = this
      let target = this.target
      if (target.trim() != '') {
        let obj = {
          target: target,
          content: this.input
        }
        axios.post('http://127.0.0.1:12580/explain', obj).then(function(res) {
          res = res.data
          that.ifAlreadyAlert = false
          if (!res.status) {
            let message = res.text
            alert(`Explain failed: ${message}`)
          } else {
            const data = JSON.parse(res.text)
            that.filteredContent = data.exact
            that.optionalContent = data.optional
          }
        }).catch(function(err) {
          console.log('error:', err)

          if (!that.ifAlreadyAlert) {
            that.ifAlreadyAlert = true

            alert('Cannot connect to server, explain failed')
          }
        })
      } else {
        alert('No target entered')
      }
    },
    export_file() {
      let that = this
      let name = prompt("请输入文件名", "exported")
      if (name.trim() != '') {
        let obj = {
          target: name,
          content: this.input
        }
        axios.post('http://127.0.0.1:12580/generate', obj).then(function(res) {
          res = res.data
          that.ifAlreadyAlert = false
          if (!res.status) {
            let message = res.text
            alert(`Generate failed: ${message}`)
          } else {
            window.open(res.text)
          }
        }).catch(function(err) {
          console.log('error:', err)

          if (!that.ifAlreadyAlert) {
            that.ifAlreadyAlert = true

            alert('Cannot connect to server, export failed')
          }
        })
      }
    },
    jumpExp(name) {
      for (let i = 0; i < this.parsedContent.length; i++) {
        if (this.parsedContent[i].name == name) {
          this.visualizeIndex = i
          this.buildExpProcess(i)

          this.ifVisualize = true

          break
        }
      }
    },
    buildExpProcess(index) {
      let group = []
      let lineGroup = []

      let processIndex = 0
      let currentPos = this.parsedContent[index].process
      while(currentPos) {
        let obj = {}
        obj.top = '8px'
        obj.left = processIndex * (200 + 30 + 8) + 'px'
        obj.name = currentPos.name
        if (currentPos.type == "exp") {
          obj.exp_name = currentPos.name
        }
        if (currentPos.condition != "") {
          obj.condition = currentPos.condition
        }

        group.push(obj)

        // Connect lines
        if (processIndex > 0) {
          let lineObj = {}
          lineObj.top = 8 + 32 + 'px'
          lineObj.left = 200 / 2 + (processIndex - 1) * (200 + 30 + 8) + 'px'
          lineObj.width = 200 + 30 + 'px'
          lineObj.vertical = false

          lineGroup.push(lineObj)
        }

        // Vertical line
        if (currentPos.branches.length != 0) {
          let lineObj = {}

          lineObj.top = 8 + 32 + 'px'
          lineObj.left = 200 + 30 / 2 + processIndex * (200 + 30 + 8) + 'px'
          lineObj.height = currentPos.branches.length * (64 + 30 + 8) + 'px'
          lineObj.vertical = true

          lineGroup.push(lineObj)
        }

        let currentBranchPos = 0
        for (let each_branch of currentPos.branches) {
          let obj = {}
          let lineObj = {}

          obj.top = 8 + (currentBranchPos + 1) * (64 + 30 + 8) + 'px'
          obj.left = (processIndex + 1) * (200 + 30 + 8) + 'px'
          obj.condition = each_branch.condition
          obj.name = each_branch.name
          if (currentPos.branches[currentBranchPos].type == "exp") {
            obj.exp_name = each_branch.name
          }

          lineObj.top = 8 + 32 + (currentBranchPos + 1) * (64 + 30 + 8) + 'px'
          lineObj.left = 200 + 30 / 2 + processIndex * (200 + 30 + 8) + 'px'
          lineObj.width = 200 / 2 + 30 + 'px'
          lineObj.vertical = false

          lineGroup.push(lineObj)

          currentBranchPos++

          group.push(obj)
        }

        if (currentPos.direct != null) {
          currentPos = currentPos.direct
          processIndex++
        } else {
          break
        }
      }

      this.processItems = group
      this.processLines = lineGroup
    },
    visualize() {
      if (this.parsedContent == '') {
        alert("Your EDL hasn't pass analyse, cannot proceed")

        return false
      }

      this.ifVisualize = true
      this.visualizeIndex = 0
      this.buildExpProcess(0)
    },
    analyse() {
      if (this.errorMessage != '') {
        alert('Please fix error(s) first before analyse')
      } else {
        let that = this
        let obj = {
          content: this.input
        }
        axios.post('http://127.0.0.1:12580/analyse', obj).then(function(res) {
          res = res.data
          that.ifAlreadyAlert = false
          if (!res.status) {
            let message = res.text
            alert(`Analyse failed: ${message}`)

            that.parsedContent = ''
            that.errorMessage = message
          } else {
            if (res.text == '') {
              alert('Analyse failed: Not EDL content')
            } else {
              that.ifAnalysed = true
              that.parsedContent = JSON.parse(res.text)
              alert('Analyse passed')
            }
          }
        }).catch(function(err) {
          console.log('error:', err)

          if (!that.ifAlreadyAlert) {
            that.ifAlreadyAlert = true

            alert('Cannot connect to server, analyse failed')
          }
        })
      }
    },
    no_visualize() {
      this.ifVisualize = false
    },
    previous() {
      this.visualizeIndex -= 1

      this.buildExpProcess(this.visualizeIndex)
    },
    next() {
      this.visualizeIndex += 1

      this.buildExpProcess(this.visualizeIndex)
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
      } else if (e.keyCode == 219 && !e.shiftKey) {
        e.preventDefault()
        let start = this.$refs.editor.selectionStart
        let end = this.$refs.editor.selectionEnd
        this.input = this.input.substr(0, start) + '[]' + this.input.substr(end)
        this.$nextTick(() => {
          this.$refs.editor.selectionStart = this.$refs.editor.selectionEnd = start + 1
        })
      } else if (e.keyCode == 222 && e.shiftKey) {
        e.preventDefault()
        let start = this.$refs.editor.selectionStart
        let end = this.$refs.editor.selectionEnd
        this.input = this.input.substr(0, start) + '""' + this.input.substr(end)
        this.$nextTick(() => {
          this.$refs.editor.selectionStart = this.$refs.editor.selectionEnd = start + 1
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
      let obj = {
        content: val
      }
      axios.post('http://127.0.0.1:12580/extract', obj).then(function(res) {
        res = res.data
        that.ifAlreadyAlert = false
        if (!res.status) {
          that.errorMessage = res.text
        } else {
          if (res.text == "") {
            that.errorMessage = "Error: Not EDL content"
            that.extractedContent = ""
          } else {
            that.errorMessage = ""
            that.extractedContent = JSON.parse(res.text)
          }
        }
      }).catch(function(err) {
        console.log('error:', err)

        if (!that.ifAlreadyAlert) {
          that.ifAlreadyAlert = true

          alert('Cannot connect to server, parse failed')
        }
      })
    },
    index: function(val) {
      let index = val
      if (index != -1) {
        let list = JSON.parse(localStorage.getItem('savedList'))
        this.saved = index
        this.input = list[index].content
        this.parsedContent = list[index].parsed
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

  margin-bottom: 16px;

  box-sizing: border-box;

  resize: none;
  outline: none;
}

p {
  margin-top: 8px;
  margin-bottom: 8px;
}

p span {
  color: blue;
  text-decoration: underline;

  margin-right: 8px;

  cursor: pointer;
}

input#target_input {
  width: 450px;
  height: 40px;

  margin-bottom: 16px;

  font-size: 1.2em;
  line-height: 40px;
}

.error-hint {
  color: #C51162;
}

.visualize-container {
  width: 100%;
  height: 60vh;

  background-color: #F5F5F5;

  margin-top: 32px;
  margin-bottom: 16px;

  overflow: hidden;
}

.attr-name {
  color: #90EE02;

  margin-right: 8px;
}

.exp-container {
  width: 300px;
  height: 60vh;

  float: left;
  overflow-x: hidden;
  overflow-y: scroll;

  position: relative;
}

.exp-item {
  width: 100%;
  height: 64px;

  line-height: 64px;
  font-size: 1.5em;
  color: #FFFFFF;

  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
  box-sizing: border-box;

  background-color: #6002EE;

  padding-left: 8px;
  padding-right: 8px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.exp-subitem {
  width: 100%;
  height: 48px;

  line-height: 48px;
  font-size: 1.2em;
  color: #FFFFFF;

  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
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
}

.exp-subitem-attr {
  width: 356px;
  height: 32px;

  line-height: 32px;
  color: #FFFFFF;

  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
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

.exp-process-container {
  width: calc(100% - 300px - 8px);
  height: 60vh;

  margin-left: 8px;

  overflow: hidden;

  float: left;
}

.exp-process-title {
  width: 100%;
  height: 48px;

  text-align: center;
  line-height: 48px;
  font-size: 1.2em;
  color: #90EE02;

  background-color: #021AEE;
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .2);
}

.exp-process-inner {
  width: 100%;
  height: calc(60vh - 48px);

  position: relative;

  overflow-x: scroll;
  overflow-y: scroll;
}

.process-item {
  width: 200px;
  height: 64px;

  line-height: 64px;
  color: #FFFFFF;

  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
  box-sizing: border-box;

  padding-left: 8px;

  background-color: #263238;

  position: absolute;
  overflow: hidden;

  z-index: 2;
}

.process-line {
  height: 2px;

  background-color: #757575;

  position: absolute;

  z-index: 1;
}

.process-condition {
  color: #DD2C00;
}

.process-vertical-line {
  width: 2px;

  background-color: #757575;

  position: absolute;

  z-index: 1;
}

.clickable {
  cursor: pointer;
}
</style>
