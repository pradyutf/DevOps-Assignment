# Todo API - Advanced DevOps CI/CD Project Report

**Student Name:** Pradyut Fogla  
**Scaler Student ID:** 10193  
**GitHub Repository:** https://github.com/pradyutf/DevOps-Assignment  
**DockerHub:** https://hub.docker.com/r/pradyutf/todo-api

---

# 1. Problem Background & Motivation

## 1.1 The Challenge of Modern Software Delivery

In modern software development, delivering high-quality software rapidly and reliably is a significant challenge. Traditional development workflows often suffer from critical inefficiencies:

1.  **Inconsistent Environments:** The classic "works on my machine" problem arises when development, testing, and production environments differ in configuration, operating systems, or dependencies.
2.  **Manual Deployment Risks:** Deploying software manually is error-prone, slow, and non-repeatable. Human error during deployment steps can lead to downtime or configuration drift.
3.  **Delayed Feedback:** Without automated testing and quality checks, bugs are often discovered late in the cycle or in production, where they are significantly more expensive to fix.
4.  **Security Vulnerabilities:** Treating security as a final phase before release ("bolting it on") often results in critical vulnerabilities reaching production or delaying releases significantly.

## 1.2 The DevOps Solution

To address these challenges, I implemented a robust Continuous Integration and Continuous Deployment (CI/CD) pipeline. This approach automates the software delivery lifecycle, ensuring:

*   **Consistency:** Docker containerization ensures the application runs identically across all environments.
*   **Automation:** GitHub Actions automates building, testing, security scanning, and deployment, removing human error.
*   **Shift-Left Security:** Integrating security tools (SAST, SCA, DAST) early in the pipeline identifies vulnerabilities immediately.
*   **Rapid Feedback:** Developers receive immediate feedback on code quality and functionality upon every commit.

## 1.3 Project Motivation

The primary motivation for this project was to bridge the gap between development and operations by implementing a production-grade CI/CD pipeline. The goal was not just to build an application, but to design a reliable automated factory for software delivery that adheres to DevSecOps principles.

---

# 2. Application Overview

## 2.1 Application Description

I developed a **Todo API**, a RESTful backend service built with Node.js and TypeScript. This application serves as a realistic workload to demonstrate the capabilities of the CI/CD pipeline.

The application supports standard CRUD (Create, Read, Update, Delete) operations for managing task lists and includes a health check endpoint specifically designed for Kubernetes liveness and readiness probes.

## 2.2 Technology Stack Justification

*   **TypeScript:** Chosen for its strong typing, which catches errors at compile-time rather than runtime, contributing to higher code quality.
*   **Node.js (v18 LTS) & Express.js:** Selected for their performance, widespread adoption, and suitability for building lightweight, scalable microservices.
*   **Jest & Supertest:** Used for automated testing. Jest provides a robust test runner, while Supertest allows for integration testing of HTTP endpoints without a running server.
*   **Docker:** Essential for packaging the application and its dependencies into a portable, immutable artifact.
*   **Kubernetes:** The industry standard for container orchestration, providing self-healing, scaling, and declarative management of the application.
*   **GitHub Actions:** Chosen as the CI/CD platform for its seamless integration with the repository and extensive ecosystem of pre-built actions.

## 2.3 Project Structure

The project follows a modular architecture to ensure separation of concerns:

*   **src/controllers:** Handles incoming HTTP requests and responses.
*   **src/models:** Defines the data structure and in-memory storage logic.
*   **src/routes:** Maps API endpoints to their respective controllers.
*   **k8s/:** Contains Kubernetes manifests (Deployment, Service, Namespace).
*   **.github/workflows/:** Defines the CI and CD pipeline configurations in YAML.
*   **Dockerfile:** Defines the multi-stage build process for creating the container image.

---

# 3. CI/CD Architecture Diagram

The architecture follows a linear, automated flow from code commit to production deployment.

## 3.1 Pipeline Flow Overview

**1. Development:**
Developer pushes code changes to the GitHub repository.

