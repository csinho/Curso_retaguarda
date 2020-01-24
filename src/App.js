import React, { useState, useEffect } from 'react';
import api from './services/api'

import './global.css';
import './app.css';
import './sidebar.css';
import './main.css';


// Componente: Bloco isolado de HTML, CSS E JAVASCRIPT, o qual não interfere no restante da aplicação
// Propriedade: Informações que um componente PAI passa para o componente FILHO
// Estado: Informações mantidas pelo componente


function App() {

  const [devs, setDevs] = useState([]);

  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);

      },
      (erro) => {
        console.log(erro)
      },
      {
        timeout: 30000,
      }
    )
  }, []);

  useEffect(() => {
    async function carregaDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    carregaDevs();
  }, []);


  async function adicionandoDev(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude
    })
    setGithub_username('');
    setTechs('');

    setDevs([...devs, response.data]);

  }


  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={adicionandoDev}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do GitHub</label>
            <input
              name="github_username"
              id="github_username"
              required
              value={github_username}
              onChange={e => setGithub_username(e.target.value)}
            />
          </div>
          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input
              name="techs"
              id="techs"
              required
              value={techs}
              onChange={e => setTechs(e.target.value)}
            />
          </div>

          <div className="input-group">

            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                name="latitude"
                id="latitude"
                required
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                name="longitude"
                id="longitude"
                required value={longitude}
                onChange={e => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <button type="submit">Salvar</button>

        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <li key={dev._id} className="dev-item">
            <header>
              <img src={dev.avatar_url} alt={dev.name} />
              <div className="user-info">
                <strong>{dev.name}</strong>
                <strong>{dev.techs.join(', ')}</strong>
              </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`}>Acessar Perfil no GitHub</a>
          </li>
          ))}          
        </ul>
      </main>
    </div>
  );
}

export default App;
