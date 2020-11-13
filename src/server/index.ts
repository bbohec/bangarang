import * as path from 'path';
import * as express from 'express'
import { body } from '../ui';



const app = express();

app.get('/',(request,response)=> {
    response.send(body)
})
app.get('/index.js',(request,response)=> {
    response.sendStatus(404)
})
const port = 'port';
app.set(port, process.env.PORT || 3000);
const server = app.listen(app.get(port), ()=> console.log(`listening on port ${app.get(port)}`));