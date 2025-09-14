#!/bin/bash
# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Assume fabric-samples are in ~/fabric-samples
FABRIC_SAMPLES="${HOME}/fabric-samples"
TEST_NETWORK="${FABRIC_SAMPLES}/test-network"

if [ ! -d "$TEST_NETWORK" ]; then
    echo "ERROR: Fabric test-network not found at $TEST_NETWORK"
    echo "Please clone https://github.com/hyperledger/fabric-samples and download binaries."
    exit 1
fi

cd "$TEST_NETWORK" || exit 1

# If the network is already running, tear it down first
./network.sh down

# Start the network fresh, create channel, enable CAs
./network.sh up createChannel -c mychannel -ca

# Deploy herb chaincode automatically
./network.sh deployCC -ccn herb -ccp ../chaincode/herb -ccl javascript -c mychannel

echo "✅ Fabric test-network started with 'herb' chaincode deployed on channel 'mychannel'"
