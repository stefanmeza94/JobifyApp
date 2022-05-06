import { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: false,
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  const { isLoading, showAlert, displayAlert } = useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();

    const { name, email, password, isMember } = values;

    // name proveri samo ako user nije registrovan u suprotnom nemoj nista da proveravas za name
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }

    console.log(values);
  };

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}
        {/* name input */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/* email input */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* password input */}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}

          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;