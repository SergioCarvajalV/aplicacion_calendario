const { response } = require('express');
const Evento = require('../models/Evento')

const getEvento = async(req,res = response) =>{

    const eventos = await Evento.find().populate('user','name')

    return res.status(200).json({
        ok:true,
        eventos
    })
}

const crearEvento = async (req,res = response) =>{
    const evento = new Evento( req.body );
try {

    evento.user = req.uid;

    const eventoGuardado = await evento.save()
    res.json({
        ok:true,
        evento: eventoGuardado
    })
} catch (error) {

    console.log(error)
    res.status(500).json({
        ok:false,
        msg: 'hable con el admin'
    })
}
}

const actualizarEvento = async(req,res = response) =>{

    const eventoId =req.params.id;
    const uid = req.uid;
    try {
        
        const evento = await Evento.findById( eventoId );

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: "evento no existe con ese id"
            })
        }

        if(uid !== evento.user.toString()){
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio para editar ese evento'
            })
        }
        const nuevoEvento= {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new:true} )
        res.json({
            ok: true,
            evento:eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "hable con el admin"
        })
    }
}

const eliminarEvento = async(req,res = response) =>{

    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        
        const evento = await Evento.findById( eventoId );

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: "evento no existe con ese id"
            })
        }

        if(uid !== evento.user.toString()){
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio para eliminar ese evento'
            })
        }
        await Evento.findByIdAndDelete( eventoId );
        res.json({
            ok: true,
            msg: "evento eliminado"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "hable con el admin"
        })
    }
    
}

module.exports = {
    getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}