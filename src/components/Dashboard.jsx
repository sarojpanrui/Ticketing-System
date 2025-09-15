import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLight, setIsLight] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // NEW

  const navigate = useNavigate();

  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    setTickets(storedTickets);

    const storedTheme = localStorage.getItem("theme") || "light";
    setIsLight(storedTheme === "light");
  }, []);

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
        className={`fixed top-0 left-0 w-full z-10 border-b p-4 flex justify-between items-center shadow-sm transition-colors duration-300 ${
          isLight ? "bg-white border-gray-300" : "bg-gray-800 border-gray-700"
        }`}
      >
        <h1 className="text-2xl font-bold px-2">Ticket System</h1>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden p-2 border rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            // Close icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Nav Items */}
        <div
          className={`flex flex-col md:flex-row gap-3 items-center absolute md:static top-full left-0 w-full md:w-auto p-4 md:p-0 transition-all duration-300 ${
            menuOpen
              ? "block bg-white dark:bg-gray-800 shadow-md md:shadow-none"
              : "hidden md:flex"
          }`}
        >
          {/* Kanban */}
          <button
            onClick={() => navigate("/drag")}
            className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition group cursor-pointer"
          >
            <p className="hidden group-hover:block font-medium text-gray-700">
              Kanban Board
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 group-hover:text-blue-500 transition"
            >
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
            </svg>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsLight(!isLight)}
            className="p-2 border rounded-lg shadow-sm hover:shadow transition border-gray-300 cursor-pointer bg-white"
          >
            {isLight ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                stroke="currentColor"
                fill="none"
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
                stroke="currentColor"
                fill="none"
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

          {/* Reports */}
          <button
            onClick={() => navigate("/report")}
            className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition group cursor-pointer"
          >
            <p className="hidden group-hover:block font-medium text-gray-700">
              Reports
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 21v-6" />
              <path d="M12 21V3" />
              <path d="M19 21V9" />
            </svg>
          </button>

          {/* Add Ticket */}
          <button
            onClick={() => navigate("/form")}
            className="flex items-center gap-2 border border-blue-500 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium shadow-sm hover:shadow-md hover:bg-blue-600 transition cursor-pointer "
          >
            <p className="font-medium">Add Ticket</p>
          </button>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm border-gray-300 cursor-pointer bg-white"
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
            className="border px-3 py-2 rounded-lg shadow-sm border-gray-300 cursor-pointer bg-white"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
              <path d="m9.5 10.5 5 5" />
              <path d="m14.5 10.5-5 5" />
            </svg>
          </p>
        ) : (
          <div
            className="grid gap-8 mt-0 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:mt-10 lg:mt-0"
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
