const conexion = require('../database/db');

const postUpdateCuotaVehiculos = (req,res ) => {
    try{
        const { idvehiculo, new_cuota } = req.body
        EditarCuotaVehiculo(idvehiculo,new_cuota,(err,result)=>{
            if(err){
                res.status(400).json({message:err,estatus:false})
                return
            }
            res.status(200).json({ mensaje: result, estatus: true });
        })
        
    }catch(error){
        res.status(400).json({ mensaje: "Error de conexion ", estatus: false });
    }
}

const postUpdateCuotaVehiculoMarca = (req,res) => {
    try{
        const{marca,new_cuota} = req.body
        console.log(marca)
        EditarCuotaVehiculoMarca(marca,new_cuota,(err,result) =>{
            if(err){
                res.status(400).json({ message: err, estatus: false })
                return
            }
            res.status(200).json({ mensaje: result, estatus: true });
        })
    }catch(error){
        res.status(200).json({mensaje:"Error de conexion ", estatus: false})
    }
}

const postUpdateCuotaVehiculoCategoria = (req,res) => {
    try{
        const{categoria,new_cuota} = req.body
        console.log(categoria)
        EditarCuotaVehiculoCategoria(categoria,new_cuota,(err,result) =>{
            if (err) {
                res.status(400).json({ message: err, estatus: false })
                return
            }
            res.status(200).json({ mensaje: result, estatus: true });
        })
    }catch(error){
        res.status(200).json({ mensaje: "Error de conexion ", estatus: false })
    }
}

const postUpdateCuotaVehiculoAmbos = (req,res) => {
    try {
        const { marca, categoria, new_cuota } = req.body
        EditarCuotaVehiculoAmbos(marca,categoria, new_cuota, (err, result) => {
            if (err) {
                res.status(400).json({ message: err, estatus: false })
                return
            }
            res.status(200).json({ mensaje: result, estatus: true });
        })
    } catch (error) {
        res.status(200).json({ mensaje: "Error de conexion ", estatus: false })
    }
}

const EditarCuotaVehiculoAmbos = (marca,categoria, new_cuota, callback) => {
    const sql = 'UPDATE vehiculo AS v JOIN(SELECT id_vehiculo FROM vehiculo WHERE categoria = ? AND marca = ?) AS subquery ON v.id_vehiculo = subquery.id_vehiculo SET v.cuota_por_dia = ?'
    conexion.query(sql, [categoria, marca, new_cuota], (err, result) => {
        if (err) {
            callback(err.message, null)
            return
        }
        if (result.affectedRows > 0) {
            callback(null, "Cuota modificada de la " + categoria + " Y " + marca+" fueron Exitosa")
        } else {
            callback("Filtro No existe vehiculo", null)
        }
    })
}




const EditarCuotaVehiculoCategoria = (categoria, new_cuota, callback) => {
    const sql = 'UPDATE vehiculo AS v JOIN(SELECT id_vehiculo FROM vehiculo WHERE categoria = ? ) AS subquery ON v.id_vehiculo = subquery.id_vehiculo SET v.cuota_por_dia = ?'
    conexion.query(sql, [categoria, new_cuota], (err, result) => {
        if (err) {
            callback(err.message, null)
            return
        }
        if (result.affectedRows > 0) {
            callback(null, "Cuota modificada de la " + categoria + " fueron Exitosa")
        } else {
            callback("Categoria " + categoria + " No existe", null)
        }
    })
}



const EditarCuotaVehiculoMarca = (marca, new_cuota,callback) => {
    const sql = 'UPDATE vehiculo AS v JOIN(SELECT id_vehiculo FROM vehiculo WHERE marca = ? ) AS subquery ON v.id_vehiculo = subquery.id_vehiculo SET v.cuota_por_dia = ?'
    conexion.query(sql,[marca,new_cuota],(err,result) =>{
        if (err) {
            callback(err.message, null)
            return
        }
        if (result.affectedRows > 0){
            callback(null, "Cuota modificada de la " + marca + " fueron Exitosa")
        }else{
            callback("Marca " + marca + " No existe", null)
        }
    }) 
}

const EditarCuotaVehiculo = (idvehiculo,new_cuota, callback) => {
    const sql = 'UPDATE vehiculo SET cuota_por_dia = ? WHERE id_vehiculo = ?';

    conexion.query(sql,[new_cuota,idvehiculo],(err,result) =>
    {
        if(err){
            callback(err.message,null)
            return
        }
        callback(null,"Cuota modificada Exitosa")
    });
}

module.exports = {
    postUpdateCuotaVehiculos,
    postUpdateCuotaVehiculoMarca,
    postUpdateCuotaVehiculoCategoria,
    postUpdateCuotaVehiculoAmbos
}