const leadToTest = function () {
  window.location.href = '/test-page'
}

// temporary event adding function
for (let i = 0; i < 5; i++) {
  document.getElementById('mbti' + i).addEventListener('click', leadToTest)
}
