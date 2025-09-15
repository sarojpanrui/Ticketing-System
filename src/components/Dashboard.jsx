import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
// import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const [tickets, setTickets] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLight, setIsLight] = useState(true); 

  const navigate = useNavigate();

  
  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    setTickets(storedTickets);

    // Load theme from localStorage
    const storedTheme = localStorage.getItem("theme") || "light";
    setIsLight(storedTheme === "light");
  }, []);

  // Save theme whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }, [isLight]);

  const handleDelete = (ticketId) => {
    const updatedTickets = tickets.filter(
      (ticket) => ticket.ticketId !== ticketId
    );
    setTickets(updatedTickets);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
  };

  const handleUpdate = (ticketId, updatedTicket) => {
    const updatedTickets = tickets.map((t) =>
      t.ticketId === ticketId
        ? { ...t, ...updatedTicket, updatedAt: new Date().toLocaleString() }
        : t
    );
    setTickets(updatedTickets);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
  };

  // Apply filters
  const filteredTickets = tickets.filter((ticket) => {
    const priorityMatch =
      priorityFilter === "All" || ticket.priority === priorityFilter;
    const statusMatch =
      statusFilter === "All" || ticket.status === statusFilter;
    return priorityMatch && statusMatch;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isLight ? "bg-gray-50 text-gray-900" : "bg-gray-900 text-gray-100"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-10 border-b p-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 shadow-sm transition-colors duration-300 ${
          isLight ? "bg-white border-gray-300" : "bg-gray-800 border-gray-700"
        }`}
      >
        <h1 className="text-2xl font-bold px-2">Ticket System</h1>

        <div className="flex flex-wrap gap-3 items-center">

            <button className="border border-gray-300 p-2.5 rounded" onClick={()=>{navigate('/drag')}}> Kanaban Board</button>
          {/* Theme Toggle */}
          <button
            onClick={() => setIsLight(!isLight)}
            className="p-2 border rounded-lg shadow-sm hover:shadow transition"
          >
            {isLight ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-moon"
              >
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sun"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            )}
          </button>

          {/* Report Button */}
          <button
            className="p-2 border rounded shadow hover:shadow-md transition"
            onClick={() => navigate("/report")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-no-axes-column-icon lucide-chart-no-axes-column"><path d="M5 21v-6"/><path d="M12 21V3"/><path d="M19 21V9"/></svg>
          </button>

          {/* Add Ticket */}
          <button
            onClick={() => navigate("/form")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-input-icon lucide-folder-input"><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><path d="M2 13h10"/><path d="m9 16 3-3-3-3"/></svg>
          </button>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm border-gray-300"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm border-gray-300"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </nav>

      {/* Push content below navbar */}
      <div className="pt-28 px-6">
        {filteredTickets.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 flex justify-center align-middle">
            No tickets found
          </p>
        ) : (
          <div
            className="grid gap-8 mt-5
              sm:grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4"
          >
            {filteredTickets.map((ticket, index) => (
              <Card
                key={index}
                ticket={ticket}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
