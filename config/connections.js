const mongoClient = require('mongodb').MongoClient

const state = {
    db : null
}

module.exports.connect = (done) => {
    const url = "mongodb+srv://jiso:jiso007@cluster0.qbsra.mongodb.net/texolWebApp?retryWrites=true&w=majority"
    const dbname = "texolWebapp"
    mongoClient.connect(url,(err,data) => {
        if(err){
            return err
        }
        else{
            state.db = data.db(dbname)
            done()
        }
    }) 
}

module.exports.get = () => {
    return state.db
}
