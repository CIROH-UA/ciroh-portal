# CIROH Portal (Formerly)

CIROH Portal has been merged into CIROH Hub. This repository has been retained as a redirect source to ensure continuity of website links.

- CIROH Hub link: https://hub.ciroh.org
- CIROH Hub repository: https://github.com/CIROH-UA/ciroh_hub
- This repository deploys to: gh-pages branch -> https://portal.ciroh.org

## Running this repository locally

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/CIROH-UA/ciroh-portal.git
   cd ciroh-portal
   ```

2. **Install Node.js**: 
   Download and install the LTS version from [nodejs.org](https://nodejs.org/en) if you don't have it already.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Build for Production** (optional):
   ```bash
   npm run build
   ```
   This creates static files in the `build` directory that can be deployed to a web server.

5. **Run Development Server**:
   ```bash
   npm run start
   ```
   This will start a local development server at http://localhost:3000 
   
6. **View the Site**:
   Open your browser and navigate to http://localhost:3000 to see the local version of DocuHub.

## How to validate PR locally

Go to GitHub Actions and Download the build folder from PR validate Action. Unzip the folder and run below command.
$ npx http-server
