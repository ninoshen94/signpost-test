const express = require('express')
const { Pool } = require('pg')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const resultHandler = require('./resultHandler.js')
const path = require('path')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const app = express()
const port = process.env.PORT || 8080
const css = []
const DEFAULT_TEST_IMAGE = 'icon1-2.png'

css.push('style.css')

app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'image', 'favicon.ico')))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.get('/', function (request, response) {
  response.render('pages/index', {
    css: css,
    name: 'Home'
  })
})

app.get('/interesting-tests', async function (request, response) {
  const client = await pool.connect()
  const data = await client.query('SELECT * FROM TESTS WHERE category = 0')
  const tests = data.rows
  Object.keys(tests).forEach(function (id) {
    if (!tests[id].image) {
      tests[id].image = DEFAULT_TEST_IMAGE
    }
  })
  css.push('interesting-tests.css')
  response.render('pages/interesting-tests', {
    css: css,
    name: 'interesting-tests',
    tests: tests
  })
  css.splice(css.length - 1, 1)
  client.release()
})

app.get('/result-page', async function (request, response) {
  const test = request.query.test
  const name = request.query.name
  if (!test || !name) {
    response.status(400).end('bad query')
    return
  }
  let client
  try {
    client = await pool.connect()
    const testId = await client.query('SELECT id FROM TESTS WHERE name = $1', [test])
    if (testId.rowCount === 0) {
      response.status(400).end('bad query')
      return
    }
    const data = await client.query('SELECT * FROM RESULTS WHERE from_test = $1 AND name = $2',
      [testId.rows[0].id, name])
    if (data.rowCount !== 1) {
      response.status(400).end('bad query')
      return
    }
    css.push('result-page.css')
    response.render('pages/result-page', {
      css: css,
      name: 'result-page',
      result: data.rows[0],
      test: test
    })
    css.splice(css.length - 1, 1)
  } finally {
    if (client) {
      client.release()
    }
  }
})

app.get('/test-page', async function (request, response) {
  const test = request.query.test
  if (Object.keys(request.query).length !== 1 || !test) {
    response.json({
      error: 'bad query'
    })
    return
  }

  let client
  try {
    const client = await pool.connect()
    const testId = await (await client.query('SELECT id FROM TESTS WHERE name = $1', [test])).rows[0].id

    if (testId.rowCount === 0) {
      response.status(400).end('bad query')
      return
    }

    const questions = await (await client.query('SELECT * FROM QUESTIONS WHERE from_test = $1', [parseInt(testId)])).rows
    const data = []
    for (const obj in questions) {
      const temp = {}
      temp.questions = questions[obj].content
      temp.options = (await client.query('SELECT * FROM OPTIONS WHERE from_question = $1', [questions[obj].question_id])).rows
      data.push(temp)
    }
    css.push('test-page.css')
    response.render('pages/test-page', {
      css: css,
      name: 'test-page',
      data: data,
      test: test
    })
    css.splice(css.length - 1, 1)
  } finally {
    if (client) {
      client.release()
    }
  }
})

app.get('/random-test', async function (request, response) {
  const client = await pool.connect()
  const data = await client.query('SELECT name FROM TESTS')
  const count = data.rows.length
  const randomIndex = Math.floor(count * Math.random())
  const testName = data.rows[randomIndex].name
  response.redirect('/test-page?test=' + testName)
  client.release()
})

// This is temporary search page. In the future it will be combined with interesting-tests and scientific-tests.
app.get('/search-result', async function (request, response) {
  const toSearch = request.query.search
  if (!toSearch || Object.keys(request.query).length !== 1) {
    response.status(400).json({
      error: 'bad query'
    })
    return
  }
  const client = await pool.connect()
  const data = await client.query(`SELECT * FROM tests WHERE name LIKE '%${toSearch}%'`)
  const tests = data.rows
  Object.keys(tests).forEach(function (id) {
    if (!tests[id].image) {
      tests[id].image = DEFAULT_TEST_IMAGE
    }
  })
  css.push('interesting-tests.css')
  response.render('pages/search-result', {
    css: css,
    name: 'search-result',
    tests: tests
  })
  css.splice(css.length - 1, 1)
  client.release()
})

app.post('/getResult/:test', async function (request, response) {
  if (!resultHandler[request.params.test]) {
    response.json({
      error: 'There has no such a test!'
    })
    return
  }
  const result = await resultHandler[request.params.test](request.body)
  response.json(result)
})

app.listen(port)
