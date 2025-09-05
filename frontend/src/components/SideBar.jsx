import { NavLink } from "react-router-dom";
import { Gauge, Map, PackageSearch, ShieldCheck } from 'lucide-react'; // Using lucide-react for clean icons

export default function Sidebar() {
  // Common style for NavLink
  const linkClasses = "flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100";
  
  // Style for the active NavLink
  const activeLinkClasses = "bg-[#E3F4F4] text-[#1E6F5C] font-semibold";

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col fixed">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-[#1E6F5C]">AyuTrace</h1>
        <p className="text-sm text-gray-500">Herb Traceability Platform</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <Gauge className="h-5 w-5 mr-3" />
          Overview
        </NavLink>
        <NavLink 
          to="/explorer" 
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <Map className="h-5 w-5 mr-3" />
          Supply Chain Explorer
        </NavLink>
        <NavLink 
          to="/trace" 
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <PackageSearch className="h-5 w-5 mr-3" />
          Trace a Batch
        </NavLink>
        <NavLink 
          to="/compliance" 
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <ShieldCheck className="h-5 w-5 mr-3" />
          Compliance Monitor
        </NavLink>
      </nav>
    </aside>
  );
}