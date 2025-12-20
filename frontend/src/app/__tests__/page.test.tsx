import { render, screen } from '@testing-library/react';
import Home from '../page';
import '@testing-library/jest-dom';

describe('Home Page', () => {
  it('renders a heading', () => {
    render(<Home />);
    const heading = screen.getByText(/To get started, edit the page.tsx file./i);
    expect(heading).toBeInTheDocument();
  });
});
