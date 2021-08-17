const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

// Role: en mongo va en plural
module.exports = model( 'Role', RoleSchema );
