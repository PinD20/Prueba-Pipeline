const db = require('../database/db');

// Función para enviar solicitud de alquiler de vehículo
exports.postSolicitarAlquiler = (req, res) => {
  const { Fecha_inicio, Fecha_fin, Cuota_alquiler, Id_empleado, Usuario_idusuario, Vehiculo_id_vehiculo } = req.body;

  const alquilerSql = 'INSERT INTO alquiler (fecha_inicio, fecha_fin, cuota_alquiler, estado, id_empleado, usuario_idusuario, vehiculo_id_vehiculo) VALUES (?, ?, ?, ?, ?, ?, ?)';

  const vehiculoUpdateSql = 'UPDATE vehiculo SET estado = ? WHERE id_vehiculo = ?';

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error Solicitud de alquiler no enviada' });
    }

    db.query(alquilerSql, [Fecha_inicio, Fecha_fin, Cuota_alquiler, 'Pendiente', Id_empleado, Usuario_idusuario, Vehiculo_id_vehiculo], (err, results) => {
      if (err) {
        db.rollback(() => {
          console.log(err);
          return res.status(500).json({ mensaje: 'Error Solicitud de alquiler no enviada' });
        });
      } else {
        db.query(vehiculoUpdateSql, ['Reservado', Vehiculo_id_vehiculo], (err, results) => {
          if (err) {
            db.rollback(() => {
              console.log(err);
              return res.status(500).json({ mensaje: 'Error Solicitud de alquiler no enviada' });
            });
          } else {
            db.commit((err) => {
              if (err) {
                db.rollback(() => {
                  console.log(err);
                  return res.status(500).json({ mensaje: 'Error Solicitud de alquiler no enviada' });
                });
              } else {
                return res.status(201).json({ mensaje: 'Solicitud de alquiler enviada' });
              }
            });
          }
        });
      }
    });
  });
};
