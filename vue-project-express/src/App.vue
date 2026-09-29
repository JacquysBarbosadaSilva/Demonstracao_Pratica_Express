<template>
  <div class="salão">
    <h1>Cardápio</h1>

    <div class="envio"">
      <div class=" pedido-container">
      <div class="pedido">
        <input v-model="novoPedido" @keyup.enter="fazerPedido" placeholder="Qual o seu pedido?" />
        <button @click="fazerPedido">Pedir</button>
      </div>


      <ul>
        <li v-for="pedido in pedidos" :key="pedido.id">
          {{ pedido.nome }}
          <button @click="deletarPedido(pedido.id)" class="btn-deletar">Excluir</button>
        </li>
      </ul>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const pedidos = ref([]);
const novoPedido = ref('');

const carregarpedidos = async () => {
  const resposta = await fetch('/api/pedidos');
  pedidos.value = await resposta.json();
};

const fazerPedido = async () => {
  if (novoPedido.value.trim() === '') return;

  await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: novoPedido.value })
  });

  novoPedido.value = '';
  carregarpedidos();
};

const deletarPedido = async (id) => {
  await fetch(`/api/pedidos/${id}`, {
    method: 'DELETE'
  });

  carregarpedidos();
};

onMounted(() => {
  carregarpedidos();
});
</script>

<style scoped>
.salão {
  font-family: sans-serif;
  text-align: center;
  margin-top: 40px;
}

.envio {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pedido-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.pedido {
  margin-bottom: 20px;
  width: 100%;
}

.btn-deletar {
  background-color: #ff4d4d;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.btn-deletar:hover {
  background-color: #cc0000;
}

input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #4C0082;
  border: none;
  cursor: pointer;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}

ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

li {
  background: #f4f4f4;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
}
</style>