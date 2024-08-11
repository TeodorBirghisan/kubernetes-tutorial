#!/bin/bash

# Function to check if Minikube is running and start it if not
start_minikube_if_not_running() {
    echo "Checking if Minikube is running..."

    minikube_status=$(minikube status --format='{{.Host}}')

    if [[ "$minikube_status" != "Running" ]]; then
        echo "Minikube is not running. Starting Minikube..."
        minikube start
    else
        echo "Minikube is already running."
    fi
}

# Function to check if the API pod is running
wait_for_api_pod() {
    echo "Waiting for API pod to be in Running state..."

    while true; do
        pod_name=$(kubectl get pods -l app=api -o jsonpath="{.items[0].metadata.name}" 2>/dev/null)

        if [[ -z "$pod_name" ]]; then
            echo "No API pods found. Waiting..."
        else
            pod_status=$(kubectl get pod "$pod_name" -o jsonpath="{.status.phase}")
            
            if [[ "$pod_status" == "Running" ]]; then
                echo "API pod is running. Proceeding with port forwarding..."
                break
            else
                echo "Current API pod status: $pod_status. Waiting..."
            fi
        fi

        sleep 5
    done
}

# Start Minikube if necessary
start_minikube_if_not_running

# Apply Kubernetes configurations
kubectl apply -f "../k8s/db"
kubectl apply -f "../k8s/api"
kubectl apply -f "../k8s/ui"

# Wait for the API pod to be running
wait_for_api_pod

# Wait for a few seconds to ensure port-forward is up
sleep 5

# Open a new terminal and execute the command to get the UI service URL
gnome-terminal -- bash -c "minikube service ui-service --url; exec bash"

# Forward port for API service
kubectl port-forward svc/api-service 8080:8080
