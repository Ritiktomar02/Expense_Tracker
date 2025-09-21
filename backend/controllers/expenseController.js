const Expense = require("../models/Expense");
const xlsx = require("xlsx");

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { category, amount, date, icon } = req.body;

    if (!category || !amount) {
      return res
        .status(400)
        .json({ message: "Category and amount are required" });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      category,
      amount,
      date: date || Date.now(),
      icon: icon || "",
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all expenses for the logged-in user
exports.getAllExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found" });
    }

    const data = expenses.map((item) => ({
      Date: item.date.toISOString().split("T")[0],
      Category: item.category,
      Amount: item.amount,
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
