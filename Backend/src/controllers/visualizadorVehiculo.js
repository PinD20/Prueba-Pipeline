const db = require('../database/db');

// Función para agregar un vehículo a la base de datos
exports.postAgregarVehiculo = (req, res) => {
  const { Modelo, Marca, Transmision, Cantidad_asientos, Combustible, Cuota_por_dia, Foto, Estado, Categoria } = req.body;

  // Convierte la cadena Base64 a un Buffer
  const fotoBuffer = Buffer.from(Foto, 'base64');

  const sql = 'INSERT INTO vehiculo (modelo, marca, transmision, cantidad_asientos, combustible, cuota_por_dia, foto, estado, categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [Modelo, Marca, Transmision, Cantidad_asientos, Combustible, Cuota_por_dia, fotoBuffer, Estado, Categoria], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al agregar el vehículo' });
    }

    return res.status(201).json({ mensaje: 'Vehículo agregado con éxito' });
  });
};

// Función para obtener la lista de vehículos desde la base de datos
exports.getObtenerVehiculos = (req, res) => {
  const sql = 'SELECT * FROM vehiculo';

  db.query(sql, (err, rows) => {
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

// Función para obtener la lista de vehículos disponibles desde la base de datos
exports.getObtenerVehiculosDisponibles = (req, res) => {
  const sql = 'SELECT * FROM vehiculo Where estado = "Disponible"';

  db.query(sql, (err, rows) => {
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