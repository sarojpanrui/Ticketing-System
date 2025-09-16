import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';


const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [user, setUser] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const storedTickets = localStorage.getItem("tickets");
        const storedUser = localStorage.getItem("loggedInUser");
        const storedComments = localStorage.getItem("comments");

        if (storedTickets) {
            const tickets = JSON.parse(storedTickets);
            const foundTicket = tickets.find((t) => t.ticketId === Number(id));
            setTicket(foundTicket);
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (storedComments) {
            setComments(JSON.parse(storedComments));
        }
    }, [id]);

    // Add comment
    function handleSubmit(e) {
        e.preventDefault();
        if (!comment.trim()) return;

        const newComment = {
            text: comment,
            createdAt: new Date().toString(),
            createdBy: user?.id,
            username: user?.username,
            ticketId: Number(id),
            role: user?.role,
        };

        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        localStorage.setItem("comments", JSON.stringify(updatedComments));
        setComment("");
        toast.success("Comment added...");
    }

    // Delete comment
    function handleDelete(commentToDelete) {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updated = comments.filter(
                    (c) =>
                        !(
                            c.ticketId === commentToDelete.ticketId &&
                            c.createdAt === commentToDelete.createdAt &&
                            c.createdBy === commentToDelete.createdBy
                        )
                );
                setComments(updated);
                localStorage.setItem("comments", JSON.stringify(updated));
                // toast.success("Comment deleted");


                Swal.fire({
                    title: "Deleted!",
                    text: "Your Comment has been deleted.",
                    icon: "success"
                });
            }
        });


    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-700 border border-red-300";
            case "Medium":
                return "bg-yellow-100 text-yellow-700 border border-yellow-300";
            case "Low":
                return "bg-green-100 text-green-700 border border-green-300";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Open":
                return "bg-blue-100 text-blue-700 border border-blue-300";
            case "In Progress":
                return "bg-purple-100 text-purple-700 border border-purple-300";
            case "Resolved":
                return "bg-gray-200 text-gray-700 border border-gray-400";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!ticket) {
        return <p className="p-4 text-gray-500 text-center"> Ticket not found.</p>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto merriweather">
            {/* Back Button */}
            <button
                className="mb-6 px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl shadow-sm transition-all flex cursor-pointer flex-row"
                onClick={() => navigate(-1)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>{" "}
                Back
            </button>

            {/* Ticket Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="lg:text-3xl font-bold mb-3 text-gray-900 text-xl">
                    {ticket.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {ticket.description}
                </p>

                {/* Status Row */}
                <div className="flex flex-wrap items-center gap-3">
                    <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getPriorityColor(
                            ticket.priority
                        )}`}
                    >
                        Priority: {ticket.priority}
                    </span>

                    <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                            ticket.status
                        )}`}
                    >
                        Status: {ticket.status}
                    </span>
                </div>

                {/* Dates */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 text-sm text-gray-600">
                    <span className="px-3 py-2 bg-gray-100 rounded-lg shadow-sm flex gap-2">
                        Created At: <strong>{formatDate(ticket.createdAt)}</strong>
                    </span>

                    <span className="px-3 py-2 bg-gray-100 rounded-lg shadow-sm flex gap-2">
                        Updated At:{" "}
                        <strong>
                            {ticket.updatedAt ? formatDate(ticket.updatedAt) : "Not updated"}
                        </strong>
                    </span>
                </div>

                {/* Comment Form */}
                <div className="mt-5">
                    <form className="flex gap-5" onSubmit={handleSubmit}>
                        <textarea
                            placeholder="Add comment"
                            className="border border-gray-300 rounded-2xl w-full resize-none text-center"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className="border p-3 border-gray-300 rounded-2xl bg-gray-100 shadow-xs cursor-pointer"
                            type="submit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                                <path d="m21.854 2.147-10.94 10.939" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Comment List */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Comments</h3>

                    {comments
                        .filter((c) => c.ticketId === Number(id))
                        .map((c) => (
                            <div
                                key={c.createdAt}
                                className="mb-3 p-3 border rounded-xl bg-gray-50 shadow-sm relative"
                            >
                                {/* Role Tag */}
                                <span
                                    className={`absolute -top-4 -left-2 px-2 py-0.5 text-xs font-semibold rounded-full ${c.role === "Admin"
                                        ? "bg-red-500 text-white"
                                        : "bg-green-500 text-white"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></svg>
                                </span>

                                <p className="text-gray-800">{c.text}</p>

                                <div className="text-xs text-gray-500 mt-1">
                                    By <strong>{c.username}</strong> on {formatDate(c.createdAt)}
                                </div>

                                {/* Actions (only author can delete) */}
                                {c.createdBy === user?.id && (
                                    <div className="flex gap-3 mt-2">
                                        <button
                                            onClick={() => handleDelete(c)}
                                            className="text-red-500 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;