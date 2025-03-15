import axios from 'axios';
import React from 'react';
import { shallow } from 'enzyme';
import GitHubExplorer from '../components/GithubExplorer';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitHubExplorer Component Test', () => {
  let component = shallow(<GitHubExplorer />);

  it('Input username test', () => {
    component.find('#input-username').simulate('change', { target: { value: 'john' } });
    expect(component.state('query')).toEqual('john');
  });

  it('Button search test', async () => {
    const mockUsers = [
      { id: 1, login: 'user1', avatar_url: 'url1' },
      { id: 2, login: 'user2', avatar_url: 'url2' },
    ];

    mockedAxios.get.mockResolvedValue({ data: { items: mockUsers } });

    await (component.instance() as any).handleSearch();

    expect(component.state('users')).toEqual(mockUsers);
    expect(component.state('errorMessage')).toBeNull();
  });

  it('Expand user test', async () => {
    const mockRepos = [
      { id: 1, name: 'repo1', stargazers_count: 10, html_url: 'repo1_url' },
      { id: 2, name: 'repo2', stargazers_count: 20, html_url: 'repo2_url' },
    ];

    const user = 'user1';
    mockedAxios.get.mockResolvedValue({ data: mockRepos });
    await (component.instance() as any).handleUserExpand(user);

    expect(component.state('expandedUser')).toEqual(user);
  });

  it('Expand user collapse test', async () => {
    const user = 'user1';
    component.setState({ expandedUser: user });

    await (component.instance() as any).handleUserExpand(user);

    expect(component.state('expandedUser')).toBeNull();
  });

  it('Error test', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch users'));

    await (component.instance() as any).handleSearch();

    expect(component.state('errorMessage')).toEqual('Failed to fetch users. Please try again.');
  });

  it('Error failed fetching test', async () => {
    const user = 'user1';
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch repositories'));

    await (component.instance() as any).handleUserExpand(user);

    expect(component.state('errorMessage')).toEqual('Failed to fetch users. Please try again.');
  });
});
