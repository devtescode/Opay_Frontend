import { useState } from 'react';
import { useCurrentUser } from '../../../lib/auth';
import { useUploadPicture } from '../../../hooks/useMutations';
import { getErrorMessage } from '../../../lib/apiClient';

const Uploadpicture = () => {
  const [file, setFile] = useState(null);
  const { user } = useCurrentUser();
  const { mutate: uploadPicture, isPending: loading } = useUploadPicture();

  const username = user?.username;
  const phoneNumber = user?.phoneNumber;
  const profilePicture = user?.profilePicture;

  const handleUpload = () => {
    if (!file) {
      window.alert('Please select a file first!');
      return;
    }

    uploadPicture(
      { userId: user?.userId, file },
      {
        onSuccess: () => {
          setFile(null);
          window.alert('Profile picture updated successfully!');
        },
        onError: (error) => {
          window.alert(getErrorMessage(error, 'Failed to upload image. Please try again.'));
        },
      },
    );
  };

  return (
    <div className="border text-center col-md-6 col-sm-12 p-3 shadow mx-auto">
      <h2>Welcome, {username}</h2>
      <p>Phone: {phoneNumber}</p>

      {profilePicture && (
        <img
          src={profilePicture}
          alt="Profile"
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
        />
      )}

      <div style={{ marginTop: '25px' }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
        <button className="mt-sm-0 mt-3 btn btn-success" onClick={handleUpload} disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload Picture'}
        </button>
      </div>
    </div>
  );
};

export default Uploadpicture;
