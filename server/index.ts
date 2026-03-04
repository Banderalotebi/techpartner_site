import express, { Request, Response, NextFunction } from 'express';
import api from './api';

const app = express();

app.use('/api', api);

app.use(express.json());

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = parseInt(process.env.PORT || '3000', 10);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
