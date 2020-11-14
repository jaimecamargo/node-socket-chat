class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        };

        this.personas.push(persona);

        return this.personas;
    }

    obtenerPersona(id) {
        let persona = this.personas.filter(p => {
            return p.id === id;
        })[0];

        return persona;
    }

    obtenerPersonas() {
        return this.personas;
    }

    obtenerPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(p => {
            return p.sala == sala;
        });

        return personasEnSala;
    }

    sacarPersona(id) {
        let personaBorrada = this.obtenerPersona(id);

        if (personaBorrada) {
            this.personas = this.personas.filter(p => {
                return p.id !== id;
            });
        }

        return personaBorrada;
    }

}

module.exports = {
    Usuarios
};