import { useState, useMemo } from "react";

// Mock data similar to the app's initial state
const complianceRecords = [
    {
      batchId: 'ASH-2024-B001',
      species: 'Withania somnifera',
      nmpbCompliance: 'APPROVED',
      ayushCertification: 'APPROVED',
      lastAudit: '2025-09-05T10:00:00Z',
    },
    {
      batchId: 'TUR-2024-B002',
      species: 'Curcuma longa',
      nmpbCompliance: 'APPROVED',
      ayushCertification: 'UNDER_REVIEW',
      lastAudit: '2025-09-02T15:30:00Z',
    },
    {
      batchId: 'BRA-2024-B003',
      species: 'Bacopa monnieri',
      nmpbCompliance: 'PENDING',
      ayushCertification: 'PENDING',
      lastAudit: '2025-08-16T11:00:00Z',
    },
    {
      batchId: 'TUL-2024-B004',
      species: 'Ocimum tenuiflorum',
      nmpbCompliance: 'APPROVED',
      ayushCertification: 'APPROVED',
      lastAudit: '2025-07-21T09:00:00Z',
    }
];

// Helper to get status badge styles
const getStatusBadge = (status) => {
    switch (status) {
        case 'APPROVED':
            return 'bg-green-100 text-green-800';
        case 'UNDER_REVIEW':
            return 'bg-yellow-100 text-yellow-800';
        case 'PENDING':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};


export default function Compliance() {
  const [records] = useState(complianceRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geminiReport, setGeminiReport] = useState(null);

  // Filtered records based on search and dropdown filter
  const filteredRecords = useMemo(() => {
    return records
      .filter(rec => {
        const lowerSearch = searchTerm.toLowerCase();
        return rec.batchId.toLowerCase().includes(lowerSearch) || 
               rec.species.toLowerCase().includes(lowerSearch);
      })
      .filter(rec => {
        if (filterStatus === 'all') return true;
        return rec.ayushCertification === filterStatus || rec.nmpbCompliance === filterStatus;
      });
  }, [records, searchTerm, filterStatus]);

  // Quick stats
  const total = records.length;
  const approved = records.filter(r => r.ayushCertification === "APPROVED").length;
  const pending = total - approved;
  
  // Mock function to simulate calling the Gemini API
  const handleAnalyzeCompliance = async () => {
      setIsAnalyzing(true);
      setGeminiReport(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      const reportHtml = `
          <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 class="text-xl font-bold text-gray-800 mb-4">✨ AI Compliance Risk Analysis</h3>
              <div>
                  <h4 class="text-lg font-semibold text-[#1E6F5C] mt-4 mb-2">Overall Summary</h4>
                  <p class="text-gray-700">The current batch data indicates a mixed compliance landscape. While two batches (ASH-2024-B001, TUL-2024-B004) are fully approved, two others require immediate attention. Batch BRA-2024-B003 is high-risk due to pending status in both NMPB and AYUSH certifications, and TUR-2024-B002 needs follow-up for its AYUSH certification.</p>
                  
                  <h4 class="text-lg font-semibold text-[#1E6F5C] mt-6 mb-2">High-Risk Batches</h4>
                  <ul class="list-disc pl-5 space-y-2 text-gray-700">
                      <li><strong>BRA-2024-B003 (Bacopa monnieri):</strong> Status is 'PENDING' for both NMPB and AYUSH. This could indicate missing documentation or a failed preliminary check. This batch cannot proceed in the supply chain.</li>
                      <li><strong>TUR-2024-B002 (Curcuma longa):</strong> AYUSH certification is 'UNDER_REVIEW'. While NMPB is approved, the final certification is a critical bottleneck.</li>
                  </ul>

                  <h4 class="text-lg font-semibold text-[#1E6F5C] mt-6 mb-2">Actionable Recommendations</h4>
                  <ol class="list-decimal pl-5 space-y-2 text-gray-700">
                      <li>For <strong>BRA-2024-B003</strong>: Immediately contact the supplier to upload the required NMPB compliance forms and quality test results to the portal. Escalate to the compliance officer if no response is received within 48 hours.</li>
                      <li>For <strong>TUR-2024-B002</strong>: Follow up with the AYUSH certification body to check the status of the review. Provide any additional information they might require to expedite the process.</li>
                  </ol>
              </div>
          </div>
      `;
      setGeminiReport(reportHtml);
      setIsAnalyzing(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-2">Compliance Monitor</h2>
      <p className="text-gray-600 mb-8">Efficiently monitor and verify compliance with NMPB and AYUSH guidelines.</p>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card">
              <h3 className="text-gray-500 font-medium">Total Batches</h3>
              <p className="text-3xl font-bold mt-2 text-[#1E6F5C]">{total}</p>
          </div>
          <div className="stat-card">
              <h3 className="text-gray-500 font-medium">Fully Approved</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">{approved}</p>
          </div>
          <div className="stat-card">
              <h3 className="text-gray-500 font-medium">Pending/Under Review</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-600">{pending}</p>
          </div>
      </div>

      {/* Controls and Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <input 
                type="text" 
                placeholder="Search by Batch ID or Species..." 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29BB89] focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <select 
                className="w-full sm:w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29BB89] focus:outline-none"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
            >
                <option value="all">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
            </select>
            <button 
                onClick={handleAnalyzeCompliance}
                className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow flex items-center justify-center space-x-2 flex-shrink-0"
                disabled={isAnalyzing}
            >
                <span>✨</span>
                <span>{isAnalyzing ? "Analyzing..." : "Analyze Risks"}</span>
            </button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4 font-semibold">Batch ID</th>
                        <th className="p-4 font-semibold">Species</th>
                        <th className="p-4 font-semibold">AYUSH Certification</th>
                        <th className="p-4 font-semibold">NMPB Compliance</th>
                        <th className="p-4 font-semibold">Last Audit</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecords.map((rec) => (
                        <tr key={rec.batchId} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-mono text-sm">{rec.batchId}</td>
                            <td className="p-4">{rec.species}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(rec.ayushCertification)}`}>
                                    {rec.ayushCertification.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="p-4">
                               <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(rec.nmpbCompliance)}`}>
                                    {rec.nmpbCompliance}
                               </span>
                            </td>
                            <td className="p-4 text-sm">{new Date(rec.lastAudit).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Gemini AI Report Section */}
      <div className="mt-8">
        {isAnalyzing && (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                <p className="font-semibold text-gray-600">✨ Generating AI Compliance Report... Please wait.</p>
            </div>
        )}
        {geminiReport && (
            <div dangerouslySetInnerHTML={{ __html: geminiReport }} />
        )}
      </div>

    </div>
  );
}