import React, { useState, useEffect } from 'react';
import './App.css';

const ALL_CHARACTERS = [
  "Susanita", 
  "Las_tetonas", 
  "cinema", 
  "melendi_prime", 
  "hartura", 
  "jonni_la_conozco", 
  "perruqueria",
  "sir_Sergio"
];

function App() {
  const [menuPosition, setMenuPosition] = useState(null);
  const [clickCoords, setClickCoords] = useState(null);
  const [targetCharacters, setTargetCharacters] = useState([]);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [notification, setNotification] = useState(null);
  
  // Estado para controlar si el modal está abierto
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...ALL_CHARACTERS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setTargetCharacters(selected);
    setFoundCharacters([]);
    setNotification(null);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = e.target.naturalWidth / rect.width;
    const scaleY = e.target.naturalHeight / rect.height;

    const x = Math.round(clickX * scaleX);
    const y = Math.round(clickY * scaleY);

    setClickCoords({ x, y });
    setMenuPosition({
      top: e.clientY,
      left: e.clientX,
    });
  };

  const handleCharacterSelect = async (characterName) => {
    try {
      const response = await fetch('http://localhost:3000/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: characterName,
          x: clickCoords.x,
          y: clickCoords.y
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(`🎉 ¡Increíble! Has encontrado a ${characterName}.`, 'success');
        const updatedFound = [...foundCharacters, characterName];
        setFoundCharacters(updatedFound);

        if (updatedFound.length === targetCharacters.length) {
          setTimeout(() => {
            showNotification("🏆 ¡FELICIDADES! Has completado todos los objetivos de la partida.", 'victory');
          }, 500);
        }
      } else {
        showNotification(`❌ Ups, por ahí no está ${characterName}. ¡Sigue buscando!`, 'error');
      }

    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      showNotification("⚠️ No se pudo conectar con el servidor backend.", 'error');
    }

    setMenuPosition(null);
  };

  const availableDropdownChars = targetCharacters.filter(char => !foundCharacters.includes(char));

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f4f6f8', 
      textAlign: 'center', 
      padding: '20px', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' 
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>🔍 ¿Dónde están las puchainas?</h1>


      {/* BOTONERA SUPERIOR */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowModal(true)}
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            background: '#2c3e50', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            marginRight: '10px'
          }}
        >
          🖼️ Ver Caras / Objetivos Grandes
        </button>

        <button 
          onClick={startNewGame}
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            background: '#3498db', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 10px rgba(52, 152, 219, 0.2)'
          }}
        >
          🔄 Cambiar Partida
        </button>
      </div>

      {/* ========================================================== */}
      {/* 🖼️ MODAL GIGANTE PARA VER LAS FOTOS EN GRANDE              */}
      {/* ========================================================== */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
            maxWidth: '750px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#2c3e50', marginTop: 0, fontSize: '26px' }}>Objetivos de esta ronda</h2>
            <p style={{ color: '#7f8c8d', fontSize: '16px', marginBottom: '30px' }}>Inspecciona bien las fotos para encontrarlos en el mapa:</p>

            {/* CONTENEDOR DE LAS TARJETAS GRANDES */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', flexWrap: 'wrap', marginBottom: '35px' }}>
              {targetCharacters && targetCharacters.map((char) => {
                const isFound = foundCharacters.includes(char);
                const imagePath = `/${char.toLowerCase()}.jpg`;

                return (
                  <div 
                    key={char} 
                    style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '20px', 
                      borderRadius: '16px', 
                      background: isFound ? '#e8f8f5' : '#f8f9fa',
                      border: `3px solid ${isFound ? '#2ecc71' : '#cbd5e1'}`,
                      color: isFound ? '#27ae60' : '#2c3e50',
                      width: '180px'
                    }}
                  >
                    {/* FOTO AMPLIADA (120px x 120px) */}
                    <img 
                      src={imagePath} 
                      alt={char}
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        objectFit: 'cover', 
                        borderRadius: '12px', 
                        border: '2px solid #94a3b8',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{char.replace(/_/g, ' ')}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{isFound ? '✅ Encontrado' : '🔍 Buscando'}</span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setShowModal(false)}
              style={{ 
                padding: '12px 30px', 
                cursor: 'pointer', 
                background: '#e74c3c', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
              }}
            >
              Cerrar y Jugar
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICACIÓN FLOTANTE */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: notification.type === 'error' ? '#e74c3c' : notification.type === 'victory' ? '#f1c40f' : '#2ecc71',
          color: notification.type === 'victory' ? '#2c3e50' : '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 4000,
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {notification.message}
        </div>
      )}

      {/* ZONA DEL MAPA / IMAGEN */}
      <div className="image-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
        <img 
          src="/imagenWally.png" 
          alt="Where's Waldo Board" 
          onClick={handleImageClick}
          style={{ display: 'block', maxWidth: '100%', maxHeight: '78vh', cursor: 'crosshair', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        />

        {/* MENÚ FLOTANTE AL HACER CLIC */}
        {menuPosition && (
          <div 
            className="targeting-menu"
            style={{ 
              position: 'fixed', 
              top: menuPosition.top, 
              left: menuPosition.left,
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              border: '2px dashed #e74c3c',
              backgroundColor: 'rgba(231, 76, 60, 0.2)',
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              pointerEvents: 'none',
              borderRadius: '50%'
            }}></div>

            <ul style={{
              position: 'absolute',
              top: '25px',
              left: '20px',
              background: 'white',
              border: '1px solid #ddd',
              listStyle: 'none',
              padding: '6px 0',
              margin: 0,
              boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {availableDropdownChars.length > 0 ? (
                availableDropdownChars.map((char) => (
                  <li 
                    key={char} 
                    onClick={() => handleCharacterSelect(char)}
                    style={{
                      padding: '10px 20px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      color: '#2c3e50',
                      textAlign: 'left',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    {char.replace(/_/g, ' ')}
                  </li>
                ))
              ) : (
                <li style={{ padding: '10px 20px', color: '#95a5a6', fontStyle: 'italic' }}>
                  ¡Ninguno disponible aquí!
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;