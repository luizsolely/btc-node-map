package com.luizsolely.btcnodemap.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
public class CountryNodeInfo {

    private String countryCode;
    private Integer numberOfNodes;

    @JsonCreator
    public CountryNodeInfo(
            @JsonProperty("countryCode") String countryCode,
            @JsonProperty("numberOfNodes") Integer numberOfNodes) {
        this.countryCode = countryCode;
        this.numberOfNodes = numberOfNodes;
    }

}
