

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../../../../utils/apiConfig';

const Uploadpicture = () => {
    const [file, setFile] = useState(null);
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [loading, setLoading] = useState(false);

    // 🚀 Fetch user data from localStorage on page load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUsername(parsedUser.username);
            setPhoneNumber(parsedUser.phoneNumber);
            setProfilePicture(parsedUser.profilePicture); // Also set the profile picture
        }
    }, []);

    const handleUpload = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.userId;
        console.log(userId, "userId");

        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', userId);

        try {
            setLoading(true); // Start loading
            const response = await axios.post(API_URLS.getuserprofile, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Uploaded image URL:', response.data.url);

            // Update localStorage
            const updatedUserData = {
                ...userData,
                profilePicture: response.data.url,
            };
            localStorage.setItem('user', JSON.stringify(updatedUserData));

            // Update frontend states immediately
            setProfilePicture(response.data.url);

            setFile(null);
            alert('Profile picture updated successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <>
            <div className='border text-center' >
                <h2>Welcome, {username}</h2>
                <p>Phone: {phoneNumber}</p>

                {profilePicture && (
                    <img
                        src={profilePicture}
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                )}

                <div style={{ marginTop: '20px' }}>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <button className='mt-3 btn btn-success' onClick={handleUpload} disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Picture'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Uploadpicture;

