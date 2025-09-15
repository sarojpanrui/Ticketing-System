import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const TaskForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const[username, setUsername]=useState('');

  // Get logged-in user id
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUserId(loggedInUser.id);
      setUsername(loggedInUser.username);
    }
  }, []);

  
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .required("Title is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .required("Description is required"),
    priority: Yup.string().oneOf(["Low", "Medium", "High"]).required(),
    status: Yup.string()
      .oneOf(["Open", "In Progress", "Resolved"])
      .required("Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      priority: "Medium",
      status: "Open", // default value
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const ticket = {
        ...values,
        id: userId,
        user : username,
        ticketId: Date.now(),
        createdAt: new Date().toLocaleString(),
      };

      const existingTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      const updatedTickets = [...existingTickets, ticket];
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));

      console.log("Saved Ticket:", ticket);

      resetForm();
      toast.success('Ticket saved successfully')
      navigate("/");
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-2xl/10 border border-gray-300 mt-10">
      <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
              formik.touched.title && formik.errors.title
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
            placeholder="Enter task title"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
              formik.touched.description && formik.errors.description
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
            placeholder="Enter task description"
            rows={4}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
              formik.touched.status && formik.errors.status
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.status}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Create Ticket
        </button>

        <a href="/" className="text-blue-500 mt-2 block text-center">
          Back to home
        </a>
      </form>
    </div>
  );
};

export default TaskForm;