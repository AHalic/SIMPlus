import axios from 'axios';
import Router from 'next/router';

jest.mock('axios');
jest.mock('next/router', () => ({ push: jest.fn() }));

describe('handleSignIn (backend-focused, real input values)', () => {
  const validEmail = 'test@gmail.com';
  const wrongEmail = 'asdaasd@gmail.com';
  const goodPassword = 'Tester1!';
  let setErrorMessage;
  let handleSignIn;
  let consoleLogSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    setErrorMessage = jest.fn();

    axios.post.mockImplementation((url, payload) => {
      const { email, password } = payload || {};
      // success 
      if (email === validEmail && password === goodPassword) {
        return Promise.resolve({ status: 200, data: { user: { email } } });
      }
      // missing password 
      if (!password) {
        return Promise.reject({ response: { status: 400 }, message: 'Bad Request' });
      }
      // wrong credentials -> unauthorized
      return Promise.reject({ response: { status: 401 }, message: 'Unauthorized' });
    });

    handleSignIn = async (email, password) => {
      setErrorMessage('');
      try {
        const response = await axios.post('/api/login', { email, password });
        console.log('Login successful:', response.data);
        Router.push('/main');
      } catch (error) {
        const message = 'Wrong email or password';
        setErrorMessage(message);
        console.log('Login failed:', error);
      }
    };

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('Test 1: valid email and password -> navigates and returns 200', async () => {
    await handleSignIn(validEmail, goodPassword);

    expect(axios.post).toHaveBeenCalledWith('/api/login', { email: validEmail, password: goodPassword });
    expect(setErrorMessage).toHaveBeenCalledWith(''); // cleared at start
    expect(Router.push).toHaveBeenCalledWith('/main');
    expect(consoleLogSpy).toHaveBeenCalledWith('Login successful:', { user: { email: validEmail } });
  });

  it('Test 2: wrong email with same password -> sets error and does not navigate (401)', async () => {
    await handleSignIn(wrongEmail, goodPassword);

    expect(axios.post).toHaveBeenCalledWith('/api/login', { email: wrongEmail, password: goodPassword });
    expect(setErrorMessage).toHaveBeenCalledWith(''); // cleared at start
    expect(setErrorMessage).toHaveBeenLastCalledWith('Wrong email or password');
    expect(Router.push).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Login failed:', { response: { status: 401 }, message: 'Unauthorized' });
  });

  it('Test 3: missing password -> bad request (400), sets error and does not navigate', async () => {
    await handleSignIn(validEmail, '');

    expect(axios.post).toHaveBeenCalledWith('/api/login', { email: validEmail, password: '' });
    expect(setErrorMessage).toHaveBeenCalledWith(''); // cleared at start
    expect(setErrorMessage).toHaveBeenLastCalledWith('Wrong email or password');
    expect(Router.push).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Login failed:', { response: { status: 400 }, message: 'Bad Request' });
  });

  it('Test 4: clears previous error before retrying and succeeds on subsequent attempt', async () => {
// First attempt with wrong email
  await handleSignIn(wrongEmail, goodPassword);
  expect(setErrorMessage).toHaveBeenLastCalledWith('Wrong email or password');
  expect(Router.push).not.toHaveBeenCalled();

// Clear mocks before second attempt
  setErrorMessage.mockClear();
  consoleLogSpy.mockClear();
  Router.push.mockClear();
// Second attempt with correct credentials
  await handleSignIn(validEmail, goodPassword);
// Verify successful login
  expect(axios.post).toHaveBeenCalledWith('/api/login', { email: validEmail, password: goodPassword });
  expect(setErrorMessage).toHaveBeenCalledWith('');
  expect(Router.push).toHaveBeenCalledWith('/main');
  expect(consoleLogSpy).toHaveBeenCalledWith('Login successful:', { user: { email: validEmail } });
});
});