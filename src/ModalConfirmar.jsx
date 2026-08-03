function ModalConfirmar({ visible, mensaje, onAceptar, onCancelar, soloAceptar = false }) {
  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white', padding: '24px', borderRadius: '10px',
        maxWidth: '360px', textAlign: 'center',
      }}>
        <p style={{ marginBottom: '20px' }}>{mensaje}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onAceptar} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: '#B03A2E', color: 'white', cursor: 'pointer' }}>
            {soloAceptar ? 'Volver al inicio' : 'Aceptar'}
          </button>
          {!soloAceptar && (
            <button onClick={onCancelar} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmar;