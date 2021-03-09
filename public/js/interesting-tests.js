const buttons = document.getElementsByClassName('test-button')

const enterTest = function (button) {
  const testName = button.value
  window.location = '/test-page?test=' + testName
}

Object.keys(buttons).forEach(function (id) {
  buttons[id].addEventListener('click', function () {
    enterTest(buttons[id])
  })
})
