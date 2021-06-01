const connection = require('./connection');
const CronJob = require('cron').CronJob
const path = require('path')
const fs = require('fs')
// const AWS = require('aws-sdk')
// const s3 = new AWS.S3()
const {uploadFile, registerSaveDb, deleteFile, registerDeleteDb} = require('./upload')
const bucket = 'nodejs-upload-to-s3'
const PATH_PDF = 'C:\\VSCode\\retoS3\\pdf\\'

function upload_to_s3() {

    console.log(`Starting cronjob at: ${new Date()}`)
    var job = new CronJob('*/10 * * * * *', async() => {

        console.log(`Path to load: ${PATH_PDF}`)
        const archivos = fs.readdirSync(PATH_PDF)
        archivos.forEach(async(filename) => {
            console.log(`Loading file: ${filename}`)
            try{
                filename = path.join(PATH_PDF, filename)
                const data = await uploadFile(filename)
                console.log(`Filename: ${data.Key}`)
                console.log(`Location: ${data.Location}`)
                const wentUp = await registerSaveDb(data.Location)
                if (wentUp){
                    await deleteFile(filename)
                    await registerDeleteDb(data.Location)
                }
            } catch(ex){
                throw ex
            }
        })
    }, null, true, 'America/Lima')
    job.start()
}

upload_to_s3()