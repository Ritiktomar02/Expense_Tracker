import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { IoMdCard } from "react-icons/io";
import InfoCard from "../../components/Cards/InfoCard";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanaceOverview from "../../components/Dashboard/FinanaceOverview";
import ExpenseTransaction from "../../components/Dashboard/ExpenseTransaction";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setdashboardData] = useState(null);
  const [loading, setloading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setloading(true);

    try {
      const response = await axiosinstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      if (response.data) {
        setdashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);
  return (
    <DashboardLayout activemenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Totol Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Totol Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Totol Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           <RecentTransactions
           transactions={dashboardData?.recentTransactions}
           onSeeMore={()=>navigate('/expense')}/>

          <FinanaceOverview
          totalBalance={dashboardData?.totalBalance || 0}
          totalIncome={dashboardData?.totalIncome || 0}
          totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransaction
           transactions={dashboardData?.last30DaysExpense?.transactions || []}
           onSeeMore={()=>navigate('/expense')}
          />

          <Last30DaysExpenses
          data={dashboardData?.last30DaysExpense?.transactions || []}
          />
           
           <RecentIncomeWithChart
           data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
           totalIncome={dashboardData?.totalIncome || 0}
           />

           <RecentIncome
           transactions={dashboardData?.last60DaysIncome?.transactions || []}
           onSeeMore={()=>navigate('/income')}
           />



        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
