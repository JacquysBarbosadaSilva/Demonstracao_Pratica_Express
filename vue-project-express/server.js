import express from 'express';

const app = express();
app.use(express.json());

let pedidos = [];

app.get('/api/pedidos', (req, res) => {
  res.json(pedidos);
});

app.post('/api/pedidos', (req, res) => {
  const novoPedido = {
    id: Date.now(),
    nome: req.body.nome
  };
  pedidos.push(novoPedido);
  res.status(201).json(novoPedido);
});

app.delete('/api/pedidos/:id', (req, res) => {
  const idDoPedido = parseInt(req.params.id);

  pedidos = pedidos.filter(Pedido => Pedido.id !== idDoPedido);
  
  res.json({ mensagem: 'Pedido devorado com sucesso, mano!' });
});

app.listen(3000, () => {
  console.log('Running!');
});