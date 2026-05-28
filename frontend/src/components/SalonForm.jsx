import { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function SalonForm({ salon, onSave, onCancel, saving }) {
    const [formData, setFormData] = useState({
        name: salon.name || '',
        address: salon.address || '',
        district: salon.district || '',
        city: salon.city || '',
        phoneNumber: salon.phoneNumber || '',
        website: salon.website || '',
        priceRange: salon.priceRange || '',
        servicesOffered: salon.servicesOffered ? salon.servicesOffered.join(', ') : ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            priceRange: formData.priceRange === '' ? null : formData.priceRange,
            servicesOffered: formData.servicesOffered
                .split(',')
                .map(s => s.trim())
                .filter(s => s !== '')
        };
        
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-10 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Edit Salon Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Salon Name*</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price Range</label>
                    <select name="priceRange" value={formData.priceRange} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white">
                        <option value="">-- No price range set --</option>
                        <option value="CHEAP">Cheap</option>
                        <option value="MODERATE">Moderate</option>
                        <option value="EXPENSIVE">Expensive</option>
                        <option value="VERY_EXPENSIVE">Very Expensive</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Address*</label>
                    <input required name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">District*</label>
                        <input name="district" value={formData.district} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">City*</label>
                        <input name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Website</label>
                    <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Services Offered (comma separated)</label>
                    <textarea 
                        name="servicesOffered" 
                        value={formData.servicesOffered} 
                        onChange={handleChange} 
                        rows="3"
                        placeholder="e.g. spa, massage, hair styling"
                        className="w-full p-3 border rounded-xl resize-none" 
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button type="button" onClick={onCancel} disabled={saving} className="flex items-center px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                    <X className="w-5 h-5 mr-2" /> Cancel
                </button>
                <button type="submit" disabled={saving} className="flex items-center px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md disabled:opacity-50">
                    <Save className="w-5 h-5 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}