import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Body from '../Body';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../utils/userSlice';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { vi, describe, it, expect } from 'vitest';

// Mock axios
vi.mock('axios');

// Create a mock store function
const createTestStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
        user: null
    }
  });
};

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock NavBar and Footer to simplify testing and avoid dependency issues
vi.mock('../NavBar', () => ({
  default: () => <div>NavBar</div>
}));

vi.mock('../Footer', () => ({
  default: () => <div>Footer</div>
}));

describe('Body Component', () => {
  it('should redirect to login on 401 error', async () => {
    const store = createTestStore();
    axios.get.mockRejectedValue({
      response: { status: 401 }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Body />}>
                <Route index element={<div>Home</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('should redirect to login on 400 error', async () => {
    const store = createTestStore();
    axios.get.mockRejectedValue({
      response: { status: 400 }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Body />}>
                 <Route index element={<div>Home</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // This is expected to fail currently
    await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});