**2. Continuous Integration (CI):**
Triggered automatically on push.
*   **Quality Stage:** Runs linting (ESLint) and automated tests (Jest). Fails fast if standards are not met.
*   **Security Stage:** Runs concurrently. Performs Static Application Security Testing (CodeQL) and Software Composition Analysis (npm audit).
*   **Build Stage:** Builds the Docker container image.
*   **Artifact Security:** Scans the built image for vulnerabilities using Trivy.
*   **Publish:** Pushes the validated Docker image to DockerHub registry.

**3. Continuous Deployment (CD):**
Triggered after successful CI completion.
*   **Orchestration:** Authenticates with the Kubernetes cluster using kubectl.
*   **Deployment:** Applies configuration manifests to update the application state.
*   **Verification:** Monitors the rollout status to ensure pods are healthy.
*   **Runtime Security:** Performs a DAST scan against the running application.

---

# 4. CI/CD Pipeline Design & Stages

The pipeline is split into two distinct workflows: CI (Integration) and CD (Deployment). This separation allows for granular control and different triggering mechanisms.

## 4.1 CI Pipeline (ci.yml)

The CI pipeline focuses on validating the code and creating a trusted artifact.

### Stage 1: Quality Assurance
*   **Linting:** Uses ESLint to enforce coding standards and catch potential syntax errors. This prevents technical debt accumulation.
*   **Unit & Integration Testing:** Uses Jest to verify business logic and API endpoints. A strict failure policy ensures no broken functionality passes this stage.
*   **Build Verification:** Compiles TypeScript to JavaScript to ensure the code builds successfully without type errors.

### Stage 2: Security Scanning (DevSecOps)
*   **SAST (Static Application Security Testing):** Uses GitHub CodeQL to analyze source code for security flaws like injection vulnerabilities and unsafe data handling.
*   **SCA (Software Composition Analysis):** Uses `npm audit` to check third-party dependencies against the CVE database, preventing supply chain attacks.

### Stage 3: Containerization & Publishing
*   **Docker Build:** Utilizes a multi-stage Dockerfile. The "builder" stage compiles the code, while the "production" stage creates a minimal image containing only necessary artifacts. This reduces image size and attack surface.
*   **Image Scanning:** Uses Trivy to scan the final Docker image for OS-level vulnerabilities before pushing.
*   **Push to Registry:** Authenticates with DockerHub using encrypted secrets and pushes the tagged image.

## 4.2 CD Pipeline (cd.yml)

The CD pipeline focuses on delivering the artifact to the runtime environment.

### Stage 1: Cluster Authentication
Configures the `kubectl` command-line tool with access credentials stored in GitHub Secrets. This establishes a secure connection to the Kubernetes cluster.

### Stage 2: Deployment
Applies the Kubernetes manifests:
*   **Namespace:** Creates a logical isolation for the application.
*   **Deployment:** Updates the pod specification with the new image tag.
*   **Service:** Configures network access to the application.

### Stage 3: Verification
Uses `kubectl rollout status` to wait for the deployment to complete. It explicitly checks that the pods have reached a "Ready" state, ensuring the update was successful.

### Stage 4: Runtime Security (DAST)
Performs a Dynamic Application Security Test using OWASP ZAP. This scans the running application for vulnerabilities that only appear at runtime, such as missing security headers.

---

# 5. Security & Quality Controls

This project implements a "Shift-Left" security strategy, integrating security checks early and often throughout the development lifecycle.

## 5.1 Security Layers

1.  **Code Security (SAST):** CodeQL runs on every commit, analyzing the codebase for semantic security issues. This catches vulnerabilities during development, where they are cheapest to fix.
2.  **Dependency Security (SCA):** `npm audit` ensures that no known vulnerable libraries are introduced into the project.
3.  **Container Security:** Trivy scans the Docker image layers for vulnerabilities in the base OS (Alpine Linux) and system packages.
4.  **Runtime Security (DAST):** OWASP ZAP validates the security posture of the deployed application from an external perspective.

