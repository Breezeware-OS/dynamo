package net.breezeware.dynamo.showcaseapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@PropertySources({ @PropertySource(
        value = { "classpath:dynamo-auth.properties", "classpath:application-usermanagement-cognito.properties",
            "classpath:dynamo-workflow.properties"}) })
@ComponentScan(basePackages = { "net.breezeware" })
@EntityScan(basePackages = { "net.breezeware.dynamo.usermanagement", "net.breezeware.dynamo" })
@EnableJpaRepositories(basePackages = { "net.breezeware.dynamo"})
public class DynamoShowcaseApplication {
    public static void main(String[] args) {
        SpringApplication.run(DynamoShowcaseApplication.class, args);

    }
}