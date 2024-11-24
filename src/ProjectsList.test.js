import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectsList from './ProjectsList';
import * as api from './api';

jest.mock('./api');

describe('ProjectsList', () => {
  it('fetches and displays projects', async () => {
    const projects = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }];
    api.getProjects.mockResolvedValueOnce(projects);

    render(<ProjectsList />);

    expect(await screen.findByText('Project 1')).toBeInTheDocument();
    expect(await screen.findByText('Project 2')).toBeInTheDocument();
  });

  it('creates a new project', async () => {
    const newProject = { id: 3, name: 'New Project' };
    api.createProject.mockResolvedValueOnce(newProject);
    api.getProjects.mockResolvedValueOnce([]);

    render(<ProjectsList />);

    fireEvent.change(screen.getByPlaceholderText('New Project Name'), {
      target: { value: 'New Project' },
    });
    fireEvent.click(screen.getByText('Create Project'));

    expect(await screen.findByText('New Project')).toBeInTheDocument();
  });
});