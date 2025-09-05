import { useState, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X } from 'lucide-react';

// Mock data representing the entire supply chain, similar to your original appData
const supplyChainData = {
  collectionEvents: [
    { id: 'CE001', blockchainTxHash: '0x4a7b2c9e...', species: 'Withania somnifera (Ashwagandha)', geoLocation: { lat: 28.61, lng: 77.20, zone: 'Delhi-NCR Approved Zone' }, collectorName: 'Ramesh Kumar Collective', harvestDate: '2025-09-01T06:30:00Z', batchId: 'ASH-2024-B001' },
    { id: 'CE002', blockchainTxHash: '0x7c3f8d1a...', species: 'Curcuma longa (Turmeric)', geoLocation: { lat: 20.95, lng: 85.09, zone: 'Odisha Organic Zone' }, collectorName: 'Green Valley Farms', harvestDate: '2025-09-02T07:15:00Z', batchId: 'TUR-2024-B002' },
    { id: 'CE003', blockchainTxHash: '0x9e2d1f8a...', species: 'Bacopa monnieri (Brahmi)', geoLocation: { lat: 22.57, lng: 88.36, zone: 'West Bengal Wetlands' }, collectorName: 'Sundarban Collectors', harvestDate: '2025-08-15T09:00:00Z', batchId: 'BRA-2024-B003' }
  ],
  processingSteps: [
    { id: 'PS001', blockchainTxHash: '0x8b4e9f2c...', batchId: 'ASH-2024-B001', facilityName: 'Ayush Processing Unit, Haridwar', stepType: 'Primary Cleaning & Sorting', timestamp: '2025-09-01T14:00:00Z' },
    { id: 'PS002', blockchainTxHash: '0x3a6d7e8f...', batchId: 'ASH-2024-B001', facilityName: 'Ayush Processing Unit, Haridwar', stepType: 'Solar Drying', timestamp: '2025-09-02T10:00:00Z' },
  ],
  qualityTests: [
    { id: 'QT001', blockchainTxHash: '0x9c5f2a7b...', batchId: 'ASH-2024-B001', labName: 'NIA Testing Lab', testType: 'DNA Barcoding', result: 'Withania somnifera confirmed', status: 'PASS', testDate: '2025-09-03T14:45:00Z' },
    { id: 'QT002', blockchainTxHash: '0x1d8e4b6c...', batchId: 'ASH-2024-B001', labName: 'NIA Testing Lab', testType: 'Pesticide Residue', result: 'Not Detected', status: 'PASS', testDate: '2025-09-04T11:15:00Z' },
  ],
  compliance: [
    { batchId: 'ASH-2024-B001', species: 'Withania somnifera', status: 'APPROVED' },
    { batchId: 'TUR-2024-B002', species: 'Curcuma longa', status: 'UNDER_REVIEW' },
    { batchId: 'BRA-2024-B003', species: 'Bacopa monnieri', status: 'PENDING' }
  ]
};

// --- Helper function to generate and download a FHIR Bundle ---
function downloadFhirReport(batchId, data) {
    const collection = data.collectionEvents.find(e => e.batchId === batchId);
    if (!collection) return;

    const bundle = {
        resourceType: "Bundle", id: `bundle-${batchId}`, type: "collection",
        entry: [{
            fullUrl: `urn:uuid:medication-${batchId}`,
            resource: { resourceType: "Medication", id: `medication-${batchId}`, code: { text: collection.species }, batch: { lotNumber: batchId } }
        }]
    };
    // In a real app, you would add all processing and testing events here as Provenance or Observation resources.
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `FHIR-Report-${batchId}.json`;
    a.click();
}


