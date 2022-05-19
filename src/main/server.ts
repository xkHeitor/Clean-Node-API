import express, { Express } from 'express';

const app: Express = express();
const port: number = 5050;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));