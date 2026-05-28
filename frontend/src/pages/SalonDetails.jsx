import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { getSalonById, updateSalon } from '../services/api';

import SalonView from '../components/SalonView';
import SalonForm from '../components/SalonForm';

export default function SalonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getSalonById(id)
            .then(response => {
                setSalon(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);


    const handleSave = async (updatedData) => {
        setSaving(true);
        try {
            const response = await updateSalon(id, updatedData); 
            setSalon(response.data);
            setIsEditing(false);
        } catch (error) {
            alert("Saving error: " + (error.response?.data?.message || "Unknown error"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-500 font-bold">Loading...</div>;
    if (!salon) return <div className="p-20 text-center text-red-500 font-bold">Salon not found.</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-gray-500 hover:text-green-600 font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to explorer
                </button>

                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-all"
                    >
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {isEditing ? (
                    <SalonForm 
                        salon={salon} 
                        onSave={handleSave} 
                        onCancel={() => setIsEditing(false)} 
                        saving={saving}
                    />
                ) : (
                    <SalonView salon={salon} />
                )}
            </div>
        </div>
    );
}