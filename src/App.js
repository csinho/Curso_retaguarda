import React, { useState, useEffect } from 'react';
import api from './services/api'

import './global.css';
import './app.css';
import './sidebar.css';
import './main.css';

import DevForm from './pages/DevForm'
import DevItem from './pages/DevItem'

// Componente: Bloco isolado de HTML, CSS E JAVASCRIPT, o qual não interfere no restante da aplicação
// Propriedade: Informações que um componente PAI passa para o componente FILHO
// Estado: Informações mantidas pelo componente

function App() {

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function carregaDevs() {
      const response = await api.get('/devs');
      setDevs(response.data);
    }
    carregaDevs();
  }, []);

  async function adicionandoDev(data) {
    const response = await api.post('/devs', data)  
    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={adicionandoDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
           <DevItem key={dev._id} dev={dev} />
          ))}          
        </ul>
      </main>
    </div>
  );
}

export default App;
