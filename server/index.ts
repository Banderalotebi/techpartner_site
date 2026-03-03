import express from 'express';
import api from './api';

const app = express();

app.use('/api', api);

app.use(express.json());

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
