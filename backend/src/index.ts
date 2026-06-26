import app from './app';

const PORT = process.env.PORT || 3001;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`[FlowPay Backend] Servidor rodando na porta ${PORT}`);
  console.log(`[FlowPay Backend] Health check disponível em http://localhost:${PORT}/health`);
});
