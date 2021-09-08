import express from 'express';
import * as path from 'path';

const app = express();
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');

app.use(express.static(root));

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
