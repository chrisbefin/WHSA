// EditProfileModal.jsx
import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import pb from "lib/pocketbase";
import usePocketbaseUsers from "hooks/usePocketbaseUsers";


// These would typically come from a context or be fetched when the modal opens
const services = ["USA", "USN", "USMC", "DAF", "USCG"];
const grades = ["O1", "O2", "O3", "O4"];


export default function EditProfileModal({ isOpen, onClose }) {
    const user = pb.authStore.record;
    const { users, currentUser, loadingUsers, errorUsers, fetchUsers, getCurrentUser, createUser, deleteUser, updateUser } = usePocketbaseUsers();


    // State for form fields
    const [formData, setFormData] = useState({
        grade: '',
        service: '',
        service_email: '',
        preferred_name: '',
        cell_phone: '',
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            const fetchCurrentUserProfile = async () => {
                try {
                    await getCurrentUser(user.id);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };
            
            fetchCurrentUserProfile();
        }
    }, [isOpen]);

    // Update form data when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setFormData({
                grade: currentUser.grade || '',
                service: currentUser.service || '',
                service_email: currentUser.service_email || '',
                preferred_name: currentUser.preferred_name || '',
                cell_phone: currentUser.cell_phone
            });
        }
    }, [currentUser]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear any errors for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.service) newErrors.service = 'Service is required';
        if (!formData.grade) newErrors.grade = 'Grade is required';
        if (!formData.service_email) newErrors.service_email = 'Service email is required';
        if (formData.service_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.service_email)) {
            newErrors.service_email = 'Please enter a valid email address';
        }
        if (!formData.cell_phone.trim()) newErrors.cell_phone = "Cell phone number is required";

        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            updateUser(user.id, formData);
            
            // Close the modal after successful update
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error - perhaps set an error state to display
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Edit Profile
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        {/* Preferred Name */}
                                        <div>
                                            <label htmlFor="preferred_name" className="block text-sm font-medium text-gray-700">
                                                Preferred Name
                                            </label>
                                            <input
                                                type="text"
                                                id="preferred_name"
                                                name="preferred_name"
                                                value={formData.preferred_name}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        
                                        {/* Service */}
                                        <div>
                                            <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                                                Service*
                                            </label>
                                            <select
                                                id="service"
                                                name="service"
                                                value={formData.service}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                                    errors.service ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                }`}
                                            >
                                                <option value="">Select a service</option>
                                                {services.map((service) => (
                                                    <option key={service} value={service}>
                                                        {service}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.service && <p className="mt-1 text-sm text-red-600">{errors.service}</p>}
                                        </div>
                                        
                                        {/* Grade */}
                                        <div>
                                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                                                Grade (Rank)*
                                            </label>
                                            <select
                                                id="grade"
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                                    errors.grade ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                }`}
                                            >
                                                <option value="">Select a grade</option>
                                                {grades.map((grade) => (
                                                    <option key={grade} value={grade}>
                                                        {grade}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
                                        </div>
                                        
                                        {/* Service Email */}
                                        <div>
                                            <label htmlFor="service_email" className="block text-sm font-medium text-gray-700">
                                                Service Email*
                                            </label>
                                            <input
                                                type="email"
                                                id="service_email"
                                                name="service_email"
                                                value={formData.service_email}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                                    errors.service_email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                }`}
                                            />
                                            {errors.service_email && <p className="mt-1 text-sm text-red-600">{errors.service_email}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="service_email" className="block text-sm font-medium text-gray-700">
                                                Phone Number*
                                            </label>
                                            <input
                                                type="tel"
                                                id="cell_phone"
                                                name="cell_phone"
                                                value={formData.cell_phone}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                                    errors.cell_phone ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                }`}
                                            />
                                            {errors.cell_phone && <p className="mt-1 text-sm text-red-600">{errors.cell_phone}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}