import { useState } from 'react';
import Navbar from '../Navbarpage/Navbar';
import NavbarTop from '../NavbarToppage/NavbarTop';
import { useCreateUser } from '../../../hooks/useMutations';
import { getErrorMessage } from '../../../lib/apiClient';

const emptyForm = {
  username: '',
  fullname: '',
  phoneNumber: '',
  password: '',
};

const CreateUserLogin = () => {
  const [formData, setFormData] = useState(emptyForm);
  const { mutate: createUser, isPending } = useCreateUser();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createUser(formData, {
      onSuccess: (data) => {
        window.alert(data.message);
        setFormData(emptyForm);
      },
      onError: (error) => {
        window.alert(getErrorMessage(error, 'Error creating user'));
      },
    });
  };

  return (
    <div>
      <Navbar />
      <NavbarTop />
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12 bg-light mx-auto" style={{ marginTop: '60px' }}>
            <h4>Create Details</h4>
            <form className="p-2" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={formData.username}
                className="form-control my-2"
                placeholder="Username"
              />

              <input
                type="text"
                name="fullname"
                onChange={handleChange}
                value={formData.fullname}
                className="form-control my-2"
                placeholder="Fullname"
              />

              <input
                name="phoneNumber"
                onChange={handleChange}
                value={formData.phoneNumber}
                maxLength="10"
                type="text"
                className="form-control my-2"
                placeholder="Phone Number"
              />

              <input
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                type="text"
                className="form-control my-2"
              />

              <div className="text-center">
                <button className="btn btn-secondary" type="submit" disabled={isPending}>
                  {isPending ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserLogin;
