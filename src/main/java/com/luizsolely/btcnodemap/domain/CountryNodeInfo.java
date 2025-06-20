package com.luizsolely.btcnodemap.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CountryNodeInfo {

    private String countryCode;
    private Integer numberOfNodes;

}
