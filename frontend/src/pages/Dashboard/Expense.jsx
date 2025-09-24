import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosinstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import IncomeOverview from "../../components/Income/IncomeOverview";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";

const Expense = () => {

  useUserAuth()
  const [ExpenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosinstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (res.data) {
        setExpenseData(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching expense details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("Source is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
    }

    try {
      await axiosinstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (err) {
      console.error("Error adding expense", err);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosinstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show:false,data:null})
      toast.success("Expense details deleted successfully ")
      fetchExpenseDetails();
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const res = await axiosinstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense-details.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading expense details", err);
      toast.error("Failed to download expense details. Please try again.")
    }
  };

  return (
    <DashboardLayout activemenu="Expense">
      <div className="my-5 mx-auto">
        {loading && (
          <div className="text-center text-gray-500 mb-4">
            Loading Expense details...
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={ExpenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList 
          transactions={ExpenseData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true,data:id})
          }}
          onDownload={handleDownloadExpenseDetails}/>
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={()=>setOpenDeleteAlert({show:false,data:null})}
        title="Delete Expense">
          <DeleteAlert
          content="Are you sure you want to delete income this income details?"
          onDelete={()=>deleteIncome(openDeleteAlert.data)}/>

        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
