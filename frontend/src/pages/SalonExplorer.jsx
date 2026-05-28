import { useState, useEffect } from 'react';

import HeroSection from "../components/Hero";
import Explorer from "../components/Explorer";
import { getSalons } from "../services/api";

export default function SalonExplorer() {

    const [salons, setSalons] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [sortOption, setSortOption] = useState('reviewCount,desc');

    const [selectedServices, setSelectedServices] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getSalons({ page: 0, size: 10000 }).then(response => {
            const allSalons = response.data.content || [];
            
            const uniqueDistricts = new Set();
            const uniqueServices = new Set();

            allSalons.forEach(salon => {
                if (salon.district) uniqueDistricts.add(salon.district);
                salon.servicesOffered?.forEach(srv => uniqueServices.add(srv));
            });

            setDistricts([...uniqueDistricts].sort());
            setServices([...uniqueServices].sort());
        });
    }, []);

    useEffect(() => {
        setCurrentPage(0);
    }, [search, selectedDistrict, selectedServices, sortOption]);

    useEffect(() => {
        setLoading(true);

        const params = { page: currentPage, size: 21 };
        if (search) params.name = search;
        if (selectedDistrict) params.district = selectedDistrict;
        if (selectedServices.length > 0) params.category = selectedServices.join(',');
        if (sortOption) params.sort = sortOption;

        getSalons(params)
            .then(response => {

                const content = response.data.content || [];
                const totalPagesFromApi = response.data.totalPages || 0;

                setSalons(prevSalons => {
                    if (currentPage === 0) return content;
                    
                    const existingIds = new Set(prevSalons.map(s => s.id));
                    const uniqueNew = content.filter(s => !existingIds.has(s.id));
                    return [...prevSalons, ...uniqueNew];
                });

                setTotalPages(totalPagesFromApi);
                setLoading(false);

            })
            .catch(error => {
                console.error("API error: ", error);
                setLoading(false);
            });

    }, [search, selectedDistrict, selectedServices, sortOption, currentPage]);

    return (
        <div>
            <HeroSection />
            <Explorer 
                search={search} setSearch={setSearch}
                selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict}
                selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                sortOption={sortOption} setSortOption={setSortOption}
                districts={districts} services={services}
                salons={salons} loading={loading}
                currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}
            />
        </div>
    );
}