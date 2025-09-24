import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpenses = ({ data }) => {


    const [chartdata,setchartdata]=useState([]);

    useEffect(()=>{
        const result=prepareExpenseBarChartData(data)
        setchartdata(result)
        return()=>{}
    },[data])



  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>

        </div>
        <CustomBarChart data={chartdata}/>
        
    </div>
  );
};

export default Last30DaysExpenses;
