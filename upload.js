const connection = require('./connection')
const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: 'AKIASW2CKK37Z3F7ZOU5',
    secretAccessKey: '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'
})
const uuid = require('uuid')
const colors = require('colors')

const uploadFile = (filename) => {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filename);
        const KeyFilename = uuid.v4()+'.PDF'

        const params = {
            Bucket: 'nodejs-upload-to-s3',
            Key: KeyFilename,
            Body: fileContent
        }

        s3.upload(params, function(err, data) {
            if (err) {
                reject(err)
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            resolve(data)
        })

    })
}

const registerSaveDb = (location) => {
    return new Promise((resolve, reject) => {
        console.log('Registar upload ...')
        const data = {
            filename: location
        }
        const sql = 'INSERT INTO upload_logs SET ?'
        connection.query(sql, [data], (error, result) => {
            if (error) {
                console.log('Error al agregar registro')
                console.log(error)
                reject(error)
            } else {
                console.log(`Registro agregado correctamente: ${new Date()}`)
                resolve(true)
            }
        })
    })
}

const deleteFile = (filename) => {
    return new Promise((resolve, reject) => {
        console.log('Delete local file ...')
        console.log('Realmente no se elimina el archivo para que el proceso continue ...'.red)
        resolve()
    })
}

const registerDeleteDb = (location) => {
    return new Promise((resolve, reject) => {
        console.log('Registrar Delete ...')
        const sql = 'UPDATE upload_logs SET status = 2 WHERE filename=?'
        connection.query(sql, location, (error, result) => {
            if (error) {
                console.log('Error al registrar delete')
                console.log(error)
                reject(error)
            } else {
                console.log(`Delete registrado correctamente: ${new Date()}`)
                resolve(true)
            }
        })
    })
}

module.exports = {
    uploadFile,
    registerSaveDb,
    deleteFile,
    registerDeleteDb
}
