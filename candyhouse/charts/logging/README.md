# CandyHouse Centralized Logging

## Overview

The CandyHouse application utilizes a centralized logging solution to aggregate logs from all running pods within the Kubernetes cluster. This is achieved through the integration of **Filebeat** and **Logstash**, which work together to collect, process, and forward logs to a centralized location for analysis and monitoring.

## Logging Architecture

### Filebeat

Filebeat is deployed as a DaemonSet, ensuring that an instance runs on each node in the Kubernetes cluster. This allows Filebeat to collect logs from all containers running on the node. The key features of the Filebeat setup include:

- **Log Collection**: Filebeat is configured to monitor log files located in `/var/log/containers/*.log`, which are symlinks to the actual log files of the running pods. This configuration allows Filebeat to tail the logs and capture new log entries in real-time.
  
- **Kubernetes Autodiscover**: Filebeat uses Kubernetes autodiscover features to dynamically configure itself based on the running pods. This means that as new pods are created or removed, Filebeat automatically adjusts its configuration to include or exclude them.

- **Log Forwarding**: Filebeat is set to forward the collected logs to Logstash for further processing. The output configuration specifies the Logstash service endpoint, typically running on port `5044`.

### Logstash

Logstash acts as the log aggregator and processor. It is responsible for receiving logs from Filebeat, applying any necessary transformations, and then forwarding the processed logs to a storage or analysis backend (e.g., Elasticsearch). The key components of the Logstash setup include:

- **Input Configuration**: Logstash is configured to listen for incoming logs from Filebeat on port `5044`. The input section of the Logstash configuration specifies the `beats` input plugin, which is designed to handle logs sent from Filebeat.

- **Filter Configuration**: Logstash can apply various filters to the incoming logs. For example, it can parse log messages, extract fields, and format timestamps. This processing helps in structuring the logs for better analysis.

- **Output Configuration**: While the current setup includes an output section for sending logs to stdout (for debugging purposes), it can be easily modified to send logs to a persistent storage solution like Elasticsearch or another log management system.

## Summary

The centralized logging setup in CandyHouse leverages Filebeat and Logstash to ensure that logs from all pods are collected and processed efficiently. This architecture provides a robust solution for monitoring application behavior, troubleshooting issues, and maintaining operational visibility across the entire Kubernetes environment.

For more details on the configuration and deployment, please refer to the respective YAML files in the `charts/logging/templates` directory.