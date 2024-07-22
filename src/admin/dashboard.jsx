import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { IoBookSharp } from "react-icons/io5";
import { BsFillPrinterFill } from "react-icons/bs";
import Navbar from "./navbar";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [users, setUsers] = useState(0);
  const [books, setBooks] = useState(0);
  const [prints, setPrints] = useState(0);
  const [labels, setLabels] = useState([]);
  const [dataSet, setData] = useState([]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Weekly Orders",
        data: dataSet,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
      },
      //   {
      //     label: 'Dataset 2',
      //     data: [35, 49, 84, 11, 66],
      //     fill: false,
      //     borderColor: 'rgba(53, 162, 235, 0.5)',
      //   },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        // text: 'Chart.js Line Chart',
      },
    },
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_BASE_URL}/api/admin/Dashboard`,
    })
      .then((res) => {
        setUsers(res.data?.userData);
        setBooks(res.data?.bookData);
        setPrints(res.data?.printData);

        let labelArray = [];
        let datasetArray = [];
        for (let i = 0; i < 5; i++) {
          labelArray.push(res.data?.totalOrdersData[i].start);
          datasetArray.push(res.data?.totalOrdersData[i].totalOrders);
        }
        labelArray.push(res.data?.totalOrdersData[4].end);
        datasetArray.unshift(0);

        setLabels(labelArray);
        setData(datasetArray);
      })
      .catch((err) => {});
  }, []);
  return (
    <div className="ml-64 h-screen">
      <Navbar name={"Dashboard"} />
      <div className="mt-8 flex flex-col items-center gap-8 h-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-32">
          <div className="p-4 w-40 h-40 xl:w-60 xl:h-60 bg-white shadow-xl rounded-md flex gap-4 flex-col items-center justify-center">
            <FiUsers size={32} />
            <p className="font-bold text-xl"> {users} </p>
            <p className="text-xl">Total Users</p>
          </div>
          <div className="p-4 w-40 h-40 xl:w-60 xl:h-60 bg-white shadow-xl rounded-md flex gap-4 flex-col items-center justify-center">
            <IoBookSharp size={32} fill="#33606a" />
            <p className="font-bold text-xl">{books}</p>
            <p className="text-xl">Total Books</p>
          </div>
          <div className="p-4 w-40 h-40 xl:w-60 xl:h-60 bg-white shadow-xl rounded-md flex gap-4 flex-col items-center justify-center">
            <BsFillPrinterFill size={32} fill="#33606a" />
            <p className="font-bold text-xl">{prints}</p>
            <p className="text-xl">Print Books</p>
          </div>
        </div>
        <div className="flex justify-center w-full h-full px-12 pb-20">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
