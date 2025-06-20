package com.luizsolely.btcnodemap.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
public class CountryNodeResponse {

    private Instant timestamp;
    private Integer responseStatus;
    private List<CountryNodeInfo> countryNodes;

}
