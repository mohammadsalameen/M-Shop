import express from 'express'
import initApp from './app.router.js';
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT || 6000;

initApp(app, express);

app.listen(PORT, () => console.log(`server is running... at ${PORT}`))


