const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const css = []

css.push('style.css')

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', function (request, response) {
  response.render('pages/index', {
    css: css,
    name: 'Home'
  })
})

app.get('/:route', function (request, response) {
  css.push(request.params.route + '.css')
  response.render('pages/' + request.params.route, {
    css: css,
    name: request.params.route
  })
  css.splice(css.length - 1, 1)
})

app.listen(port)
