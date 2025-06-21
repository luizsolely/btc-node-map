package com.luizsolely.btcnodemap.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name = "bitnodesClient", url = "https://bitnodes.io/api/v1")
public interface BitnodesClient {

    @GetMapping("/snapshots/latest")
    Map<String, Object> getLatestSnapshot();

}
