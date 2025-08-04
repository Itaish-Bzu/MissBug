import express from 'express'
 const app = express() 

 app.get('/', (req, res) => res.send('Hello')) 






 const port = 3030
 app.listen(port, () => console.log(`Server ready at http://127.0.0.1:${port}/`))