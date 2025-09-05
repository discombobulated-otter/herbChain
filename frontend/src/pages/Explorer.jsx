import { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js'; // Using the official react-plotly.js wrapper

// Mock data for initial harvest locations
const initialCollectionEvents = [
    { id: 'CE001', commonName: 'Ashwagandha', species: 'Withania somnifera', collectorName: 'Ramesh Kumar Collective', geoLocation: { lat: 28.6139, lng: 77.2090 } },
    { id: 'CE002', commonName: 'Turmeric', species: 'Curcuma longa', collectorName: 'Green Valley Farms', geoLocation: { lat: 20.9517, lng: 85.0985 } },
    { id: 'CE003', commonName: 'Brahmi', species: 'Bacopa monnieri', collectorName: 'Sundarban Collectors', geoLocation: { lat: 22.5726, lng: 88.3639 } }
];

export default function Explorer() {
    const [collectionEvents, setCollectionEvents] = useState(initialCollectionEvents);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [locationStatus, setLocationStatus] = useState("");
    const [formData, setFormData] = useState({
        species: '',
        commonName: '',
        collectorName: '',
        lat: '',
        lng: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus("Geolocation is not supported by your browser.");
            return;
        }
        setLocationStatus("Fetching location...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    lat: position.coords.latitude.toFixed(6),
                    lng: position.coords.longitude.toFixed(6)
                }));
                setLocationStatus("Location captured successfully!");
            },
            () => {
                setLocationStatus("Unable to retrieve location. Please enter manually.");
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEvent = {
            id: `CE${collectionEvents.length + 1}`,
            commonName: formData.commonName,
            species: formData.species,
            collectorName: formData.collectorName,
            geoLocation: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) }
        };
        setCollectionEvents([...collectionEvents, newEvent]);
        handleCancel(); // Hide and reset form
        alert('New harvest event logged successfully!');
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setLocationStatus("");
        setFormData({ species: '', commonName: '', collectorName: '', lat: '', lng: '' });
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-2">Supply Chain Explorer</h2>
            <p className="text-gray-600 mb-6">Visualize herb origins or log a new harvest event. Each point represents a GPS-tagged harvest.</p>
            
            <div className="mb-6">
                {!isFormVisible && (
                    <button 
                        onClick={() => setIsFormVisible(true)}
                        className="bg-[#1E6F5C] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#165a49] transition-colors shadow"
                    >
                        Log New Harvest
                    </button>
                )}
                
                {isFormVisible && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-semibold mb-4">New Harvest Event Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required name="species" type="text" placeholder="Species (e.g., Withania somnifera)" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.species} onChange={handleChange} />
                                <input required name="commonName" type="text" placeholder="Common Name (e.g., Ashwagandha)" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.commonName} onChange={handleChange} />
                                <input required name="collectorName" type="text" placeholder="Collector Name or Organization" className="w-full p-2 border border-gray-300 rounded-lg md:col-span-2" value={formData.collectorName} onChange={handleChange} />
                                
                                <div className="flex items-center space-x-2">
                                    <input required name="lat" type="number" step="any" placeholder="Latitude" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.lat} onChange={handleChange} />
                                    <input required name="lng" type="number" step="any" placeholder="Longitude" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.lng} onChange={handleChange} />
                                </div>
                                <button type="button" onClick={handleGetLocation} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors h-full">Get Current Location</button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 h-4">{locationStatus}</p>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-[#1E6F5C] text-white px-5 py-2 rounded-lg hover:bg-[#165a49]">Submit Harvest</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="w-full h-[65vh] bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <Plot
                    data={[{
                        type: 'scattergeo',
                        lon: collectionEvents.map(e => e.geoLocation.lng),
                        lat: collectionEvents.map(e => e.geoLocation.lat),
                        text: collectionEvents.map(e => `<b>${e.commonName}</b><br>${e.collectorName}`),
                        hoverinfo: 'text',
                        mode: 'markers',
                        marker: { size: 8, color: '#1E6F5C', opacity: 0.8 }
                    }]}
                    layout={{
                        geo: {
                            scope: 'asia',
                            showland: true,
                            landcolor: 'rgb(243, 243, 243)',
                            countrycolor: 'rgb(217, 217, 217)',
                            center: { lat: 24, lon: 78 }, // Center on India
                            lataxis: { range: [5, 35] },
                            lonaxis: { range: [68, 98] }
                        },
                        margin: { r: 0, t: 0, b: 0, l: 0 },
                        showlegend: false,
                        autosize: true
                    }}
                    config={{ responsive: true, displayModeBar: false }}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}