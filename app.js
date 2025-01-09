const express = require('express');
const session = require('express-session');


const app = express();


//Configuración de la sesión
app.use(session({
    secret: 'mi-clave-secreta',
    resave:false, 
    saveUninitialized:false, 
    cookie:{secure:false}  
}));

//Midelware para mostrar detalles de la sesion
app.use((req,res, next)=>{
    if(req.session){
        if(!req.session.createdAt){
            req.session.createdAt=new Date(); 
        }
        req.session.lastAccess=new Date(); 
    }
    next();
});



app.get('/session',(req,res)=>{
    if(req.session){
        const sessionId = req.session.id;
        const createdAt = req.session.createdAt;
        const lastAccess = req.session.lastAccess;
        const sessionDuration = (new Date() - createdAt)/1000; 
        
        res.send(`
            <h1>Detalles de la sesion</h1>
            <p><strong>ID de sesión:</strong>${sessionId}</p>
            <p><strong>Fecha de creación de la sesión:</strong>${createdAt}</p>
            <p><strong>último acceso:</strong>${lastAccess}</p>
            <p><strong>Duración de la sesión (en segundos):</strong>${sessionDuration}</p>
            `);
    }
})


app.get('/logout',(req,res)=>{
    res.session.destroy((err)=>{
        if(err){
            return res.send('Error al cerrar sesion.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>');
    });
});


app.listen(3000,()=>{
    console.log('Servidor corriendo en el puerto 3000');
});