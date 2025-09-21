const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types ,isValidObjectId} = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    const totalIncomeAgg = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalIncome = totalIncomeAgg[0]?.total || 0;

    console.log("totalIncome",{totalIncomeAgg,userId:isValidObjectId(userObjectId)})

    const totalExpenseAgg = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpense = totalExpenseAgg[0]?.total || 0;

    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });
    const last60DaysIncomeTotal = last60DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });
    const last30DaysExpenseTotal = last30DaysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    const recentTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: "income"
      })),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: "expense"
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      last30DaysExpense: {
        total: last30DaysExpenseTotal,
        transactions: last30DaysExpenseTransactions
      },
      last60DaysIncome: {
        total: last60DaysIncomeTotal,
        transactions: last60DaysIncomeTransactions
      },
      recentTransactions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
