const randomButton = document.getElementById('random-test-button')
const searchText = document.getElementById('search-text')
const searchButton = document.getElementById('search-button')
const LOADING = '<img src="/image/loading.gif" alt="loading" style="height: 80%; width: auto;">'
let originBeforeLoading = ''

const loading = function (obj) {
  if (!originBeforeLoading) {
    originBeforeLoading = obj.innerHTML
    const width = obj.offsetWidth
    obj.innerHTML = LOADING
    obj.style.width = width + 'px'
  }
}

const search = function () {
  const text = searchText.value
  if (text) {
    window.location = '/search-result?search=' + text.trim()
  } else {
    window.location = './#'
  }
}

randomButton.addEventListener('click', function () {
  loading(randomButton)
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

export { loading }
