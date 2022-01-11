let db = require('../config/connections')
let collection = require('../config/collections')
let ObjectID = require('mongodb').ObjectID


module.exports = {

    addProduct : (body) => {
        return new Promise(async (resolve,reject) => {

            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({
                productId : parseInt(body.proId)
            })

            if(!(product)){
                db.get().collection(collection.PRODUCT_COLLECTION).insertOne({
                    productName : body.productName,
                    productId : parseInt(body.proId)
                })
                resolve({productExist : false}) 
            }else{
                resolve({productName : product.productName, Id : product.proId, productExist : true})
            }
        })
    },

    getAllProducts : () => {
        return new Promise(async (resolve,reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()

            resolve(products)
        })
    }
}