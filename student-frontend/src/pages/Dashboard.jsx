import { useState, useEffect } from "react"
import Skeleton from "../components/Skeleton"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("submit")

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const historyData = [
    {
      id: "REQ-001",
      document: "Transcript of Records",
      date: "2026-03-01",
      status: "Approved",
    },
    {
      id: "REQ-002",
      document: "Certificate of Graduation",
      date: "2026-03-05",
      status: "Pending",
    },
    {
      id: "REQ-003",
      document: "Good Moral Certificate",
      date: "2026-03-08",
      status: "Ready for Pickup",
    },
  ]

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton variant="card" className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Records Management
        </h1>
        <p className="text-gray-500">
          Submit requests, track status, and view request history
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border">

        <div className="flex border-b">

          <button
            onClick={() => setActiveTab("submit")}
            className={`px-6 py-3 ${
              activeTab === "submit"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Submit Record Request
          </button>

          <button
            onClick={() => setActiveTab("track")}
            className={`px-6 py-3 ${
              activeTab === "track"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Track Request Status
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 ${
              activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            View Request History
          </button>

        </div>

        <div className="p-6">

          {/* Submit Request */}
          {activeTab === "submit" && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="text-sm font-medium">
                  Student ID
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="2020-12345"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="Juan Dela Cruz"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">
                  Document Type
                </label>
                <select className="w-full border rounded-lg p-2 mt-1">
                  <option>Select document</option>
                  <option>Transcript of Records</option>
                  <option>Certificate of Graduation</option>
                  <option>Good Moral Certificate</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Number of Copies
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 mt-1"
                  defaultValue="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Delivery Mode
                </label>
                <select className="w-full border rounded-lg p-2 mt-1">
                  <option>Pick-up</option>
                  <option>Email</option>
                  <option>Courier</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                  Submit Request
                </button>
              </div>

            </form>
          )}

          {/* Track Request */}
          {activeTab === "track" && (
            <div className="space-y-4">

              <h3 className="text-lg font-semibold">
                Track Request Status
              </h3>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter Request ID (REQ-001)"
                  className="border rounded-lg p-2 w-full"
                />

                <button className="bg-blue-600 text-white px-4 rounded-lg">
                  Search
                </button>
              </div>

              {/* Example Result */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <p><strong>Request ID:</strong> REQ-001</p>
                <p><strong>Document:</strong> Transcript of Records</p>
                <p><strong>Status:</strong> Approved</p>
                <p><strong>Release Date:</strong> March 10, 2026</p>
              </div>

            </div>
          )}

          {/* Request History */}
          {activeTab === "history" && (
            <div>

              <h3 className="text-lg font-semibold mb-4">
                Request History
              </h3>

              <div className="overflow-x-auto">

                <table className="w-full border">

                  <thead className="bg-gray-100">

                    <tr>
                      <th className="p-3 text-left">Request ID</th>
                      <th className="p-3 text-left">Document</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>

                  </thead>

                  <tbody>

                    {historyData.map((item) => (
                      <tr key={item.id} className="border-t">

                        <td className="p-3">{item.id}</td>
                        <td className="p-3">{item.document}</td>
                        <td className="p-3">{item.date}</td>

                        <td className="p-3">
                          <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-700">
                            {item.status}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default Dashboard