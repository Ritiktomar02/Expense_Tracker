const Income = require("../models/Income");
const xlsx = require("xlsx");

exports.addIncome = async (req, res) => {
  try {
    const { source, amount, date, icon } = req.body;

    if (!source || !amount) {
      return res
        .status(400)
        .json({ message: "Source and amount are required" });
    }

    const income = await Income.create({
      userId: req.user._id,
      source,
      amount,
      date: date || Date.now(),
      icon: icon || "",
    });

    res.status(201).json(income);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    if (!income || income.length === 0) {
      return res.status(404).json({ message: "No incomes found" });
    }

    const data = income.map((item) => ({
      Date: item.date.toISOString().split("T")[0],
      Source: item.source,
      Amount: item.amount,
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
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
