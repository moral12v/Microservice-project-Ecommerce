import * as admin from 'firebase-admin';

const serviceAccount = require('../../firebase-adminsdk-zipsl-875aa779ab.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)   

});


