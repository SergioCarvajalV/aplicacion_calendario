const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJWT }= require('../helpers/jwt');

const crearUsuario = async(req,res = response)=> {

    const {email, password} = req.body;

    try {

        let usuario = await User.findOne({email})

        if (usuario){
            return res.status(400).json({
                ok: false,
                msg: 'ya hay un usuario con ese correo'
            });
        }
        usuario = new User(req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        await usuario.save();

        //jwt
        const token = await generarJWT(usuario.id,usuario.name);

        //manejo de errores
            res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        } catch (error) {
            res.status(500).json({
            ok:false,
            msg: "porfavor hable con el administrador"
            })
        }

}


const loginUsuario = async(req, res = response)=> {
    const { email, password } = req.body;

    try {

        const usuario = await User.findOne({email})
        if (!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'

            });
        }

        //validar la password
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'password incorrecta'
            })
        }

        const token = await generarJWT(usuario.id,usuario.name);

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: "porfavor hable con el administrador"
            })
    }
}

const revalidarToken = async (req,res = response)=> {

    const { uid, name } = req;

    const token = await generarJWT( uid, name );
    res.json({
       ok: true,
       uid, name,
       token
    })
}

 module.exports = { 
    loginUsuario,
    crearUsuario,

    revalidarToken,
 }