
module.exports = function (passport, cuenta, persona, rol) {
    var Cuenta = cuenta;
    var Persona = persona;
    var Rol = rol;
    var LocalStrategy = require('passport-local').Strategy;
    passport.serializeUser(function (cuenta, done) {
        done(null, cuenta.id);
    });
    passport.deserializeUser(function (id, done) {
        Cuenta.findOne({ where: { id: id }, include: [{ model: Persona, include: { model: Rol } }] }).then(function (cuenta) {
            if (cuenta) {
                var userinfo = {
                    id: cuenta.id,
                    nombre: cuenta.persona.nombre + " " + cuenta.persona.apellido,
                    rol: cuenta.persona.rol.nombre
                };
                done(null, userinfo);
            } else {
                done(cuenta.errors, null);
            }
        });
    });
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'correo',
            passwordField: 'clave',
            passReqToCallback: true
        },
        function (req, email, password, id_rol, done) {
            var generateHash = function (password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(process.env.BCRYPT_SALT_ROUNDS), null);
            };
            Cuenta.findOne({
                where: {
                    correo: email
                }
            }).then(function (cuenta) {
                if (cuenta) {
                    return done(null, false, {
                        message: res.status(500).json({ message: error.message })
                        //message: req.flash('error_correo', 'El correo ya esta regisrado')
                    });
                } else {
                    var userPassword = generateHash(password);
                    Rol.findOne({
                        where: { id: id_rol }
                    }).then(function (rol) {
                        if (rol) {
                            const {
                                nombre,
                                apellido,
                                nacionalidad,
                                cuidadNaci,
                                provincia,
                                tipoDocId,
                                numeroId,
                                fechaNaci,
                                edad,
                                correoPersonal,
                                correroInstitucional,
                                celular,
                                telefono,
                                estadoCivil,
                                etnia,
                                nCarFamilia,
                                nCarEdu,
                                parroquia,
                                barrio,
                                refeCasa,
                                idenCasa,
                                callePrin,
                                calleSecond,
                                codigoUnicLuz,
                                estadoPadres,
                                listaHogar,
                                foto
                            } = req.body
                            var dataPersona =
                            {
                                nombre: nombre,
                                apellido: apellido,
                                nacionalidad: nacionalidad,
                                cuidadNaci: cuidadNaci,
                                provincia: provincia,
                                tipoDocId: tipoDocId,
                                numeroId: numeroId,
                                fechaNaci: fechaNaci,
                                edad: edad,
                                correoPersonal: correoPersonal,
                                correroInstitucional: correroInstitucional,
                                celular: celular,
                                telefono: telefono,
                                estadoCivil: estadoCivil,
                                etnia: etnia,
                                nCarFamilia: nCarFamilia,
                                nCarEdu: nCarEdu,
                                parroquia: parroquia,
                                barrio: barrio,
                                refeCasa: refeCasa,
                                idenCasa: idenCasa,
                                callePrin: callePrin,
                                calleSecond: calleSecond,
                                codigoUnicLuz: codigoUnicLuz,
                                estadoPadres: estadoPadres,
                                listaHogar: listaHogar,
                                foto: foto,
                                estadoCuenta: 0,
                                id_rol: id_rol
                            };
                            Persona.create(dataPersona).then(function (newPersona, created) {
                                if (!newPersona) {
                                    return done(null, false);
                                }
                                if (newPersona) {
                                    var dataCuenta = {
                                        correo: correoPersonal,
                                        clave: numeroId,
                                        estado: 0,
                                        id_persona: newPersona.id,
                                    };
                                    Cuenta.create(dataCuenta).then(function (newCuenta, created) {
                                        if (newCuenta) {
                                            return done(null, newCuenta, {
                                                //message: req.flash('crear', 'Su cuenca se ha creado')
                                                message: res.status(200).json({ message: 'Ha generado un nuevo usuario' })
                                            });
                                        }
                                        if (!newCuenta) {
                                            return done(null, false, {
                                                message: res.status(500).json({ error: 'Su cuenca no se puedo crear, revise bien si informacion no sea imbecil' })
                                                // message: req.flash('error_q', '')
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            return done(null, false, {
                                message: 'El rol no existe'
                            });
                        }
                    });
                }
            });
        }
    ));
    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'correo',
            passwordField: 'clave',
        },
        function (req, correo, clave, done) {
            try {
                //const { correo, clave } = req.body;
                var Cuenta = cuenta;
                const user = Cuenta.findOne({ where: { correo: correo } });
                if (!user) {
                    return done(null, false, {
                        //message: res.status(500).json({ message: 'bad email' })
                        message: req.flash('error_correo', 'bad email')
                    });
                }
                //} return done(null, false, {
                //   message: 'Bad email'
                // });;
                //console.log(password);
                //let passwordEncript = user.password;
                //console.log(user);
                //const passwordValide = await bcrypt.compare(clave, passwordEncript);
                //console.log(passwordValide)
                if (clave != user.clave) {
                    return done(null, false, {
                        //message: res.status(500).json({ message: 'bad password' })
                        message: req.flash('error_password', 'bad password')
                    });
                }
                // return done(null, false, {
                //  message: 'Bad password'
                const token = jwt.sign({ id: user.id }, process.env.Secret_key);
                //console.log({token, user});
                return done(null, false, {
                    //message: res.status(500).json({ token, user })
                    message: req.flash({ token, user })
                });
            } catch (error) {
                return done(null, false, {
                    //message: res.status(500).json({ err: error })
                    message: req.flash('error_correo', error)
                });
            }
        }
    ));

};
