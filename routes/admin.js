var express = require('express');
const { Db } = require('mongodb');
var router = express.Router();
var adminProductHelper = require('../adminhelpers/adminProductHelper')
var adminWarehousehelper = require('../adminhelpers/adminWarehousehelper')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let products = await adminProductHelper.getAllProducts()
  let totalProducts = products.length
  let wareHouse = await adminWarehousehelper.getAllWareHouse()
  let totalWareHouse = wareHouse.length
  let stock = await adminWarehousehelper.getAllStock()
  res.render('admin/dashboard',{
    layout : 'admin/layout',
    totalProducts : totalProducts,
    totalWareHouse : totalWareHouse,
    stock : stock
  });
});

router.get('/addProduct',(req,res,next) =>{

  res.render('admin/addProduct',{
    layout : 'admin/layout',
    'productErr' : req.session.productErr
  })
  req.session.productErr = false
})

router.post('/addProduct',(req,res,next) => {
  console.log(req.body);
  adminProductHelper.addProduct(req.body).then((result) => {
    if(result.productExist){
      req.session.productErr = true
      res.redirect('/addProduct')
    }
    else{
      req.session.productErr = false
      res.redirect('/viewProducts')
    }
  })
})

router.get('/viewProducts',async (req,res,next) => {
  adminProductHelper.getAllProducts().then((products) => {
    res.render('admin/viewProducts',{
      layout : 'admin/layout',
      products : products
    })
  })
})

router.get('/addWarehouse',(req,res,next) => {
  res.render('admin/addWarehouse',{
    layout : 'admin/layout',
    "wareHouseErr" : req.session.wareHouseErr
  })
  req.session.wareHouseErr = false
})

router.post('/addWarehouse',(req,res,next) => {
  console.log(req.body);
  adminWarehousehelper.addWarehouse(req.body).then((result) => {
    console.log(result);
    if(result.wareHouseExist){
      req.session.wareHouseErr = true
      res.redirect('/addWarehouse')
    }
    else{
      req.session.wareHouseErr = false
      res.redirect('/addWarehouse')
    }
  })
})


router.get('/viewWarehouse',async (req,res,next) => {
  adminWarehousehelper.getAllWareHouse().then((wareHouse) => {
    res.render('admin/viewWareHouse',{
      layout : 'admin/layout',
      wareHouse : wareHouse
    })
  })
})

router.get('/addStock',async (req,res,next) => {

  let product = await adminProductHelper.getAllProducts()
  let wareHouse = await adminWarehousehelper.getAllWareHouse()
  console.log(product);
  console.log(wareHouse);
  res.render('admin/addStock',{
    layout : 'admin/layout',
    product : product,
    wareHouse : wareHouse
  })
})

router.post('/addStock',(req,res,next) => {
  adminWarehousehelper.addStock(req.body)
  res.redirect('/addStock')
})

router.get('/getWarehouseDetails',async (req,res,next) => {
  console.log(req.query);
  let wareHouse = await adminWarehousehelper.getWareHouseStockLimit(req.query.wareHouseNumber)
  console.log(wareHouse.stockLimit);
  res.send({stock : wareHouse.stockLimit})
})

router.get('/removeStock',async (req,res,next) => {
  let wareHouse = await adminWarehousehelper.getWarehouseInStock()
  res.render('admin/removeStock',{
    layout : 'admin/layout',
    wareHouse : wareHouse,

  })
})

router.get('/getProducts',async (req,res,next) => {
  console.log(req.query);
  adminWarehousehelper.getWarehouseProducts(req.query).then((products) => {
    console.log("*** /// ****");
    console.log(products);
    res.send(products)
  })
})

router.get('/getProductStock',(req,res,next) => {
  console.log(req.query);
  adminWarehousehelper.getProductStock(req.query).then((stock) => {
    res.send(stock)
  })
})

router.post('/removeStock',(req,res,next) => {
  console.log(req.body);
  adminWarehousehelper.unstockProduct(req.body)
  res.redirect('/removeStock')
})

router.get('/wareHouseDetails',async (req,res,next) => {
  console.log(req.query);
  let products = await adminWarehousehelper.getProductsForWareHouseDetails(req.query)
  let wareHouse = await adminWarehousehelper.getWareHouse(req.query)
  let currentStock = 0
  console.log("**** products ****");
  console.log(products);
  if(products.length === 0){
    req.session.wareHouseEmpty = true
  }
  else{
    for(let i=0;i<products.length;i++){
      currentStock += products[i].quantity
    }
    wareHouse.currentStock = currentStock
    req.session.wareHouseEmpty = false
  }

  res.render('admin/wareHouseDetails',{
    layout : 'admin/layout',
    wareHouse : wareHouse,
    products : products,
    'wareHouseEmpty' : req.session.wareHouseEmpty
  })
})

module.exports = router;
