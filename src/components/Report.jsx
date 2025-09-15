import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";


const Report = () => {
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(storedUsers);

        const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
        setTickets(storedTickets);
    }, []);

    function countPriorities(tickets) {
        let lcnt = 0,
            mcnt = 0,
            hcnt = 0;
        tickets.forEach((t) => {
            const priority = t.priority?.toLowerCase().trim();
            if (priority === "low") lcnt++;
            if (priority === "medium") mcnt++;
            if (priority === "high") hcnt++;
        });
        return { lcnt, mcnt, hcnt };
    }

    function statusCounter(tickets) {
        let ocnt = 0,
            processcnt = 0,
            rescnt = 0;
        tickets.forEach((t) => {
            const status = t.status?.toLowerCase().trim().replace(/\s+/g, "");
            if (status === "open") ocnt++;
            if (status === "inprogress") processcnt++;
            if (status === "resolved") rescnt++;
        });
        return { ocnt, processcnt, rescnt };
    }

    const { lcnt, mcnt, hcnt } = countPriorities(tickets);
    const { ocnt, processcnt, rescnt } = statusCounter(tickets);

    function back() {
        navigate(-1);
    }

    return (
        <div className="px-6 py-10 max-w-7xl mx-auto lora">
            <button
                className="border p-2 border-gray-300 rounded flex gap-2 bg-gray-200 mb-4 cursor-pointer"
                onClick={back}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                Back
            </button>

            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-10">
                User & Ticket Report
            </h1>

            {/* Ticket summary section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Priority Pie */}
                <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Ticket Priority
                    </h2>
                    <div className="flex justify-around text-sm font-medium mb-4">
                        <span className="text-green-600">Low: {lcnt}</span>
                        <span className="text-yellow-600">Medium: {mcnt}</span>
                        <span className="text-red-600">High: {hcnt}</span>
                    </div>
                    <PieChart
                        series={[
                            {
                                data: [{ id: 0, value: lcnt, label: "Low", color: "#22c55e" },
                                { id: 1, value: mcnt, label: "Medium", color: "#eab308" },
                                { id: 2, value: hcnt, label: "High", color: "#ef4444" }]
                            }
                        ]}
                        width={250}
                        height={250}
                    />
                </div>

                {/* Status Pie */}
                <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Ticket Status
                    </h2>
                    <div className="flex justify-around text-sm font-medium mb-4">
                        <span className="text-blue-600">Open: {ocnt}</span>
                        <span className="text-yellow-600">In Progress: {processcnt}</span>
                        <span className="text-green-600">Resolved: {rescnt}</span>
                    </div>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: ocnt, label: "Open", color: "#3b82f6" },
                                    { id: 1, value: processcnt, label: "In Progress", color: "#facc15" },
                                    { id: 2, value: rescnt, label: "Resolved", color: "#22c55e" },
                                ]
                            }
                        ]}
                        width={250}
                        height={250}
                    />
                </div>

                {/* Total Tickets LineChart */}
                <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Total Tickets
                    </h2>
                    <p className="text-2xl font-bold text-indigo-600 mb-4">
                        {tickets.length}
                    </p>
                    {/* Example line chart: daily tickets count */}
                    <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[
                            {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                            },
                        ]}
                        height={300}
                    />
                </div>
            </div>

           



            
        </div>
    );
};

export default Report;