const db = require('../database/db');

exports.getObtenerVehiculosDevolver = (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT vehiculo.* FROM alquiler '+ 
    'INNER JOIN vehiculo ON alquiler.vehiculo_id_vehiculo = vehiculo.id_vehiculo '+
    'WHERE alquiler.estado = "Pendiente" and usuario_idusuario = ? ;';
  
    db.query(sql,[userId], (err, rows) => {
      if (err) {
        console.error('Error al obtener vehículos:', err);
        return res.status(500).json({ error: 'Error al obtener vehículos' });
      }
  
      // Convierte el Buffer a una cadena Base64
      const vehiculosConBase64 = rows.map((row) => {
        const fotoBuffer = row.foto;
        const fotoBase64 = fotoBuffer.toString('base64');
        return { ...row, foto: fotoBase64 };
      });
  
      res.json({ vehiculos: vehiculosConBase64 });
    });
  };