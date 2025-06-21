package com.luizsolely.btcnodemap.service;

import com.luizsolely.btcnodemap.client.BitnodesClient;
import com.luizsolely.btcnodemap.domain.CountryNodeInfo;
import com.luizsolely.btcnodemap.domain.CountryNodeInfoResponse;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BitnodesService {

    private final BitnodesClient bitnodesClient;
    private final RedisTemplate<String, CountryNodeInfoResponse> redisTemplate;

    public BitnodesService(BitnodesClient bitnodesClient, RedisTemplate<String, CountryNodeInfoResponse> redisTemplate) {
        this.bitnodesClient = bitnodesClient;
        this.redisTemplate = redisTemplate;
    }

    public List<CountryNodeInfo> getNodesByCountry() {
        CountryNodeInfoResponse cached = redisTemplate.opsForValue().get("nodesByCountry");

        if (cached != null) {
            return cached.getCountryNodes();
        }

        // Consulta API caso não houver cache
        Map<String, Object> rawRequest = bitnodesClient.getLatestSnapshot();
        Map<String, List<Object>> nodes = (Map<String, List<Object>>) rawRequest.get("nodes");

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

        CountryNodeInfoResponse response = new CountryNodeInfoResponse(
                Instant.now(),
                HttpStatus.OK.value(),
                countries
        );

        redisTemplate.opsForValue().set("nodesByCountry", response, Duration.ofMinutes(30));
        return countries;
    }
}
