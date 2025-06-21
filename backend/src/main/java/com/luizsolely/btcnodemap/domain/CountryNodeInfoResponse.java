package com.luizsolely.btcnodemap.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
public class CountryNodeInfoResponse {

    private Instant timestamp;
    private Integer responseStatus;
    private List<CountryNodeInfo> countryNodes;

    @JsonCreator
    public CountryNodeInfoResponse(
            @JsonProperty("timestamp") Instant timestamp,
            @JsonProperty("responseStatus") Integer responseStatus,
            @JsonProperty("countryNodes") List<CountryNodeInfo> countryNodes) {
        this.timestamp = timestamp;
        this.responseStatus = responseStatus;
        this.countryNodes = countryNodes;
    }
}
