# Kubernetes Tutorial -Todo App-

This guide will help you understand the basiscs of Kubernetes using a simple Todo App. The app consists of a UI built with React, a .Net Core API, and a Micrsoft SQL Server Database. Kubernetes(K8s) is used to manage these components, privding scalability, resilience, and easy management of containerized applications.

## Project Overview

## Architecture

The Todo app consists of three main components and services:

1. **UI:** A React Framework served by a nginx server.
2. **API:** A .NET Core API that handles requests from the UI and interacts with the database.
3. **Database:** A Micrsoft SQL Server instance that stores the todo items.

### Docker Images

(All images are stored in a public docker repo: <https://hub.docker.com/r/birghi/kubernetes-tutorial/tags>)

The following Docker images are used in this setup:

- **UI**: birghi/kubernetes-tutorial:ui-latest
- **API**: birghi/kubernetes-tutorial:api-latest
- **Migration**: birghi/kubernetes-tutorial:migration-latest
- **Database**: mcr.microsoft.com/mssql/server:2022-latest

## Kubernetes Structure and Components in the TodoApp Project

### 1. Cluster

- **Definition**: A Kubernetes cluster is the foundation of K8s. It consists of multiple nodes that work together to run containerized applications. The cluster provides an API and allows for the management and orchestration of applications.
- **Role in Project**: In the Todo App project, the Kubernetes cluster orchestrates all the components (UI, API, SQL Server) and manages their deployment, scaling, and operation.

### 2. Nodes

- **Definition**: Nodes are individual machines (virtual or physical) within a Kubernetes cluster that run the applications. Each worker node contains the services necessary to run pods and is managed by the control plane. The control pane manages the K8s cluster and its responsible for maintaining the desired state of the cluster.
- **Role in Project**: The nodes in the cluster host the pods running the Todo App's components (UI, API, SQL Server), ensuring the application runs smoothly across the infrastructure.

### 3. Pods

- **Definition**: Pods are the smallest deployable units in Kubernetes, representing a single instance of a running process in the cluster. A pod can contain one or more containers that share storage, network, and specifications.
- **Role in Project**: Each component of the Todo App (UI, API, SQL Server) runs inside its own pod. Pods ensure that the containers are isolated but can communicate with each other as needed.

### 4. Deployments

- **Definition**: Deployments are Kubernetes objects that define the desired state of an application. They manage the lifecycle of pods, including scaling, updating, and self-healing (restarting failed pods).
- **Role in Project**: Deployments are used to manage the UI, API, and SQL Server pods, ensuring they are running the correct version, scaled appropriately, and are automatically restarted if they fail.

### 5. Services

- **Definition**: Services in Kubernetes define a logical set of pods and provide a stable network endpoint (IP address and port) to access these pods. Services abstract the complexity of pod IP addresses and enable communication between different parts of an application or with external users.
- **Role in Project**: Services expose the API and UI deployments within the cluster and to external users. The SQL Server service allows the API to connect to the database, abstracting the pod's IP address.

### 6. PersistentVolumes (PVs) and PersistentVolumeClaims (PVCs)

- **Definition**: PersistentVolumes are storage resources in a Kubernetes cluster that provide durable storage to pods. PersistentVolumeClaims are requests for storage by a pod. PVCs bind to PVs, ensuring that the pod can persist data across restarts.
- **Role in Project**: The SQL Server uses a PersistentVolumeClaim to request storage from a PersistentVolume, ensuring that the database data is stored persistently even if the SQL Server pod is restarted or moved.

### 7. Secrets

- **Definition**: Secrets in Kubernetes are used to store sensitive information, such as passwords, tokens, and keys. Secrets are mounted into pods as environment variables or files and are used securely without exposing them in the code or configuration files. Secrets are base64-encoded and should be encrypted using third-party tools for security.
- **Role in Project**: Secrets store sensitive information like the SQL Server connection string, ensuring that such data is securely passed to the API and SQL Server pods without hardcoding it into the deployment configurations.

## Prerequisites

Before you start, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/) (For building and running containers)
- **Minikube**: [Install Minikube](https://minikube.sigs.k8s.io/docs/start/) (For running Kubernetes locally)
- **kubectl**: [Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (Kubernetes command-line tool)

## Setup Instructions

```sh
git clone https://github.com/TeodorBirghisan/kubernetes-tutorial.git
cd kubernetes-tutorial
```

### To start the K8s cluster on Windows machines

```sh
cd scripts
start-k8s-cluster.ps1
```

### To start the K8s cluster on Linux machines

```sh
cd scripts
sh start-k8s-cluster.sh
```

## Kubernetes Workflow for TodoApp

### 1. **PersistentVolume and PersistentVolumeClaim**

- **Purpose**:
  - The SQL Server database requires persistent storage to maintain data even if the database pod is restarted or rescheduled on a different node.

- **How it Works**:
  - A PersistentVolume (PV) is created on the host machine at `/mnt/data/mssql` with 1Gi of storage.
  - A PersistentVolumeClaim (PVC) is then used by the SQL Server pod to request this storage. The PVC binds to the PV, providing the necessary storage for the SQL Server instance.

- **Relevance**:
  - This setup ensures data persistence across pod restarts, making sure your data is safe and accessible at all times.

### 2. SQL Server Deployment

- **Purpose**:
  - Deploy the SQL Server instance that the API will use to store and retrieve todo items.

- **How it Works**:
  - The SQL Server runs as a Kubernetes **Deployment**.
  - The Deployment manages the lifecycle of the SQL Server pod.
  - The pod uses a PersistentVolumeClaim (PVC) to mount persistent storage at `/var/opt/mssql`, ensuring data persistence.
  - The **Service** associated with the SQL Server exposes it internally to the Kubernetes cluster, allowing other components, like the API, to connect to it.

- **Relevance**:
  - This setup abstracts the complexity of managing a SQL Server instance.
  - It ensures the SQL Server runs smoothly and is always accessible to the API.

### 3. API Deployment and Init Container

- **Purpose**:
  - Run the .NET Core API, which serves as the backend for the TodoApp.
  - Ensure the database schema is up-to-date by running migrations before the API starts.

- **How it Works**:
  - The API runs as a Kubernetes **Deployment** with a single pod replica.
  - Before the API starts, an **Init Container** runs a database migration using the `dotnet ef database update` command.
  - This ensures the database schema is ready to handle requests from the API.
  - The API pod includes **Liveness** and **Readiness Probes**:
    - The Liveness Probe checks if the API is still running.
    - The Readiness Probe ensures the API is ready to serve traffic.

- **Relevance**:
  - The Init Container ensures the database is in the correct state before the API starts, preventing potential runtime errors.
  - The probes help Kubernetes manage the API pod more effectively, restarting it if necessary or ensuring it only serves traffic when fully ready.

### 4. Database Migration

- **Purpose**:
  - Run any necessary database migrations to ensure that the database schema matches the expectations of the API.

- **How it Works**:
  - The **Init Container** within the API deployment is designed to handle this task.
  - It runs the `dotnet ef database update` command, which applies any pending migrations to the SQL Server database before the main API container starts.
  - This Init Container uses the same image as the API but runs a different command.
  - It relies on the connection string stored in a Kubernetes Secret to connect to the database.

- **Relevance**:
  - Running migrations as part of the deployment process ensures that the database is always in sync with the API code.
  - This reduces the risk of runtime errors due to schema mismatches.

### 5. API Service

- **Purpose**:
  - Expose the API deployment within the Kubernetes cluster and optionally to external clients.

- **How it Works**:
  - The API is exposed through a Kubernetes **Service** of type `NodePort`.
  - This Service maps a port on each node in the cluster to the API's port.
  - The Service allows internal communication within the cluster (e.g., from the UI to the API) and can also be accessed externally via Minikube.

- **Relevance**:
  - The Service abstracts the API pod's IP address and port.
  - It provides a stable endpoint that can be used by other services or clients, even if the underlying pod is rescheduled.

### 6. UI Deployment

- **Purpose**:
  - Deploy the React frontend, which users interact with to manage their todo items.

- **How it Works**:
  - The UI runs as a Kubernetes **Deployment** managed by a single pod replica.
  - The pod serves the static files built from the React project using an Nginx server.

- **Relevance**:
  - The UI Deployment ensures that the frontend is always available to users.
  - It handles requests efficiently and serves the latest version of the application.

### 7. UI Service

- **Purpose**:
  - Expose the UI deployment, making it accessible via the browser.

- **How it Works**:
  - The UI is exposed via a **Service** of type `NodePort`, similar to the API Service.
  - This allows the frontend to be accessed from outside the cluster using a Minikube URL.

- **Relevance**:
  - This setup ensures that the UI is accessible to users from their browsers.
  - It provides a seamless experience for interacting with the TodoApp.

### 8. Secrets Management

- **Purpose**:
  - Securely manage sensitive information such as the database connection string.

- **How it Works**:
  - Kubernetes **Secrets** are used to store sensitive data, such as the SQL Server's connection string.
  - The Secret is referenced by the API deployment, and the connection string is injected as an environment variable.

- **Relevance**:
  - Storing sensitive data in Secrets rather than hardcoding it in deployment files or Docker images enhances security.
  - This approach ensures best practices are followed for managing sensitive information.

## Basic K8s commands

Tip💡 *try those on the newly created K8s cluster*

1. Check the status of resources:
    - List all Pods:

        ```yml
        kubectl get pods
        ```

    - Get detailed information about a Pod:

        ```yml
        kubectl describe pod <pod-name>
        ```

    - List all Services:

        ```yml
        kubectl get service
        ```

    - List All Deployments:

        ```yml
        kubectl get deployments
        ```

2. Accessing Logs and Debugging:
    - View Logs of a Pod:

        ```yml
        kubectl logs <pod-name>
        ```

    - Stream Logs of a Pod:

        ```yml
        kubectl logs -f <pod-name>
        ```

    - Exec into a running Pod (Get Shell Access):

        ```yml
        kubectl exec -it <pod-name> -- /bin/bash
        ```

3. Inspecting Configurations

    - View Secrets:

        ```yml
        kubectl get secrets
        ```

    - Describe a Secret (View Details)

        ```yml
        kubectl describe secret <secret-name>
        ```

    - View PersistentVolumeClaims:

        ```yml
        kubectl get pvc
        ```

    - Describe PersistentVolumeClaim

        ```yml
        kubectl describe pvc <pvc-name>
        ```

4. Monitoring and HealthChecks

    - Check the Health of a Pod (Probes):

        ```yml
        kubectl describe pod <pod-name> | grep -i "liveness\|readiness"
        ```

### To stop the K8s cluster on Windows machines

```ps
cd scripts
stop-k8s-cluster.ps1
```

### To stop the K8s cluster on Linux machines

```sh
cd scripts
sh stop-k8s-cluster.sh
```
