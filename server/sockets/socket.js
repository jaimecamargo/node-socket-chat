const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        let personasEnSala = usuarios.obtenerPersonasPorSala(usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersonas', personasEnSala);
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} se unió`));

        callback(personasEnSala);
    });

    client.on('crearMensaje', (mensajeCliente, callback) => {

        let persona = usuarios.obtenerPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, mensajeCliente.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.sacarPersona(client.id);

        // client.broadcast.emit('crearMensaje', {
        //     usuario: 'Administrador',
        //     mensaje: `${personaBorrada.nombre} abandonó el chat`
        // });

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));

        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.obtenerPersonasPorSala(personaBorrada.sala));
    });

    // mensajes privados
    client.on('mensajePrivado', mensajePrivado => {
        let persona = usuarios.obtenerPersona(client.id);

        client.broadcast.to(mensajePrivado.destinatario).emit('mensajePrivado', crearMensaje(persona.nombre, mensajePrivado.mensaje));
    });
});