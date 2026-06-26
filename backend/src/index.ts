import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`[FlowPay Backend] Servidor rodando na porta ${PORT}`);
  console.log(`[FlowPay Backend] Health check disponível em http://localhost:${PORT}/health`);
});
