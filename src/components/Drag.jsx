import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KanbanDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [draggedTicketId, setDraggedTicketId] = useState(null);

  const priorities = ["High", "Medium", "Low"];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tickets")) || [];
    setTickets(stored);
  }, []);

  // Drag & Drop Handlers
  const handleDragStart = (e, ticketId) => {
    setDraggedTicketId(ticketId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, priority) => {
    e.preventDefault();
    if (!draggedTicketId) return;

    const updatedTickets = tickets.map((t) =>
      t.ticketId === draggedTicketId ? { ...t, priority } : t
    );
    setTickets(updatedTickets);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
    setDraggedTicketId(null);
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20" height="20"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span className="font-medium">Back</span>
      </button>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {priorities.map((priority) => (
          <div
            key={priority}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, priority)}
            className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition flex flex-col min-h-[250px]"
          >
            <h2
              className={`font-bold mb-4 text-center text-lg tracking-wide ${
                priority === "High"
                  ? "text-red-500"
                  : priority === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {priority} Priority
            </h2>

            <div className="flex flex-col gap-3">
              {tickets
                .filter((t) => t.priority === priority)
                .map((ticket) => (
                  <div
                    key={ticket.ticketId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ticket.ticketId)}
                    onClick={() => handleTicketClick(ticket.ticketId)}
                    className="p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 cursor-grab hover:shadow-md hover:scale-[1.02] transition transform"
                  >
                    <h3 className="font-semibold text-gray-800 truncate">
                      {ticket.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {ticket.description}
                    </p>
                  </div>
                ))}
              {tickets.filter((t) => t.priority === priority).length === 0 && (
                <p className="text-gray-400 text-center italic">No tickets</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
