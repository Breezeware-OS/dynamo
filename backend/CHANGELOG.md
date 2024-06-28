# __2.0.0__ __2024-05-06__
## __Dynamo Parent Library__
- ### Features
  - Upgraded Spring Boot version from 2.7.18 to 3.2.5
  - Upgraded Selenium version from 4.1.4 to 4.20.0
  - Upgraded selenium-htmlunit version from 2.54.0 to 4.13.0
  - Replaced springdoc-openapi-ui with springdoc-openapi-starter-webmvc-ui
  - Upgraded postgresql version from 42.3.1 to 42.7.3
  - Upgraded hibernate-validator-parent version from 7.0.3.Final to 8.0.1.Final
  - Upgraded aws-java-sdk version from 2.17.194 to 2.25.40
  - Upgraded wiremock version from 2.27.2 to 3.5.4
  - Upgraded nimbus-jose-jwt version from 9.23 to 9.37.3
  - Upgraded opencsv version from 5.6 to 5.9
  - Upgraded commons-text version from 1.9 to 1.12.0
  - Upgraded json version from 20220320 to 20240303
  - Upgraded flyway-core version from 8.5.13 to 10.11.1
  - Added Querydsl dependencies with Jakarta classifier with version 5.1.0
  - Upgraded spring-boot-maven-plugin version from 2.7.17 to 3.2.5
  - Upgraded maven-javadoc-plugin version from 3.1.0 to 3.6.3
  - Upgraded maven-pmd-plugin version from 3.15.0 to 3.22.0
  - Upgraded transitive dependency 'asm' version from 9.2 to 9.7
  - Upgraded maven-checkstyle-plugin version from 3.1.2 to 3.3.1
  - Upgraded jib-maven-plugin version from 3.1.4 to 3.4.2
  - Upgraded maven-exec-plugin version from 3.0.0 to 3.2.0
  - Upgraded maven-surefire-plugin version from 3.1.2 to 3.2.5
  - Upgraded maven-site-plugin version from 3.9.1 to 4.0.0-M13
  - Upgraded junit version from 5.8.2 to 5.11.0-M1
  - Upgraded org.apache.maven.plugins version from 3.6.1 to 3.6.2
  - Upgraded org.projectlombok version from 1.18.20 to 1.18.32

## __Dynamo SDK Library__
- ### Dynamo Auth
  - ### Features
      - Updated javax packages to Jakarta.
      - Replaced springdoc-openapi-ui with springdoc-openapi-starter-webmvc-ui
      - Added classifier jakarta for org.ehcache:ehcache artifact.
      - Updated the configuration to use @EnableMethodSecurity instead of @EnableGlobalMethodSecurity(prePostEnabled = true) for enabling method-level security.
      - Added lambda DSL for WebSecurity configuration.
      - Replaced usage of Base64Utils with Base64 class as the Base64Utils is deprecated.
      - Replaced the type parameter in the Predicate (first argument to onStatus(...)) from org.springframework.http.HttpStatus to org.springframework.http.HttpStatusCode.
- ### Dynamo AWS
    - ### Features
      - Updated javax packages to Jakarta.
- ### Dynamo Batch
    - ### Features
      - Updated javax packages to Jakarta.
      - Replaced usage of jobBuilderFactory with jobBuilder as jobBuilderFactory is deprecated.
      - Replaced the usage of JobExecutionListenerSupport with JobExecutionListener as JobExecutionListenerSupport is deprecated.
      - Replaced the usage of stepBuilderFactory with stepBuilder as stepBuilderFactory is deprecated.
      - Replaced the usage of StepExecutionListenerSupport with StepExecutionListener as StepExecutionListenerSupport is deprecated.
- ### Dynamo Docs
    - ### Features
      - Updated javax packages to Jakarta.
      - Replaced springdoc-openapi-ui with springdoc-openapi-starter-webmvc-ui
- ### Dynamo Form Builder
    - ### Features
      - Updated javax packages to Jakarta.
      - Replaced springdoc-openapi-ui with springdoc-openapi-starter-webmvc-ui
- ### Dynamo Generics CRUD
    - ### Features
      - Updated javax packages to Jakarta.
- ### Dynamo Logging
    - ### Features
      - Updated javax packages to Jakarta.
- ### Dynamo User Management
    - ### Features
      - Updated javax packages to Jakarta.
      - Replaced springdoc-openapi-ui with springdoc-openapi-starter-webmvc-ui
- ### Dynamo Utils
    - ### Features
      - Updated javax packages to Jakarta.
      - The class (ResponseEntityExceptionHandler) reports the class HttpStatusCode and not HttpStatus
- ### Dynamo Workflow
    - ### Features
      - Updated javax packages to Jakarta.
      - Updated artifactIds from jackson-module-jaxb-annotations to jackson-module-jakarta-xmlbind-annotations.
      - Replaced the usage of org.hibernate.annotations.Type and org.hibernate.annotations.TypeDef with org.hibernate.annotations.JdbcTypeCode.

# __1.5.0-SNAPSHOT__ __2024-04-26__
## __Dynamo Parent Library__
- ### Features
  - Updated spring boot version from 2.6.3 to 2.7.18.
  - Updated maven surefire plugin version from 3.0.0-M5 to 3.1.2.

## __Dynamo SDK Library__
- ### Dynamo Auth
    - ### Features
      - Removed deprecated WebSecurityConfigurerAdapter and added component-based security configuration.