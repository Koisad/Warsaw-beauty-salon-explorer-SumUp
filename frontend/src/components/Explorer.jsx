import { Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'

export default function Explorer({ 
    search, setSearch, 
    selectedDistrict, setSelectedDistrict, districts,
    selectedServices, setSelectedServices, services,
    sortOption, setSortOption,
    salons, loading,
    currentPage, setCurrentPage, totalPages
}) {

    const salonsToShow = salons.filter(salon => {
        const hasBasicData = salon && salon.name && salon.name.trim() !== "" && salon.district && salon.district.trim() !== "" && salon.address && salon.address.trim() !== "";
        if (!hasBasicData) return false;

        if (selectedServices.length > 0) {
            const salonServices = salon.servicesOffered || [];

            const hasSelectedService = selectedServices.some(s => salonServices.includes(s));
            if (!hasSelectedService) return false;
        }

        return true;
    });

    const toggleService = (service) => {
        if (selectedServices.includes(service)) {
            setSelectedServices(selectedServices.filter(s => s !== service));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    return (
        <section className="py-16 bg-white" id="explorer">
            <div className="container px-4 mx-auto">
                
                <div className="mb-10 text-center">
                    <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-white bg-green-500 uppercase rounded-full font-bold tracking-wider">
                        Explorer
                    </span>
                    <h2 className="font-heading mb-4 text-3xl md:text-4xl leading-tight font-extrabold tracking-tight text-gray-900">
                        Find your perfect salon
                    </h2>
                    <p className="text-lg text-gray-500 font-medium">
                        Use filters to find a salon that suits your needs.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-12 border border-gray-100 shadow-sm flex flex-wrap gap-4">
                    <div className="w-full md:w-1/4">
                        <label className="block mb-2 text-sm font-bold">Search salons</label>
                        <input 
                            className="w-full py-3 px-4 border rounded-xl" 
                            type="text" 
                            placeholder="Salon name..."
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-1/4">
                        <label className="block mb-2 text-sm font-bold">District</label>
                        <select
                            className="w-full py-3 px-4 border rounded-xl bg-white"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                        >
                            <option value="">All districts</option>
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:flex-1">
                            <label className="block mb-2 text-sm font-bold text-gray-700">Sort by</label>
                            <select
                                className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="">Default</option>
                                <option value="rating,desc">Rating: High to Low</option>
                                <option value="rating,asc">Rating: Low to High</option>
                                <option value="reviewCount,desc">Most Popular</option>
                                <option value="price,asc">Price: Low to High</option>
                                <option value="price,desc">Price: High to Low</option>
                            </select>
                        </div>

                    <div className="w-full border-t border-gray-200 pt-6">
                        <label className="block mb-3 text-sm font-bold">Services</label>
                        <div className="flex flex-wrap gap-2">
                            {services.map(service => {
                                const isSelected = selectedServices.includes(service);
                                return (
                                    <button 
                                        key={service}
                                        onClick={() => toggleService(service)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                                            isSelected 
                                            ? 'bg-green-600 text-white shadow-md shadow-green-200 border border-green-600' 
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-green-500'
                                        }`}
                                    >
                                        {service}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {loading && currentPage === 0 ? (

                    <div className="text-center py-12 text-gray-500 font-medium">
                        Loading salons...
                    </div>

                ) : salonsToShow.length === 0 ? (

                    <div className="text-center py-12 text-gray-500 font-medium">
                        No salons found matching your criteria.
                    </div>

                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {salonsToShow.map((salon) => (
                                <Link key={salon.id} to={`/salon/${salon.id}`} className="block">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col justify-between cursor-pointer">
                                        <div>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {salon.servicesOffered?.map(s => (
                                                    <span key={s} className="text-[10px] uppercase font-bold tracking-wider bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            <h3 className="font-bold text-xl mb-2 text-gray-900">{salon.name}</h3>

                                            <div className="flex items-start text-gray-500 text-sm mb-6">
                                                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="font-medium text-gray-700">{salon.address}</div>
                                                    <div className="text-xs text-gray-400">{salon.district}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-amber-500 font-bold bg-amber-50 w-max px-2.5 py-1.5 rounded-lg">
                                            <Star className="w-4 h-4 mr-1 fill-current" /> 
                                            {salon.rating != null ? salon.rating.toFixed(1) : "0.0"}
                                            <span className="text-gray-500 text-xs ml-1.5 font-medium">({salon.reviewCount || 0} reviews)</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {currentPage < totalPages - 1 && (
                            <div className="flex justify-center mt-12">
                                <button 
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={loading}
                                    className="px-8 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Loading...' : 'Show more'}
                                </button>
                            </div>
                        )}
                    </>
                )}

                
            </div>
        </section>
    );
}