## 5.2 Quality Gates

The pipeline enforces strict quality gates. If any step fails, the entire pipeline stops immediately ("Fail Fast"):

*   **Linting Gate:** Code with style violations is rejected.
*   **Testing Gate:** Code that fails unit tests prevents the build process.
*   **Build Gate:** Compilation errors stop the pipeline.
*   **Security Gate:** Critical vulnerabilities can be configured to block deployment.

## 5.3 Container Best Practices

*   **Multi-Stage Build:** Separates build tools from runtime artifacts, resulting in a lightweight image (~150MB).
*   **Non-Root User:** The application runs as a non-privileged user inside the container to mitigate potential breakout attacks.
*   **Minimal Base Image:** Uses `node:18-alpine` to minimize the OS footprint and potential vulnerabilities.

---

# 6. Results & Observations

## 6.1 Execution Performance

The implemented pipeline demonstrates efficiency and reliability:
*   **CI Duration:** The integration workflow completes in approximately 2-3 minutes, providing rapid feedback to developers.
*   **CD Duration:** The deployment workflow takes under 1 minute to apply changes and verify the rollout.

## 6.2 Test Coverage

The automated test suite achieves satisfactory coverage of the application logic:
*   **Functional:** All CRUD operations are verified.
*   **Edge Cases:** Error handling and invalid inputs are tested.
*   **Health Checks:** The liveness probe endpoint is verified to ensure Kubernetes compatibility.

## 6.3 Deployment Reliability

The Kubernetes deployment configuration ensures high availability:
*   **Self-Healing:** Liveness probes automatically restart unresponsive pods.
*   **Zero Downtime:** Rolling updates ensure that the application remains available during deployments.
*   **Scalability:** The stateless design allows for horizontal scaling (replicas) to handle increased load.

## 6.4 Key Observations

*   **Automation Value:** Automating the build and deploy process eliminated manual errors and ensured consistent deployments.
*   **Security Visibility:** The integration of security tools provided immediate visibility into vulnerabilities that would otherwise go unnoticed until a dedicated security audit.
*   **Container Consistency:** Docker containerization effectively solved environment disparity issues, ensuring the code ran identically on the CI runner and the Kubernetes cluster.

---

# 7. Limitations & Improvements

## 7.1 Current Limitations

1.  **Data Persistence:** The application currently uses in-memory storage. Restarting the pods results in data loss. This was a deliberate design choice to focus on the pipeline rather than database management.
2.  **Local Deployment:** The GitHub Actions runner cannot directly access the local Docker Desktop Kubernetes cluster. The CD pipeline demonstrates the deployment logic but requires a cloud-accessible cluster for full end-to-end automation.
3.  **Basic DAST:** The DAST scan runs in a demonstration mode due to the network isolation of the GitHub runner. In a production environment, it would scan the public URL.

## 7.2 Future Improvements

1.  **Database Integration:** Integrating a persistent database like MongoDB or PostgreSQL would make the application production-ready.
2.  **Cloud Deployment:** Deploying to a managed Kubernetes service (AWS EKS or Google GKE) would enable the CD pipeline to fully execute the deployment steps.
3.  **Staging Environment:** Implementing a separate staging environment would allow for integration testing and manual approval before deploying to production.
4.  **GitOps Implementation:** Adopting a GitOps tool like ArgoCD would provide better visibility into the cluster state and enable automated configuration drift detection.

---

# 8. Conclusion

This project successfully demonstrates the implementation of a modern, secure, and automated CI/CD pipeline. By integrating industry-standard tools like Docker, Kubernetes, and GitHub Actions, I established a robust workflow that prioritizes code quality, security, and deployment reliability.

The shift-left approach to security and the emphasis on automation directly address the traditional challenges of software delivery. While the target application is simple, the underlying pipeline architecture is scalable and representative of enterprise-grade DevOps practices. This project has provided valuable hands-on experience in orchestrating the complete software lifecycle, from code commit to containerized deployment.
