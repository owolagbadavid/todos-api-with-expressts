import { client } from './db';

global.beforeAll(async () => {
  await client.connect();
});

global.afterAll(async () =>{
  await client.close();
});
