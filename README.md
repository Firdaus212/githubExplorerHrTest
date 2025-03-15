# GitHub Explorer

GitHub Explorer is a React TypeScript-based application for searching GitHub users and displaying their repository lists.

## Key Features
- Search for GitHub users
- Display a list of repositories with star counts
- Expand details of each user's repositories

## Project Structure
```
github-searching/
│
├── coverage/                 # Test coverage report
├── jest-tmp/                 # Jest temporary cache
├── node_modules/             # npm dependencies
├── public/                   # Static files like index.html, favicon, etc.
│
├── src/
│   ├── assets/               # Logos, images, etc.
│   ├── components/           # React components
│   │   ├── __mocks__/        # Mock data for testing
│   │   ├── GitHubExplorer/
│   │   │   ├── GitHubExplorer.tsx
│   │   │   ├── GitHubExplorer.css
│   │   │   └── GitHubExplorer.test.tsx
│   │   └── Shared/           # Reusable components (optional)
│   │
│   ├── styles/               # Global CSS (optional)
│   ├── utils/                # Helper functions or API handlers
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   ├── index.css
│   ├── logo.svg
│   └── react-app-env.d.ts
│
├── test/                     # Additional test configurations and files
│   ├── setupTests.js
│
├── .babelrc
├── .gitignore
├── babel.config.js
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

## How to Run

1. Clone the repository:
```bash
git clone https://github.com/username/github-explorer.git
```

2. Navigate to the project directory:
```bash
cd github-searching
```

3. Install dependencies:
```bash
npm install
```

4. Run the application in development mode:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Technologies Used
- React.js
- TypeScript
- Axios
- Font Awesome
- Jest and Enzyme (for testing)

## Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License
MIT License