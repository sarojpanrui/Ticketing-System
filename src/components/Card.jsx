import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Card = ({ ticket, onUpdate, onDelete }) => {
      const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
    });

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Save edits
    const handleSave = () => {
        const updatedTicket = {
            ...ticket,
            ...form,
            updatedAt: new Date().toLocaleString(),
        };
        onUpdate(ticket.ticketId, updatedTicket);
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition">
            {isEditing ? (
                <>
                    {/* Editable Fields */}
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded mb-2"
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded mb-2"
                    />

                    <div className="flex gap-2 mb-3">
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded"
                        >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded"
                        >
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </select>
                    </div>

                    {/* Save / Cancel */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* Normal Ticket View */}
                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{ticket.title}</h2>
                    <p className="text-gray-600 mb-4 truncate">{ticket.description}</p>

                    <div className="flex justify-between text-sm">
                        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                            {ticket.priority}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            {ticket.status}
                        </span>
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                        <p>Created: {ticket.createdAt}</p>
                        {ticket.updatedAt && <p>Updated: {ticket.updatedAt}</p>}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                        </button>
                        <button
                            onClick={() => onDelete(ticket.ticketId)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>

                        <button className="border p-1 border-gray-300 bg-gray-200 rounded cursor-pointer" onClick={() => navigate(`/ticket/${ticket.ticketId}`)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg></button>
                    </div>
                </>
            )}


        </div>
    );
};

export default Card;
