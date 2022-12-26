#!/bin/bash

# Add repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add kedacore https://kedacore.github.io/charts
helm repo update

# Install helm charts with config files
helm install prom-op prometheus-community/kube-prometheus-stack -f prom-op-config.yml
kubectl create namespace keda
helm install keda kedacore/keda --namespace keda

# Deploy our app
kubectl apply -f app-kube-deploy.yml
echo "Grafana Username: admin"
echo "Grafana Password: $(kubectl get secret --namespace default prom-op-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo)"
