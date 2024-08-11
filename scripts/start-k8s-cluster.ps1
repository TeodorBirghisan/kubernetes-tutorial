# Function to check if Minikube is running
function Start-MinikubeIfNotRunning {
    Write-Host "Checking if Minikube is running..."

    $minikubeStatus = minikube status --format '{{.Host}}'

    if ($minikubeStatus -ne "Running") {
        Write-Host "Minikube is not running. Starting Minikube..."
        minikube start
    }
    else {
        Write-Host "Minikube is already running."
    }
}

# Function to check if the API pod is running
# Function to check if the API pod is running
function Wait-ForApiPod {
    Write-Host "Waiting for API pod to be in Running state..."

    $apiPodRunning = $false

    while (-not $apiPodRunning) {
        # Get the name of the first API pod
        $podName = kubectl get pods -l app=api -o jsonpath="{.items[0].metadata.name}" 2>$null

        if (-not $podName) {
            Write-Host "No API pods found. Waiting..."
        }
        else {
            # Get the status of the found pod
            $podStatus = kubectl get pod $podName -o jsonpath="{.status.phase}"

            if ($podStatus -eq "Running") {
                $apiPodRunning = $true
            }
            else {
                Write-Host "Current API pod status: $podStatus. Waiting..."
            }
        }

        Start-Sleep -Seconds 5
    }

    Write-Host "API pod is running. Proceeding with port forwarding..."
}

# Check and start Minikube if necessary
Start-MinikubeIfNotRunning

# Apply Kubernetes configurations
kubectl apply -f "../k8s/db"
kubectl apply -f "../k8s/api"
kubectl apply -f "../k8s/ui"

# Wait for the API pod to be running
Wait-ForApiPod

# Wait for a few seconds to ensure port-forward is up
Start-Sleep -Seconds 5

# Open a new terminal and execute the command to get the UI service URL
Start-Process "powershell" -ArgumentList "minikube service ui-service --url"

# Forward port for API service
kubectl port-forward svc/api-service 8080:8080
