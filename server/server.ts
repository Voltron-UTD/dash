import express from 'express';
import bodyParser from 'body-parser';
import multiparty from 'multiparty';
import util from 'util';

// rest of the code remains same
const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.post('/api/pcd-upload', (req, res) => {
  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.write('received upload:\n\n');
    res.end(util.inspect({ fields: fields, files: files }));
  });

  return;
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});