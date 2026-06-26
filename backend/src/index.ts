import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS
app.use(cors());

// Parser para JSON se necessário no futuro
app.use(express.json());

// Endpoint GET /health
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'flowpay-attendance-api'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`[FlowPay Backend] Servidor rodando na porta ${PORT}`);
  console.log(`[FlowPay Backend] Health check disponível em http://localhost:${PORT}/health`);
});
