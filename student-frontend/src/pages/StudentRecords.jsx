import React from "react";

const StudentRecords = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm px-8 py-4 flex items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded">
            📄
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Student Management System
            </h1>
            <p className="text-sm text-gray-500">
              Records & Documentation Portal
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b px-8">
        <ul className="flex gap-8 text-sm font-medium">
          <li className="border-b-2 border-blue-600 py-3 text-blue-600">
            Student Record
          </li>
          <li className="py-3 text-gray-600">Record Request</li>
          <li className="py-3 text-gray-600">Scheduling and Approval</li>
          <li className="py-3 text-gray-600">Billing and Payment</li>
          <li className="py-3 text-gray-600">Report and Monitoring</li>
          <li className="py-3 text-gray-600">Profile Management</li>
        </ul>
      </nav>

      {/* Banner */}
      <div className="px-8 mt-6">
        <div className="bg-blue-600 text-white rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold">
            Student Records Management
          </h2>
          <p className="text-sm mt-1">
            Submit requests, track status, and view your document request history
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 mt-6">
        <div className="bg-white rounded-xl shadow">

          <div className="flex border-b">
            <button className="px-6 py-3 border-b-2 border-blue-600 text-blue-600 font-medium">
              Submit Record Request
            </button>

            <button className="px-6 py-3 text-gray-500">
              Track Request Status
            </button>

            <button className="px-6 py-3 text-gray-500">
              View Request History
            </button>
          </div>

          {/* Form */}
          <div className="p-6">

            <h3 className="text-lg font-semibold mb-1">
              Submit New Record Request
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              Fill out the form below to request official documents
            </p>

            <form className="grid grid-cols-2 gap-6">

              <div>
                <label className="text-sm font-medium">
                  Student ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2020-12345"
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Document Type *
                </label>
                <select className="w-full mt-1 border rounded-lg p-2">
                  <option>Select document type</option>
                  <option>Transcript of Records</option>
                  <option>Certificate of Graduation</option>
                  <option>Diploma Copy</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Purpose of Request *
                </label>
                <select className="w-full mt-1 border rounded-lg p-2">
                  <option>Select purpose</option>
                  <option>Employment</option>
                  <option>Scholarship</option>
                  <option>Further Studies</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Number of Copies *
                </label>
                <input
                  type="number"
                  defaultValue="1"
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Delivery Mode *
                </label>
                <select className="w-full mt-1 border rounded-lg p-2">
                  <option>Select delivery mode</option>
                  <option>Pick-up</option>
                  <option>Email</option>
                  <option>Courier</option>
                </select>
              </div>

              <div className="col-span-2 mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Submit Request
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentRecords;