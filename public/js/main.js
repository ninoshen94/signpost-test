const randomButton = document.getElementById('random-test-button')
const searchText = document.getElementById('search-text')
const searchButton = document.getElementById('search-button')

const search = function () {
  const text = searchText.value
  if (text) {
    window.location = '/search-result?search=' + text.trim()
  }
}

randomButton.addEventListener('click', function () {
  window.location = '/random-test'
})

searchButton.addEventListener('click', function () {
  search()
})

searchText.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    search()
  }
})
