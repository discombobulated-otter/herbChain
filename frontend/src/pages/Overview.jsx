import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ShieldCheck, Sprout, TestTube, Boxes, CheckCircle, Clock } from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// --- Reusable StatCard Component ---
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="stat-card">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <p className={`text-3xl font-bold mt-1 ${color.replace('bg', 'text')}`}>{value}</p>
      </div>
    </div>
  </div>
);


// --- Main Overview Component ---
export default function Overview() {
    // Consistent data source used across the app
    const supplyChainData = useMemo(() => ({
      collectionEvents: [
        { id: 'CE001', commonName: 'Ashwagandha', harvestDate: '2025-09-01T06:30:00Z', batchId: 'ASH-2024-B001' },
        { id: 'CE002', commonName: 'Turmeric', harvestDate: '2025-09-02T07:15:00Z', batchId: 'TUR-2024-B002' },
        { id: 'CE003', commonName: 'Brahmi', harvestDate: '2025-08-15T09:00:00Z', batchId: 'BRA-2024-B003' }
      ],
      compliance: [
        { batchId: 'ASH-2024-B001', species: 'Withania somnifera', status: 'APPROVED' },
        { batchId: 'TUR-2024-B002', species: 'Curcuma longa', status: 'APPROVED' },
        { batchId: 'BRA-2024-B003', species: 'Bacopa monnieri', status: 'PENDING' }
      ]
    }), []);

    // Derive statistics from the data source
    const stats = useMemo(() => {
        const totalBatches = supplyChainData.compliance.length;
        const approvedBatches = supplyChainData.compliance.filter(c => c.status === 'APPROVED').length;
        const complianceRate = totalBatches > 0 ? ((approvedBatches / totalBatches) * 100) : 0;
        const uniqueSpecies = new Set(supplyChainData.collectionEvents.map(e => e.commonName)).size;
        
        return {
            totalBatches,
            approvedBatches,
            pendingBatches: totalBatches - approvedBatches,
            complianceRate: complianceRate.toFixed(0) + '%',
            uniqueSpecies,
            transactionsToday: 156 // Static value for demonstration
        };
    }, [supplyChainData]);

    // Data for the Doughnut chart
    const chartData = {
        labels: ['Approved', 'Pending/Review'],
        datasets: [{
            data: [stats.approvedBatches, stats.pendingBatches],
            backgroundColor: ['#1E6F5C', '#F5A623'],
            borderColor: '#FDFBF8', // Matches page background
            borderWidth: 4,
        }],
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 14, family: "'Inter', sans-serif" } } }
        }
    };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-2">Network Overview</h2>
      <p className="text-gray-600 mb-8">A real-time summary of supply chain activities and compliance metrics.</p>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Boxes} title="Total Batches" value={stats.totalBatches} color="bg-[#1E6F5C]" />
        <StatCard icon={ShieldCheck} title="Compliance Rate" value={stats.complianceRate} color="bg-green-500" />
        <StatCard icon={Sprout} title="Unique Species" value={stats.uniqueSpecies} color="bg-blue-500" />
        <StatCard icon={TestTube} title="Transactions Today" value={stats.transactionsToday} color="bg-orange-500" />
      </div>

      {/* Charts and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Compliance Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-center">Batch Compliance Status</h3>
          <div className="relative h-96">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="text-green-600" size={20}/></div>
                    <div>
                        <p className="font-medium text-gray-800">Batch TUR-2024-B002 Approved</p>
                        <p className="text-sm text-gray-500">AYUSH certification status updated to 'APPROVED'.</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center"><Clock size={12} className="mr-1"/> just now</p>
                    </div>
                </li>
                 <li className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full"><Sprout className="text-blue-600" size={20}/></div>
                    <div>
                        <p className="font-medium text-gray-800">New Harvest Logged</p>
                        <p className="text-sm text-gray-500">A new batch of Brahmi was collected in West Bengal.</p>
                         <p className="text-xs text-gray-400 mt-1 flex items-center"><Clock size={12} className="mr-1"/> 2 hours ago</p>
                    </div>
                </li>
                 <li className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full"><TestTube className="text-purple-600" size={20}/></div>
                    <div>
                        <p className="font-medium text-gray-800">Lab Results Submitted</p>
                        <p className="text-sm text-gray-500">Pesticide analysis for ASH-2024-B001 passed.</p>
                         <p className="text-xs text-gray-400 mt-1 flex items-center"><Clock size={12} className="mr-1"/> 1 day ago</p>
                    </div>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
}