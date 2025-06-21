package com.luizsolely.btcnodemap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class BtcnodemapApplication {

	public static void main(String[] args) {
		SpringApplication.run(BtcnodemapApplication.class, args);
	}

}
