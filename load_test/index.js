var axios = require('axios')

var config = {
   method: 'get',
   url: 'http://localhost:80/user',
   headers: {
      Authorization:
         'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqdWxpYW5vQGVtYWlsLmNvbSIsIm5hbWUiOiJKdWxpYW5vIiwicGFzc3dvcmQiOiIkMmEkMTAkRm5VZ3JRUXNuc1FBN0V0aW9zSXZyT2FGdW9UMXl1VzguLk5WYlo1c000STNaOWtTRWUvNDYiLCJiaXJ0aERhdGUiOiIxOTkzLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJhZG1pbiI6ZmFsc2UsImlldCI6MTY0Njk2MDAwMywiZXhwIjoxNjQ3MDQ2NDAzfQ.Ug2FJ1lCTiFUSfPY6i9lAbKVzuFrceCUpsjy40a8sB0'
   }
}

test(300)
function test(reqPerSecond) {
   let reqAmount = 0
   setInterval(() => {
      axios(config)
         .then(function (response) {
            // console.log(JSON.stringify(response.data))
         })
         .catch(error => {
            console.log(error.code)
         })
      reqAmount++
      if (reqAmount % reqPerSecond == 0) {
         console.log(reqAmount)
      }
   }, 1000 / reqPerSecond)
}
