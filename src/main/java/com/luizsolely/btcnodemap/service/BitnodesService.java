package com.luizsolely.btcnodemap.service;

import com.luizsolely.btcnodemap.client.BitnodesClient;
import com.luizsolely.btcnodemap.domain.CountryNodeInfo;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BitnodesService {

    private final BitnodesClient bitnodesClient;

    public BitnodesService(BitnodesClient bitnodesClient) {
        this.bitnodesClient = bitnodesClient;
    }

    public Map<String, List<Object>> getLatestNodes() {
        Map<String, Object> rawRequest = bitnodesClient.getLatestSnapshot();
        Map<String, List<Object>> nodes = (Map<String, List<Object>>) rawRequest.get("nodes");
        return nodes;
    }

    public List<CountryNodeInfo> getNodesByCountry() {
        Map<String, List<Object>> nodes = getLatestNodes();
        Map<String, Integer> nodesByCountry = new HashMap<>();

        for (List<Object> nodeInfo : nodes.values()) {
            String countryCode = (String) nodeInfo.get(7);
            if (countryCode != null) {
                nodesByCountry.merge(countryCode, 1, Integer::sum);
            }
        }

        List<CountryNodeInfo> countries = nodesByCountry.entrySet().stream()
                .map(e -> new CountryNodeInfo(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        return countries;
    }
}
