const { response } = require('express')


const esAdminRole = ( req, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;
    
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

    next();
}


const tieneRole = ( ...roles  ) => {

    // trabajarlos como parametros multiplos como (req, res)
    return (req, res = response, next) => {
        
        // manda el error si la autenticacion es invalida
        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        // validar si el usuario con un rol especifico se el rol permitido : ADMIN_ROLE, VENTAR_ROLE, OTRO_ROLE
        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }


        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole
}