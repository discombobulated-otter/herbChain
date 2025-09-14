#!/bin/bash

# ----------------------------------------------
# HerbChain SMS → Blockchain Dramatic Simulation
# ----------------------------------------------

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Pause for drama
pause() {
    sleep "$1"
}

clear
echo -e "${YELLOW}📲 Incoming SMS detected...${NC}"
pause 2

echo -e "${BLUE}➡️  Parsing message: 'Collected Tulsi at 12.9716, 77.5946 by FARMER001'${NC}"
pause 2

echo -e "${GREEN}✅ Transaction prepared: CreateCollectionEvent${NC}"
pause 1

echo -e "${CYAN}🌐 Submitting transaction to Hyperledger Fabric network...${NC}"
pause 3

echo -e "${GREEN}✔️ Transaction endorsed by Org1Peer0${NC}"
echo -e "${GREEN}✔️ Transaction endorsed by Org2Peer0${NC}"
pause 2

echo -e "${YELLOW}📦 Orderer validated transaction and committed to ledger${NC}"
pause 2

echo -e "${BLUE}🔗 Ledger updated with new state:${NC}"
echo -e "${CYAN}{
  \"id\": \"COL001\",
  \"lat\": \"12.9716\",
  \"lng\": \"77.5946\",
  \"species\": \"Tulsi\",
  \"collectorId\": \"FARMER001\",
  \"timestamp\": \"2025-09-06T09:00:00Z\",
  \"docType\": \"collection\"
}${NC}"
pause 3

echo -e "${YELLOW}--- Provenance Query (GetProvenance: COL001) ---${NC}"
pause 2

echo -e "${CYAN}[
  {
    \"txId\": \"a1b2c3d4\",
    \"timestamp\": \"2025-09-06T09:00:01Z\",
    \"record\": {
      \"id\": \"COL001\",
      \"species\": \"Tulsi\",
      \"collectorId\": \"FARMER001\"
    }
  }
]${NC}"
pause 3

echo -e "${GREEN} HerbChain has immutably recorded your herb's journey!${NC}"

