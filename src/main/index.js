import app from './app';

//TODO: insert mongo connection here a la
// https://github.com/madhums/node-express-mongoose-demo/blob/master/server.js

//TODO: be sure to set mongoose.Promise = Promise


const server = app.listen(3000, () => {
  const { address: host, port } = server.address();
  console.log(`App listening at http://${host}:${port}`);
});
