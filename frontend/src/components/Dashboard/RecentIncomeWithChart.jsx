import React, { useState,useEffect } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS=['#875CF5','#FA2C37','#FF6900']

const RecentIncomeWithChart = ({data,totalIncome}) => {

    const [chartdata,setchartdata]=useState([])

    const prepareChartData=()=>{
        const dataArr=data?.map((item)=>({
            name:item?.source,
            amount:item?.amount,

        }))

        setchartdata(dataArr)
    }

    useEffect(()=>{
        prepareChartData();
        return ()=>{}

    },[data])
  return (
    <div className="card ">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
        </div>

        <CustomPieChart
        data={chartdata}
        label="Total Income"
        totalAmount={`$${totalIncome}`}
        colors={COLORS}
        showTextAnchor
        />
    </div>
  )
}

export default RecentIncomeWithChart
