const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const photo = {
    id: 1,
    name: 'Photo Name',
    description: 'Photo description',
  };
  res.send(photo);
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}... `);
});
