package com.example.AIComplaintCompanion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.AIComplaintCompanion")
public class AiComplaintCompanionApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiComplaintCompanionApplication.class, args);
	}
}
