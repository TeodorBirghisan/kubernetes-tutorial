# Function to stop the port-forwarding process
function Stop-PortForward {
    Write-Host "Stopping port-forwarding..."

    # Find the process ID of the port-forward command and stop it
    $portForwardProcess = Get-Process -Name "kubectl" -ErrorAction SilentlyContinue

    if ($portForwardProcess) {
        Stop-Process -Id $portForwardProcess.Id -Force
        Write-Host "Port-forwarding process stopped."
    } else {
        Write-Host "No port-forwarding process found."
    }
}

# Function to stop and delete Kubernetes resources
function Remove-KubernetesResources {
    Write-Host "Deleting Kubernetes resources..."

    kubectl delete -f "../k8s/ui"
    kubectl delete -f "../k8s/api"
    kubectl delete -f "../k8s/db"

    Write-Host "Kubernetes resources deleted."
}

# Function to stop Minikube if it's running
function Stop-MinikubeIfRunning {
    Write-Host "Checking if Minikube is running..."

    $minikubeStatus = minikube status --format '{{.Host}}'

    if ($minikubeStatus -eq "Running") {
        Write-Host "Stopping Minikube..."
        minikube stop
        Write-Host "Minikube stopped."
    } else {
        Write-Host "Minikube is not running."
    }
}

# Execute the functions to clean up the cluster
Stop-PortForward
Remove-KubernetesResources
Stop-MinikubeIfRunning
