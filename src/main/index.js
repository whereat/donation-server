import app from './app';

const server = app.listen(3000, () => {
  const { address: host, port } = server.address();
  console.log(`App listening at http://${host}:${port}`);
});
