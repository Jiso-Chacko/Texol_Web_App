let db = require('../config/connections')
let collection = require('../config/collections')
let ObjectID = require('mongodb').ObjectID

module.exports = {

    addWarehouse : (body) => {
        return new Promise(async (resolve,reject) => {

            let wareHouse = await db.get().collection(collection.WAREHOUSE_COLLECTION).findOne({
                wareHouseNumber : parseInt(body.warehouseNumber)
            })
            console.log(wareHouse);
            if(!(wareHouse)){
                db.get().collection(collection.WAREHOUSE_COLLECTION).insertOne({
                    wareHouseNumber : parseInt(body.warehouseNumber),
                    stockLimit : parseInt(body.stockLimit),
                    stockExist : true
                })
                resolve({wareHouseExist : false})
            }else{
                resolve({wareHouseExist : true})
            }
        })
    },

    getAllWareHouse : () => {
        return new Promise(async (resolve,reject) => {
            let wareHouse = await db.get().collection(collection.WAREHOUSE_COLLECTION).find().toArray()
            resolve(wareHouse)
        })
    },

    getWareHouseStockLimit: (wareHouseNumber) => {
        return new Promise(async (resolve,reject) => {
           let wareHouse = await db.get().collection(collection.WAREHOUSE_COLLECTION).findOne({
                wareHouseNumber : parseInt(wareHouseNumber)
            })
            resolve(wareHouse)
        })
    },

    addStock : (body) => {
        return new Promise(async (resolve,reject) => {
            let quantity = await db.get().collection(collection.WAREHOUSE_COLLECTION).findOne({
                wareHouseNumber : parseInt(body.wareHouseNumber)
            })

            let newQuantity = quantity.stockLimit - parseInt(body.quantity)
            let product = await db.get().collection(collection.STOCK_COLLECTION).findOne({
                productId : parseInt(body.productId)
            })
            if(!(product)){
                db.get().collection(collection.STOCK_COLLECTION).insertOne({
                    productId : parseInt(body.productId),
                    wareHouseNumber : parseInt(body.wareHouseNumber),
                    quantity : parseInt(body.quantity)
                })
            }
            else{
                let oldStock = product.quantity
                let newStock = oldStock + parseInt(body.quantity)
                db.get().collection(collection.STOCK_COLLECTION).updateOne({
                    productId : parseInt(body.productId)
                },
                {
                    $set : {
                        quantity : parseInt(newStock)
                    }
                })
            }

            db.get().collection(collection.WAREHOUSE_COLLECTION).updateOne({
                wareHouseNumber : parseInt(body.wareHouseNumber)
            },
            {
                $set : {
                    stockLimit : parseInt(newQuantity)
                }
            })
            resolve()
        })
    },

    getWarehouseInStock: () => {
        return new Promise(async (resolve,reject) => {
           let wareHouse = await db.get().collection(collection.STOCK_COLLECTION).aggregate([
                {
                    $group : {
                        _id : '$wareHouseNumber',
                    }
                }
            ]).toArray()
            console.log(wareHouse);
            resolve(wareHouse)
        })
    },

    getWarehouseProducts : (query) => {
        return new Promise(async (resolve,reject) => {
            let products = await db.get().collection(collection.STOCK_COLLECTION).find({
                wareHouseNumber : parseInt(query.wareHouseNumber)
            }).toArray()
            resolve(products)
        })
    },

    getProductStock : (query) => {
        return new Promise(async (resolve,reject) => {
            let stock = await db.get().collection(collection.STOCK_COLLECTION).findOne({
                wareHouseNumber : parseInt(query.warehouseNumber),
                productId : parseInt(query.prodcutId)
            })
            resolve(stock)
        })
    },

    unstockProduct : (body) => {
        return new Promise(async (resolve,reject) => {

            let quantity = await db.get().collection(collection.STOCK_COLLECTION).findOne({
                wareHouseNumber : parseInt(body.wareHouseNumber),
                productId : parseInt(body.productId)
            })

            let oldStock = quantity.quantity
            let newStock = oldStock - parseInt(body.quantity)

            let stockLimit = await db.get().collection(collection.WAREHOUSE_COLLECTION).findOne({
                wareHouseNumber : parseInt(body.wareHouseNumber)
            })
            let oldStockLimit = stockLimit.stockLimit
            let newStockLimit = oldStockLimit + parseInt(body.quantity)

            db.get().collection(collection.WAREHOUSE_COLLECTION).updateOne({
                wareHouseNumber : parseInt(body.wareHouseNumber)
            },
            {
                $set : {
                    stockLimit : newStockLimit
                }
            })

            if(newStock === 0){
                db.get().collection(collection.STOCK_COLLECTION).deleteOne({
                    wareHouseNumber : parseInt(body.wareHouseNumber),
                    productId : parseInt(body.productId)
                })
            }else{
                db.get().collection(collection.STOCK_COLLECTION).updateOne({
                    wareHouseNumber : parseInt(body.wareHouseNumber),
                    productId : parseInt(body.productId)
                },
                {
                    $set : {
                        quantity : newStock
                    }
                })
            }
            resolve()
        })
    },

    getProductsForWareHouseDetails : (query) => {
        return new Promise(async (resolve,reject) => {
           let products = await db.get().collection(collection.STOCK_COLLECTION).find({
                wareHouseNumber : parseInt(query.wareHouseNumber)
            }).toArray()
            resolve(products)
        })
    },

    getWareHouse : (query) => {
        return new Promise(async (resolve,reject) => {
            let wareHouse = await db.get().collection(collection.WAREHOUSE_COLLECTION).findOne({
                wareHouseNumber : parseInt(query.wareHouseNumber)
            })
            resolve(wareHouse)
        })
    },

    getAllStock : () => {
        return new Promise(async (resolve,reject) => {
            let stock = await db.get().collection(collection.STOCK_COLLECTION).find().toArray()

            let totalStock = 0
            for(i=0;i<stock.length;i++){
                console.log(stock[i].quantity);
                totalStock += stock[i].quantity
            }
            resolve(totalStock)
        })
    }
}