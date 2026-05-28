import { MapPin, Star, Globe, Phone } from 'lucide-react';

export default function SalonView({ salon }) {
    return (
        <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900">{salon.name}</h1>
            
            <div className="flex items-center text-amber-500 font-bold mb-8">
                <Star className="fill-current w-5 h-5 mr-1" /> 
                {salon.rating != null ? salon.rating.toFixed(1) : "0.0"} 
                <span className="text-gray-400 ml-2 font-normal">({salon.reviewCount || 0} reviews)</span>
                
                {salon.priceRange && (
                    <span className="ml-4 px-2.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-bold tracking-wider">
                        {salon.priceRange}
                    </span>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Contact & Location</h3>
                    <div className="space-y-4 mb-8">
                        <p className="text-gray-600 flex items-start">
                            <MapPin className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" /> 
                            <span>
                                <span className="block font-medium text-gray-800">{salon.address}</span>
                                <span className="text-sm">{salon.district}{salon.city ? `, ${salon.city}` : ''}</span>
                            </span>
                        </p>
                        {salon.phoneNumber && (
                            <p className="text-gray-600 flex items-center">
                                <Phone className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" /> 
                                <span className="font-medium text-gray-800">{salon.phoneNumber}</span>
                            </p>
                        )}
                        {salon.website && (
                            <p className="text-gray-600 flex items-center">
                                <Globe className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" /> 
                                <a href={salon.website} target="_blank" rel="noreferrer" className="font-medium text-green-600 hover:text-green-700 hover:underline">
                                    {salon.website}
                                </a>
                            </p>
                        )}
                    </div>
                    
                    <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                        {salon.servicesOffered && salon.servicesOffered.length > 0 ? (
                            salon.servicesOffered.map(s => (
                                <span key={s} className="bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg text-sm font-bold text-green-700 uppercase tracking-wider">
                                    {s}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 italic">No services listed</span>
                        )}
                    </div>
                </div>

                <div className="bg-gray-100 rounded-2xl h-80 overflow-hidden shadow-inner border border-gray-200">
                    <iframe
                        title="Salon Map"
                        width="100%" height="100%" frameBorder="0"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(salon.address + ', ' + (salon.city || salon.district || 'Polska'))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}