import { loading } from './main.js'
const submitButton = document.getElementById('submit')
const inputs = document.getElementsByTagName('input')
const quesContainers = document.getElementsByClassName('ques')
const readyButton = document.getElementById('ready')
const questionArea = document.getElementById('question-area')

// Get how many questions are there.
let questions = 0
while (document.getElementsByName(questions).length !== 0) {
  questions++
}

let thisTest
window.onload = function () {
  thisTest = document.getElementById('error').innerHTML
}
const totalChecked = []

const ajaxObject = function ajaxObject () {
  let xmlHttp
  try {
    // Firefox, Opera 8.0+, Safari and Chrome
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
  const count = options.length
  for (let i = 0; i < options.length; i++) {
    const optionGroup = options[i]
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
    const remained = count - totalChecked.length
    errorMessage('Please make sure each required field is chosen. ' + remained + ' required questions remain. <br>Pay attention to the gray indicators at the right of each question.')
    return false
  }
  return true
}

const scrollTo = function (position, step) {
  const a = document.getElementsByName(position)[0]
  const current = document.documentElement.scrollTop
  const toTop = a.offsetTop
  const length = current - toTop
  let locationInterval
  if (length >= 0) {
    locationInterval = setInterval(() => {
      const speed = length / step
      if (document.documentElement.scrollTop >= toTop) {
        document.documentElement.scrollTop -= speed
        step += 2
      } else {
        clearInterval(locationInterval)
      }
    }, 30)
  } else {
    locationInterval = setInterval(() => {
      const speed = length / step
      if (document.documentElement.scrollTop <= toTop) {
        document.documentElement.scrollTop -= speed
        step += 2
      } else {
        clearInterval(locationInterval)
      }
    }, 30)
  }
}

const errorMessage = function (content) {
  const error = document.getElementById('error')
  error.innerHTML = content
  error.style.display = 'block'
  scrollTo('error', 10)
}

const removeErrorMessage = function () {
  const error = document.getElementById('error')
  error.style.display = 'none'
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
  loading(submitButton)
  ajaxPost('/getResult/' + thisTest, groups[0])
}

const initalize = function (obj) {
  if (!obj.beforeHeight) {
    obj.beforeHeight = obj.offsetHeight - 15
  }
  const block = obj.children[0]
  const firstChild = block.children[0]
  const secondChild = block.children[1]
  const fcHeight = firstChild.offsetHeight + 40
  secondChild.style.visibility = 'hidden'
  obj.style.height = fcHeight + 'px'
}

const extend = function (obj) {
  const block = obj.children[0]
  const secondChild = block.children[1]
  obj.style.height = obj.beforeHeight + 'px'
  secondChild.style.visibility = 'visible'
}

const confirmIndicator = function (obj) {
  const group = document.getElementsByName(obj.name)
  let target = obj
  while (!(target.className && (target.className.split(' ').includes('ques')))) {
    target = target.parentNode
  }
  target = target.children[1]
  const currentSelected = target.className.split(' ').includes('selected')
  let selected = false
  for (let i = 0; i < group.length; i++) {
    if (group[i].checked) {
      selected = true
      break
    }
  }
  if (currentSelected !== selected) {
    if (currentSelected) {
      const classArray = target.className.split(' ')
      target.className = classArray.splice(classArray.indexOf('selected'), 1).join(' ')
      totalChecked.splice(totalChecked.indexOf(target.name), 1)
      checkProgress()
    } else {
      target.className += ' selected'
      totalChecked.push(target.name)
      checkProgress()
    }
  }
}

const checkProgress = function () {
  const current = totalChecked.length
  const total = questions
  const ratio = current / total
  const progressSpan = document.getElementById('progress')
  let percentage = (ratio * 100).toFixed(2)
  const progressBar = progressSpan.parentNode.parentNode
  progressBar.style.width = percentage + '%'
  if (percentage >= 10) {
    if (percentage >= 100) {
      percentage = '100'
    } else {
      percentage = parseFloat(percentage).toFixed(1)
    }
  }
  progressSpan.innerHTML = percentage + '%'
}

const ready = function () {
  readyButton.style.display = 'none'
  questionArea.className = ''
  scrollTo('begin', 5)
  startTimer()
}

const startTimer = function () {
  const timer = document.getElementById('timer')
  const container = timer.parentNode.parentNode
  const beforeOpacity = container.style.opacity
  const estimate = document.getElementById('estimate-time')
  container.style.opacity = '100%'
  setTimeout(() => {
    container.style.opacity = beforeOpacity
  }, 3000)
  let timeCurrent = timer.innerHTML
  const clock = setInterval(() => {
    timeCurrent = nextSecond(timeCurrent, clock)
    checkTimeValidation(timeCurrent, estimate.innerHTML)
    timer.innerHTML = timeCurrent
  }, 1000)
}

const checkTimeValidation = function (cur, est) {
  est = parseInt(est.split(':').join(''))
  cur = parseInt(cur.split(':').join(''))
  if (est < cur) {
    const timer = document.getElementById('timer')
    timer.style.color = 'red'
  }
}

const nextSecond = function (time, interval) {
  time = time.split(':')
  let hh = time[0]
  let mm = time[1]
  let ss = time[2]
  ss++
  if (ss === 60) {
    mm++
    if (mm < 10) {
      mm = '0' + mm
    }
    ss = '00'
  }
  if (mm === 60) {
    hh++
    mm = '00'
  }
  if (hh === 10) {
    clearInterval(interval)
    return '-:--:--'
  }

  ss = ss < 10 && ss !== '00' ? '0' + ss : ss

  return hh + ':' + mm + ':' + ss
}

submitButton.addEventListener('click', submit)

readyButton.addEventListener('click', ready)

Object.keys(inputs).forEach(function (id) {
  inputs[id].addEventListener('change', function () {
    removeErrorMessage()
    confirmIndicator(inputs[id])
  })
})

Object.keys(quesContainers).forEach(function (id) {
  initalize(quesContainers[id])
  quesContainers[id].addEventListener('mouseover', function () {
    extend(quesContainers[id])
  })
  quesContainers[id].addEventListener('mouseout', function () {
    initalize(quesContainers[id])
  })
})
