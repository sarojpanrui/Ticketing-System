import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function KanbanDashboard() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [draggedTicketId, setDraggedTicketId] = useState(null);

    const priorities = ["High", "Medium", "Low"];

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("tickets")) || [];
        setTickets(stored);
    }, []);

    // Drag Handlers
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

    // Drop on Delete Zone
    const handleDeleteDrop = (e) => {
        e.preventDefault();
        if (!draggedTicketId) return;

        Swal.fire({
            title: "Are you sure?",
            text: "This ticket will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedTickets = tickets.filter(
                    (t) => t.ticketId !== draggedTicketId
                );
                setTickets(updatedTickets);
                localStorage.setItem("tickets", JSON.stringify(updatedTickets));
                Swal.fire("Deleted!", "The ticket has been removed.", "success");
            }
            setDraggedTicketId(null);
        });
    };

    const handleTicketClick = (ticketId) => {
        navigate(`/ticket/${ticketId}`);
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Back Button */}
            <button
                onClick={() => navigate("/")}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition cursor-pointer w-[8%]"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>
                <span className="font-medium">Back</span>
            </button>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                {priorities.map((priority) => (
                    <div
                        key={priority}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, priority)}
                        className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition flex flex-col min-h-[250px]"
                    >
                        <h2
                            className={`font-bold mb-4 text-center text-lg tracking-wide ${priority === "High"
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
                                        <p className="text-sm text-black truncate flex  font-bold">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 20a6 6 0 0 0-12 0" />
                                                <circle cx="12" cy="10" r="4" />
                                                <circle cx="12" cy="12" r="10" />
                                            </svg>
                                            {ticket.user}
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

            {/*Delete Zone */}
            <div
                onDragOver={handleDragOver}
                onDrop={handleDeleteDrop}
                className="mt-8 mx-auto w-48 h-20 bg-red-100 border-2 border-red-400 rounded-xl flex items-center justify-center text-red-600 font-bold cursor-pointer hover:bg-red-200 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                
            </div>
        </div>
    );
}