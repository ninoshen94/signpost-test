const submitButton = document.getElementById('submit')
const inputs = document.getElementsByTagName('input')
let thisTest
window.onload = function () {
  thisTest = document.getElementById('error').innerHTML
}

const ajaxObject = function ajaxObject () {
  let xmlHttp
  try {
    // Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest()
  } catch (e) {
    window.alert('Please use Firefox, Opera 8.0+, Chrome or Safari to browse.')
    return null
  }
  return xmlHttp
}

function ajaxPost (url, data) {
  const ajax = ajaxObject()
  ajax.open('POST', url, true)
  ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
  ajax.onreadystatechange = async function () {
    if (ajax.readyState === 4) {
      if (ajax.status === 200) {
        const response = await JSON.parse(ajax.responseText)
        if (response.error) {
          window.alert('Error')
          window.location = '/'
          return
        }
        window.location = '/result-page?test=' + response.test + '&name=' + response.name
      }
    }
  }
  ajax.send(JSON.stringify(data))
}

const handleOptions = function (options) {
  const groups = {}
  let count = 0
  for (let i = 0; i < options.length; i++) {
    const optionGroup = options[i]
    count++
    for (let j = 0; j < optionGroup.length; j++) {
      const option = optionGroup[j]
      if (option.checked) {
        if (groups[option.value]) {
          groups[option.value]++
        } else {
          groups[option.value] = 1
        }
      }
    }
  }
  return [groups, count]
}

const checkValidation = function (group, count) {
  let currentCount = 0
  Object.keys(group).forEach(function (id) {
    if (group[id] === count) {
      errorMessage('It\'s not allowed to choose the same option in all fields.')
      return false
    }
    currentCount += group[id]
  })
  if (currentCount !== count) {
    errorMessage('Please make sure each required field is chosen.')
    return false
  }
  return true
}

const errorMessage = function (content) {
  const error = document.getElementById('error')
  error.innerHTML = content
  error.style.visibility = 'visible'
}

const removeErrorMessage = function () {
  const error = document.getElementById('error')
  error.style.visibility = 'hidden'
}

const submit = function () {
  let name = 0
  const options = []
  while (document.getElementsByName(name).length !== 0) {
    options.push(document.getElementsByName(name))
    name++
  }
  const groups = handleOptions(options)
  if (!checkValidation(groups[0], groups[1])) {
    return
  }
  ajaxPost('/getResult/' + thisTest, groups[0])
}

submitButton.addEventListener('click', submit)

Object.keys(inputs).forEach(function (input) {
  inputs[input].addEventListener('change', removeErrorMessage)
})
