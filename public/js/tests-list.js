import { loading } from './main.js'
const buttons = document.getElementsByClassName('test-button')
const query = window.location.search

const enterTest = function (button) {
  const testName = button.value
  window.location = '/test-page?test=' + testName
}

if (query) {
  const term = query.substr(query.lastIndexOf('=') + 1).replace('%20', ' ').toLowerCase()
  const termLength = term.length
  const elements = document.getElementsByClassName('search-period')
  const OPENTAG = '<span class="highlighted">'
  const CLOSETAG = '</span>'
  if (elements.length) {
    Object.keys(elements).forEach(function (id) {
      let newContent = ''
      let oldContent = elements[id].innerHTML
      let index = oldContent.toLowerCase().search(term)
      while (index !== -1) {
        newContent += oldContent.substring(0, index)
        newContent += OPENTAG
        newContent += oldContent.substring(index, index + termLength)
        newContent += CLOSETAG
        oldContent = oldContent.substr(index + termLength)
        index = oldContent.toLowerCase().search(term)
      }
      newContent += oldContent
      elements[id].innerHTML = newContent
    })
  }
}

Object.keys(buttons).forEach(function (id) {
  buttons[id].addEventListener('click', function () {
    enterTest(buttons[id])
    loading(buttons[id])
  })
})