export default function Trace() {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [isQrModalOpen, setQrModalOpen] = useState(false);

  // Memoize the derived data for the selected batch to avoid recalculation
  const traceData = useMemo(() => {
    if (!selectedBatchId) return null;
    return {
      collection: supplyChainData.collectionEvents.find(e => e.batchId === selectedBatchId),
      processing: supplyChainData.processingSteps.filter(p => p.batchId === selectedBatchId),
      testing: supplyChainData.qualityTests.filter(t => p.batchId === selectedBatchId),
    };
  }, [selectedBatchId]);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-2">Trace a Batch</h2>
      <p className="text-gray-600 mb-8">Select a batch from the cards below to view its complete journey from harvest to verification.</p>

      {/* Batch Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {supplyChainData.compliance.map(batch => (
          <div 
            key={batch.batchId}
            onClick={() => setSelectedBatchId(batch.batchId)}
            className={`stat-card p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${selectedBatchId === batch.batchId ? 'ring-2 ring-[#1E6F5C]' : ''}`}
          >
            <p className="font-mono text-sm text-gray-500">{batch.batchId}</p>
            <h4 className="font-bold text-lg text-[#1E6F5C] mt-1">{batch.species}</h4>
          </div>
        ))}
      </div>

      <hr className="my-8" />

      {/* Trace Timeline Results */}
      <div className="mt-8">
        {!traceData ? (
          <div className="text-center text-gray-500 py-12">
            <h3 className="text-lg font-medium text-gray-900">Select a Batch</h3>
            <p className="mt-1 text-sm">Choose a batch card above to see its detailed timeline.</p>
          </div>
        ) : (
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Traceability Report for {selectedBatchId}</h3>
              <div className="flex items-center space-x-3">
                <button onClick={() => setQrModalOpen(true)} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm">Generate QR Code</button>
                <button onClick={() => downloadFhirReport(selectedBatchId, supplyChainData)} className="bg-[#1E6F5C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#165a49] transition-colors text-sm">Download FHIR Report</button>
              </div>
            </div>
            
            <div className="border-l-2 border-gray-200 ml-10 pl-8 relative space-y-12 py-4">
                {/* Collection Event */}
                <div className="timeline-item">
                    <h3 className="text-lg font-semibold text-[#1E6F5C]">1. Collection & Harvest</h3>
                    <p className="text-sm text-gray-500">{new Date(traceData.collection.harvestDate).toUTCString()}</p>
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                        <p><strong>Species:</strong> {traceData.collection.species}</p>
                        <p><strong>Location:</strong> {traceData.collection.geoLocation.lat}, {traceData.collection.geoLocation.lng}</p>
                        <p><strong>Collector:</strong> {traceData.collection.collectorName}</p>
                        <p className="font-mono text-xs text-gray-400 mt-2">Tx: {traceData.collection.blockchainTxHash}</p>
                    </div>
                </div>
                
                {/* Processing Events */}
                {traceData.processing.length > 0 && (
                     <div className="timeline-item">
                        <h3 className="text-lg font-semibold text-[#1E6F5C]">2. Processing</h3>
                        {traceData.processing.map(p => (
                             <div key={p.id} className="mt-4">
                                <p className="text-sm text-gray-500">{new Date(p.timestamp).toUTCString()}</p>
                                <div className="mt-2 bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                                   <p><strong>Step:</strong> {p.stepType}</p>
                                   <p><strong>Facility:</strong> {p.facilityName}</p>
                                   <p className="font-mono text-xs text-gray-400 mt-2">Tx: {p.blockchainTxHash}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                )}

                {/* Quality Test Events */}
                {traceData.testing.length > 0 && (
                    <div className="timeline-item">
                        <h3 className="text-lg font-semibold text-[#1E6F5C]">3. Quality Testing</h3>
                        {traceData.testing.map(t => (
                            <div key={t.id} className="mt-4">
                                <p className="text-sm text-gray-500">{new Date(t.testDate).toUTCString()}</p>
                                <div className="mt-2 bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                                   <p><strong>Test:</strong> {t.testType}</p>
                                   <p><strong>Result:</strong> {t.result} <span className={`font-bold ${t.status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>{t.status}</span></p>
                                   <p><strong>Lab:</strong> {t.labName}</p>
                                   <p className="font-mono text-xs text-gray-400 mt-2">Tx: {t.blockchainTxHash}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center relative">
            <button onClick={() => setQrModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">Scan for Traceability Details</h3>
            <div className="flex justify-center items-center my-6">
              <QRCodeCanvas value={`${window.location.origin}/trace/${selectedBatchId}`} size={200} />
            </div>
            <p className="font-mono text-gray-600">Batch ID: {selectedBatchId}</p>
          </div>
        </div>
      )}
    </div>
  );
}