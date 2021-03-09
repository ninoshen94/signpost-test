const mbti = async function (data) {
  const list = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
  const result = {}
  const judge = function (leftData, rightData) {
    let result
    if (leftData > rightData) {
      result = 0
    } else if (leftData < rightData) {
      result = 1
    } else {
      const random = Math.random()
      if (random < 0.5) {
        result = 0
      } else {
        result = 1
      }
    }
    return result
  }
  list.forEach(element => {
    if (!data[element]) {
      data[element] = 0
    }
  })

  const EI = judge(data.E, data.I) === 0 ? 'E' : 'I'
  const SN = judge(data.S, data.N) === 0 ? 'S' : 'N'
  const TF = judge(data.T, data.F) === 0 ? 'T' : 'F'
  const JP = judge(data.J, data.P) === 0 ? 'J' : 'P'
  result.test = 'MBTI'
  result.name = EI + SN + TF + JP
  console.log(data)
  return result
}

module.exports = {
  MBTI: mbti
}
