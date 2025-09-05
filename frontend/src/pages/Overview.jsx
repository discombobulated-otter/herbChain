import { useEffect, useState } from "react";
import { Leaf, Package, TestTube, Truck, MapPin, Shield, TrendingUp, AlertCircle, CheckCircle, Clock, Users, Database } from "lucide-react";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Your actual API call - replace with axios when needed
    fetch("http://localhost:5000/overview")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching overview:", err);
        // Fallback data for development
        setStats({
          totalCollections: 1247,
          totalProcessing: 892,
          totalQualityTests: 567,
          totalPackages: 423,
          compliance: {
            validHarvests: 1180,
            invalidHarvests: 67,
            rate: 94.6
          },
          recentActivity: 34,
          activeFarmers: 156,
          sustainabilityScore: 87
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-green-200 rounded-lg w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-xl shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon size={20} className="text-white" />
            </div>
            <h3 className="font-medium text-gray-700 text-sm">{title}</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value?.toLocaleString() || 0}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp size={16} />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  const complianceRate = stats?.compliance?.rate || 0;
  const getComplianceColor = () => {
    if (complianceRate >= 95) return "text-green-600";
    if (complianceRate >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Leaf className="text-white" size={24} />
              </div>
              <span>Network Overview</span>
            </h1>
            <p className="text-gray-600 mt-2">Real-time blockchain-powered herb supply chain insights</p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Network Active</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={MapPin}
            title="Total Collections"
            value={stats.totalCollections}
            subtitle="GPS-tagged harvests"
            color="bg-green-600"
            trend="+12%"
          />
          <StatCard
            icon={Truck}
            title="Processing Steps"
            value={stats.totalProcessing}
            subtitle="Supply chain events"
            color="bg-blue-600"
            trend="+8%"
          />
          <StatCard
            icon={TestTube}
            title="Lab Tests"
            value={stats.totalQualityTests}
            subtitle="Quality certifications"
            color="bg-purple-600"
            trend="+15%"
          />
          <StatCard
            icon={Package}
            title="Packaged Batches"
            value={stats.totalPackages}
            subtitle="Ready for market"
            color="bg-orange-600"
            trend="+6%"
          />
        </div>

        {/* Compliance Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-600 rounded-lg">
                <Shield size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Compliance Summary</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="font-medium text-gray-700">Valid Harvests</span>
                </div>
                <span className="text-xl font-bold text-green-600">{stats?.compliance?.validHarvests || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="font-medium text-gray-700">Invalid Harvests</span>
                </div>
                <span className="text-xl font-bold text-red-600">{stats?.compliance?.invalidHarvests || 0}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Overall Compliance Rate</span>
                  <span className={`text-2xl font-bold ${getComplianceColor()}`}>
                    {complianceRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      complianceRate >= 95 ? 'bg-green-600' :
                      complianceRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(complianceRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Blockchain Network</span>
                </div>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Smart Contracts</span>
                </div>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">IoT Connectivity</span>
                </div>
                <span className="text-yellow-600 font-medium">Limited</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}