import { useState, useRef, useEffect } from 'react';
import { Peer } from 'peerjs';
import Sala from './Sala';
import Tablero from './Tablero';
import Chat from './Chat';
import ModalConfirmar from './ModalConfirmar';

function App() {
  const [pantalla, setPantalla] = useState('sala');
  const [miColor, setMiColor] = useState(null);
  const [codigoGenerado, setCodigoGenerado] = useState(null);
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [mostrarModalSalir, setMostrarModalSalir] = useState(false);
  const [movimientoRecibido, setMovimientoRecibido] = useState(null);
  const [rivalDesconectado, setRivalDesconectado] = useState(false);

  // Referencias para mantener las instancias vivas sin renderizar el componente de más
  const peerRef = useRef(null);
  const conexionRef = useRef(null);

  // Limpiar peer al desmontar el componente si es necesario
  useEffect(() => {
    return () => {
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  function crearSala() {
    setMiColor('white');
    const nuevoPeer = new Peer();
    peerRef.current = nuevoPeer;

    nuevoPeer.on('open', (id) => {
      setCodigoGenerado(id);
    });

    nuevoPeer.on('connection', (conn) => {
      conexionRef.current = conn;
      configurarConexion();
      setPantalla('juego');
    });
  }

  function unirseSala(codigo) {
    setMiColor('black');
    const nuevoPeer = new Peer();
    peerRef.current = nuevoPeer;

    nuevoPeer.on('open', () => {
      const conn = nuevoPeer.connect(codigo);
      conexionRef.current = conn;
      configurarConexion();
      setPantalla('juego');
    });
  }

  function configurarConexion() {
    const conn = conexionRef.current;
    if (!conn) return;

    conn.on('data', (data) => {
      if (data.tipo === 'movimiento') {
        setMovimientoRecibido(data.datos);
      } else if (data.tipo === 'chat') {
        setMensajes((prev) => [...prev, { texto: data.datos.texto, autor: data.datos.autor }]);
      }
    });
    conn.on('close', () => {
    setRivalDesconectado(true);
  });
  }

  function salirPorDesconexion() {
  if (peerRef.current) {
    peerRef.current.destroy();
  }
  setRivalDesconectado(false);
  setPantalla('sala');
  setMiColor(null);
  setCodigoGenerado(null);
  setMensajes([]);
  setMovimientoRecibido(null);
}
    
  

  function enviarMovimiento(movimiento) {
    if (conexionRef.current && conexionRef.current.open) {
      conexionRef.current.send({ tipo: 'movimiento', datos: movimiento });
    }
  }

  function enviarMensajeChat(texto) {
    // Añadir mensaje propio a la vista local
    setMensajes((prev) => [...prev, { texto, autor: 'yo' }]);

    // Enviar al rival por P2P
    if (conexionRef.current && conexionRef.current.open) {
      conexionRef.current.send({
        tipo: 'chat',
        datos: { texto, autor: 'rival' }
      });
    }
  }

  function confirmarSalida() {
    if (conexionRef.current) {
      conexionRef.current.close();
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setMostrarModalSalir(false);
    setPantalla('sala');
    setMiColor(null);
    setCodigoGenerado(null);
    setMensajes([]);
    setMovimientoRecibido(null);
  }

  if (pantalla === 'sala') {
    return <Sala onCrearSala={crearSala} onUnirseSala={unirseSala} codigoGenerado={codigoGenerado} />;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Ajedrez P2P</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0 20px' }}>
        <button onClick={() => setTemaOscuro(!temaOscuro)} style={estiloBoton}>
          Cambiar tema
        </button>
        <button onClick={() => setMostrarModalSalir(true)} style={{ ...estiloBoton, backgroundColor: '#B03A2E' }}>
          Salir de la partida
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <Tablero
            miColor={miColor}
            temaOscuro={temaOscuro}
            onEnviarMovimiento={enviarMovimiento}
            movimientoRecibido={movimientoRecibido}
          />
        </div>
        <Chat
          mensajes={mensajes}
          onEnviarMensaje={enviarMensajeChat}
          temaOscuro={temaOscuro}
        />
      </div>

      <ModalConfirmar
        visible={mostrarModalSalir}
        mensaje="¿Estás seguro de salir de la partida? Si te sales se concluirá como terminada."
        onAceptar={confirmarSalida}
        onCancelar={() => setMostrarModalSalir(false)}
      />

      <ModalConfirmar
        visible={rivalDesconectado}
        mensaje="Tu rival abandonó la partida."
        onAceptar={salirPorDesconexion}
        soloAceptar={true}
      />
    </div>
  );
}

const estiloBoton = {
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#4A4A4A',
  color: 'white',
  cursor: 'pointer',
};

export default App;
