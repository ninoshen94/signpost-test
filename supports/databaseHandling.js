const { Pool } = require('pg')
const pool = new Pool({
  
  ssl: { rejectUnauthorized: false }
})

const exe = function (value, nextValue, obj) {
  if (!obj) {
    obj = {}
  }
  return ({
    questions: `INSERT INTO QUESTIONS (from_test, nullable, multi_choice, content) VALUES (1, false, false, '${value}')`,
    options: `INSERT INTO OPTIONS (from_question, content, comment) VALUES ($1, '${value}', '${nextValue}')`,
    results: `INSERT INTO RESULTS (from_test, name, title, content) VALUES (1, '${obj.name}', '${obj.title}', '${obj.content}')`
  })
}

const xlsx = require('node-xlsx')

const addQuestion = async function () {
  const sheets = xlsx.parse('questions.xlsx')
  for (const rowId in sheets[0].data) {
    const row = sheets[0].data[rowId]
    for (let coId = 0; coId < row.length; coId++) {
      const value = row[coId]
      const client = await pool.connect()
      if (coId === 0) {
        await client.query(exe(value).questions)
      } else {
        await client.query(exe(value, row[coId + 1]).options, [parseInt(rowId) + 1])
        coId++
      }
      client.release()
    }
  }
}

const addResult = async function () {
  const sheets = xlsx.parse('results.xlsx')
  for (const rowId in sheets[0].data) {
    const row = sheets[0].data[rowId]
    const data = {}
    data.name = row[0]
    data.title = row[1]
    data.content = row[2]
    const client = await pool.connect()
    console.log(exe(null, null, data).results)
    await client.query(exe(null, data).results)
    client.release()
  }
}

addQuestion()
