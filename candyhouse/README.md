# CandyHouse Helm Chart

This Helm chart is used to deploy the CandyHouse microservices cluster locally. It contains configurations for all microservices, including load balancers (using Nginx) for the user, product, and order services.

## Prerequisites

- Docker with Kubernetes enabled (e.g., Docker Desktop) or another local Kubernetes cluster such as minikube or kind.
- Helm 3.x installed on your system.
- Kubectl configured to interact with your cluster (optional but recommended).

## Getting Started

**Note:** All commands should be executed from the project root directory.

1. **Ensure Kubernetes is running locally**
   
   - For Docker Desktop: Make sure Kubernetes is enabled in the settings.
   - For minikube: Run `minikube start`.

2. **Lint the Chart (Optional)**

   From the project root, run:
   ```sh
   helm lint candyhouse
   ```

3. **Install the Helm Chart**

   To deploy the cluster locally and provide custom secrets via a secrets.yaml file located at the project root, run:
   ```sh
   helm upgrade --install candyhouse candyhouse -f secrets.yaml
   ```
   This command installs (or upgrades) the release named `candyhouse` using the configurations in the candyhouse chart, along with the overrides specified in secrets.yaml.

4. **Verify the Deployment**

   Check the status of your release:
   ```sh
   helm status candyhouse
   ```

   Also, inspect the deployed pods and services with:
   ```sh
   kubectl get pods
   kubectl get svc
   ```

5. **Accessing Services**

   Each microservice is exposed via its own Nginx load balancer with a Service of type **LoadBalancer**. Although they all listen on port 80 externally, they are distinguished by unique service names and external IP addresses or DNS assignments provided by your Kubernetes setup.

6. **Uninstalling the Deployment**

   To remove the deployment, run:
   ```sh
   helm uninstall candyhouse
   ```

## Customization

- **Values Configuration**: Customize the deployment by editing the `values.yaml` file inside the candyhouse directory. You can change service names, ports, and other settings as needed.
- **Separate Service Definitions**: The chart keeps load balancing configurations separate for each microservice (user, product, order) to allow for independent updates and team-specific changes.

## Notes

- This chart is designed for local development and testing. In a production environment, further customization and security measures would be necessary.
- If you are using an environment like Docker Desktop, the LoadBalancer Service may simulate external IP assignment differently. Refer to your Kubernetes provider's documentation for details on exposing services.

Happy deploying! 