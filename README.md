# Advanced DevSecOps CI/CD Project

A production-grade CI/CD pipeline implementing DevSecOps principles with automated security scanning, quality gates, and Kubernetes deployment.

## How to Run Locally

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher
- Docker 20.x or higher (optional, for container testing)

### Setup and Run

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Advanced-DevOps-CICD-Project.git
cd Advanced-DevOps-CICD-Project
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

4. Run linting:
```bash
npm run lint
```

5. Start the application:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Docker Testing

Build and run the Docker image locally:
```bash
docker build -t devsecops-app:local .
docker run -p 3000:3000 devsecops-app:local
```

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

## Secrets Configuration

To enable the full CI/CD pipeline, configure these secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets

1. **DOCKERHUB_USERNAME**
   - Your DockerHub username
   - Example: `johndoe`

2. **DOCKERHUB_TOKEN**
   - DockerHub access token (not password)
   - How to get: DockerHub → Account Settings → Security → New Access Token
   - Permissions: Read, Write, Delete

3. **KUBECONFIG**
   - Kubernetes cluster configuration file
   - How to get: Run `cat ~/.kube/config` and copy the entire output
   - This allows GitHub Actions to deploy to your Kubernetes cluster

### Important Notes

- Never hardcode credentials in code or YAML files
- Use access tokens, not passwords
- Rotate tokens regularly
- Grant minimum required permissions

## CI Explanation

The CI/CD pipeline consists of two workflows: CI (Continuous Integration) and CD (Continuous Deployment).

### CI Pipeline (ci.yml)

The CI pipeline runs on every push to main/master branch and performs the following stages:

1. **Checkout & Setup**: Retrieves source code and sets up Node.js runtime environment

2. **Linting**: Runs ESLint to enforce code quality standards and catch potential bugs early

3. **Unit Tests**: Executes Jest test suite to validate business logic and ensure code correctness

4. **SAST (Static Application Security Testing)**: Uses CodeQL to scan source code for security vulnerabilities like SQL injection, XSS, and other OWASP Top 10 issues

5. **SCA (Software Composition Analysis)**: Scans dependencies using OWASP Dependency Check and npm audit to identify known CVEs in third-party packages

6. **Build**: Packages the application for deployment

7. **Docker Build**: Creates a multi-stage Docker image with security best practices (non-root user, minimal base image, health checks)

8. **Container Scanning**: Uses Trivy to scan the Docker image for OS and library vulnerabilities

9. **Runtime Tests**: Validates that the container starts correctly and responds to health checks

10. **Push to Registry**: Publishes the validated Docker image to DockerHub with both `latest` and git SHA tags

### CD Pipeline (cd.yml)

The CD pipeline is automatically triggered after the CI pipeline completes successfully. It handles deployment to Kubernetes:

1. **Setup kubectl**: Installs kubectl tool for Kubernetes cluster interaction

2. **Configure Access**: Uses KUBECONFIG secret to authenticate with the Kubernetes cluster

3. **Deploy Application**: Applies Kubernetes Deployment and Service manifests to create pods and expose the application

4. **Verify Deployment**: Checks that pods and services are running successfully

5. **DAST Scan**: Runs a baseline Dynamic Application Security Testing scan using OWASP ZAP to check for runtime security issues

### Why This Design?

- **Security First**: Multiple security layers (SAST, SCA, container scanning, DAST) ensure vulnerabilities are caught early
- **Fail Fast**: Critical issues (linting errors, test failures) block the pipeline immediately
- **Automation**: Fully automated from code push to deployment
- **Traceability**: Docker images tagged with git SHA for complete audit trail
- **Production Ready**: Multi-stage Docker builds, health checks, and proper Kubernetes configuration

### Pipeline Flow

```
Code Push → CI Pipeline → Build & Test → Security Scans → Docker Build → Push to Registry
                                                                    ↓
CD Pipeline ← Triggered Automatically ← Image Ready
     ↓
Kubernetes Deployment → DAST Scan → Application Live
```
