let socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};
//
// ON => escuchar eventos
socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(usuariosConectados) {
        // console.log('Usuarios conectados: ', usuariosConectados);

        mostrarUsuarios(usuariosConectados);
    });
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('crearMensaje', function(mensaje) {
    // console.log('Servidor: ', mensaje);
    mostrarMensajes(mensaje, false);
    scrollBottom();
});
//
// // EMIT => enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Jaime',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('Respuesta del Servidor: ', resp);
// });

// escuchar cambios de usuarios, cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(personas) {
    // console.log(personas);
    mostrarUsuarios(personas);
});

// mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado: ', mensaje);
});