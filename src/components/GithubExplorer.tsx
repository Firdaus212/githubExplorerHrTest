import React, { Component } from "react";
import axios from "axios";
import "./GitHubExplorer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const GITHUB_API_URL = "https://api.github.com";

interface User {
  id: number;
  login: string;
  avatar_url: string;
}

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
}

class GitHubExplorer extends Component<
  {},
  {
    resultUser: string;
    query: string;
    users: User[];
    expandedUser: string | null;
    repos: Record<string, Repo[]>;
    loadingRepos: Record<string, boolean>;
    errorMessage: string | null;
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      resultUser: "",
      query: "",
      users: [],
      expandedUser: null,
      repos: {},
      loadingRepos: {}, // Store loading status per user
      errorMessage: null,
    };
  }

  searchUsers = async (query: string): Promise<User[]> => {
    try {
      const response = await axios.get(
        `${GITHUB_API_URL}/search/users?q=${query}&per_page=5`
      );      
      return response.data.items;
    } catch (error) {
      throw new Error("Failed to fetch users. Please try again.");
    }
  };

  getUserRepos = async (username: string): Promise<Repo[]> => {
    try {
      const response = await axios.get(
        `${GITHUB_API_URL}/users/${username}/repos`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch repositories for ${username}.`);
    }
  };

  handleSearch = async () => {
    const { query } = this.state;
    if (query) {
      try {
        const result = await this.searchUsers(query);
        this.setState({
          users: result,
          expandedUser: null,
          repos: {},
          loadingRepos: {},
          resultUser: query,
          errorMessage: null,
        });
      } catch (error: any) {
        this.setState({ errorMessage: error.message });
      }
    }
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  };

  handleUserExpand = async (username: string) => {
    const { expandedUser, repos, loadingRepos } = this.state;

    if (expandedUser === username) {
      this.setState({ expandedUser: null });
    } else {
      if (!repos[username]) {
        try {
          this.setState({
            loadingRepos: { ...loadingRepos, [username]: true },
          });

          const userRepos = await this.getUserRepos(username);

          this.setState((prevState) => ({
            expandedUser: username,
            repos: {
              ...prevState.repos,
              [username]: userRepos,
            },
            loadingRepos: { ...prevState.loadingRepos, [username]: false },
            errorMessage: null,
          }));
        } catch (error: any) {
          this.setState({
            errorMessage: error.message,
            loadingRepos: { ...loadingRepos, [username]: false },
          });
        }
      } else {
        this.setState({ expandedUser: username });
      }
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value });
  };

  render() {
    const { query, users, expandedUser, repos, resultUser, errorMessage, loadingRepos } = this.state;
    return (
      <div className="container">
        <h1>GitHub Explorer</h1>
        <input
          id="input-username"
          type="text"
          value={query}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Enter username"
          className="input-box"
        />
        <button id="button-search" onClick={this.handleSearch} className="search-button">
          Search
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {users.length > 0 && (
          <div>
            <h3>Showing users for "{resultUser}"</h3>
            {users.map((user) => (
              <div
                key={user.id}
                className={`user-card ${
                  expandedUser === user.login ? "expanded" : ""
                }`}
              >
                <div
                  onClick={() => this.handleUserExpand(user.login)}
                  className="user-header"
                >
                  <span>{user.login}</span>
                  <span>
                    {loadingRepos[user.login] && (
                      <i className="fas fa-spinner fa-spin loading-icon"></i>
                    )}
                    {' '}
                    {expandedUser === user.login ? (
                      <i className="fas fa-angle-up"></i>
                    ) : (
                      <i className="fas fa-angle-down"></i>
                    )}                    
                  </span>
                </div>
                <ul className="repo-list">
                  {expandedUser === user.login &&
                    repos[user.login]?.map((repo) => (
                      <li key={repo.id} className="repo-item">
                        <span className="star-icon">
                          {repo.stargazers_count}{' '}<i className="fas fa-star"></i>
                        </span>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <strong>{repo.name}</strong>
                        </a>
                        <p>{repo.description || "No description available"}</p>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default GitHubExplorer;