import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Configurar CORS
app.use(cors());

// Parser para JSON
app.use(express.json());

// Registrar rotas
app.use(routes);

// Endpoint GET /health
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok'
  });
});

export default app;
