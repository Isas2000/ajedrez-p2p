import { useState, useRef, useEffect } from 'react'; // 1. Importamos useRef y useEffect

function Chat({ mensajes = [], onEnviarMensaje, temaOscuro = false }) {
  const [texto, setTexto] = useState('');
  
  // 2. Creamos la referencia para el final del scroll
  const finalDelChatRef = useRef(null);

  function enviar() {
    if (!texto.trim()) return;
    onEnviarMensaje?.(texto);
    setTexto('');
  }

  // 3. Usamos useEffect para hacer scroll cuando cambia la lista de mensajes
  useEffect(() => {
    // Comprobamos que la referencia existe y hacemos scroll suave
    finalDelChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]); // Este efecto se ejecuta cada vez que 'mensajes' cambia

  const colores = temaOscuro
    ? { fondo: '#2E2E2E', texto: '#F0F0F0', borde: '#555', inputFondo: '#3D3D3D' }
    : { fondo: '#FFFFFF', texto: '#222', borde: '#ccc', inputFondo: '#FFFFFF' };

  return (
    <div
      style={{
        width: '250px',
        height: '500px',
        border: `1px solid ${colores.borde}`,
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        backgroundColor: colores.fondo,
        color: colores.texto,
      }}
    >
      {/* CONTENEDOR DE MENSAJES (con direction 'column' como acordamos) */}
      <div
        style={{
          height: 0,
          flex: 1,
          overflowY: 'auto',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column', // Flujo normal arriba-abajo
          justifyContent: 'flex-start',
          paddingRight: '5px',
        }}
      >
        {mensajes.map((m, i) => (
          <p key={i} style={{ margin: '4px 0', wordBreak: 'break-word' }}>
            <strong>{m.autor}:</strong> {m.texto}
          </p>
        ))}
        
        {/* 4. Elemento vacío invisible justo al final de la lista */}
        {/* Esta es el "ancla" a la que haremos scroll */}
        <div ref={finalDelChatRef} />
      </div>

      {/* Área de input (sin cambios) */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            minWidth: 0,
            padding: '8px',
            borderRadius: '6px',
            border: `1px solid ${colores.borde}`,
            backgroundColor: colores.inputFondo,
            color: colores.texto,
          }}
        />
        <button
          onClick={enviar}
          style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#4A4A4A', color: 'white', cursor: 'pointer' }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;