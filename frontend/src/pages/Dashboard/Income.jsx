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

const Income = () => {

  useUserAuth()
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosinstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (res.data) {
        setIncomeData(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching income details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  const handleAddIncome = async (newIncome) => {
    const { source, amount, date, icon } = newIncome;

    if (!source.trim()) {
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
      await axiosinstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (err) {
      console.error("Error adding income", err);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosinstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({show:false,data:null})
      toast.success("Income details deleted successfully ")
      fetchIncomeDetails();
    } catch (err) {
      console.error("Error deleting income", err);
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const res = await axiosinstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income-details.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading income details", err);
      toast.error("Failed to download income details. Please try again.")
    }
  };

  return (
    <DashboardLayout activemenu="Income">
      <div className="my-5 mx-auto">
        {loading && (
          <div className="text-center text-gray-500 mb-4">
            Loading income details...
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList 
          transactions={incomeData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true,data:id})
          }}
          onDownload={handleDownloadIncomeDetails}/>
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={()=>setOpenDeleteAlert({show:false,data:null})}
        title="Delete Income">
          <DeleteAlert
          content="Are you sure you want to delete income this income details?"
          onDelete={()=>deleteIncome(openDeleteAlert.data)}/>

        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
