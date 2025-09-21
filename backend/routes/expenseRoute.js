const express=require("express");
const router=express.Router();

const {addExpense,getAllExpense,deleteExpense,downloadExpenseExcel}=require('../controllers/expenseController')
const protect = require("../middleware/authMiddleware.js");

router.post("/add",protect,addExpense)
router.get("/get",protect,getAllExpense)
router.delete("/:id",protect,deleteExpense)
router.get("/downloadexcel",protect,downloadExpenseExcel)


module.exports=router