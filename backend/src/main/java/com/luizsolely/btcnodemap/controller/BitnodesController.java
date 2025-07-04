package com.luizsolely.btcnodemap.controller;

import com.luizsolely.btcnodemap.domain.CountryNodeInfo;
import com.luizsolely.btcnodemap.domain.CountryNodeInfoResponse;
import com.luizsolely.btcnodemap.service.BitnodesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
public class BitnodesController {

    private final BitnodesService bitnodesService;

    public BitnodesController(BitnodesService bitnodesService) {
        this.bitnodesService = bitnodesService;
    }

    @GetMapping("/nodesByCountry")
    public ResponseEntity<CountryNodeInfoResponse> nodesByCountry() {
        List<CountryNodeInfo> nodes =  bitnodesService.getNodesByCountry();
        CountryNodeInfoResponse response = new CountryNodeInfoResponse(
                Instant.now(),
                HttpStatus.OK.value(),
                nodes
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
