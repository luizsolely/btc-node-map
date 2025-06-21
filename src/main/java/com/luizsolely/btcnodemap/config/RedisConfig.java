package com.luizsolely.btcnodemap.config;

import com.luizsolely.btcnodemap.domain.CountryNodeInfoResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, CountryNodeInfoResponse> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, CountryNodeInfoResponse> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        Jackson2JsonRedisSerializer<CountryNodeInfoResponse> serializer =
                new Jackson2JsonRedisSerializer<>(objectMapper, CountryNodeInfoResponse.class);

        template.setDefaultSerializer(serializer);
        template.setKeySerializer(template.getStringSerializer());

        template.afterPropertiesSet();
        return template;
    }
}
