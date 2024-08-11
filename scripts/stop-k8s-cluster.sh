#!/bin/bash

# Function to stop the port-forwarding process
stop_port_forward() {
    echo "Stopping port-forwarding..."

    # Find and kill the port-forward process
    pkill -f "kubectl port-forward svc/api-service 8080:8080"
    echo "Port-forwarding process stopped."
}

# Function to stop and delete Kubernetes resources
delete_kubernetes_resources() {
    echo "Deleting Kubernetes resources..."

    kubectl delete -f "../k8s/ui"
    kubectl delete -f "../k8s/api"
    kubectl delete -f "../k8s/db"

    echo "Kubernetes resources deleted."
}

# Function to stop Minikube if it's running
stop_minikube_if_running() {
    echo "Checking if Minikube is running..."

    minikube_status=$(minikube status --format='{{.Host}}')

    if [[ "$minikube_status" == "Running" ]]; then
        echo "Stopping Minikube..."
        minikube stop
        echo "Minikube stopped."
    else
        echo "Minikube is not running."
    fi
}

# Execute the functions to clean up the cluster
stop_port_forward
delete_kubernetes_resources
stop_minikube_if_running
