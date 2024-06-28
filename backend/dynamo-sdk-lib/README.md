v1.43.0
=======
- Update Spring AI version(1.0.0-SNAPSHOT).

v1.42.0
=======
- Added AI Module using Spring AI.

v1.40.0
=======
- Added Generative AI Module.

v1.39.0
=======

- Update Parent version(dynamo-parent-lib).
- Updated javax packages to Jakarta.
- Replaced springdoc-openapi-ui with springdoc-openapi-starter-webmvc-ui.

v1.38.0-SNAPSHOT
=======

- Update Parent version(dynamo-parent-lib).
- Removed deprecated WebSecurityConfigurerAdapter.

v1.36.0
======

- Added Dynamo Docs Module for create, update, retrieve, delete, upload and download Markdown(md) docs using 
commonmark library.

v1.35.0
=======

- Enables dynamic creation and management of tables for form submissions.
- Integrated seamlessly with Form Builder service.
- Updated the Response List view to show the form's layout.

v1.34.0
=======

- Updated Form builder service for generating secure publishable link.
- Added Form invitation entity and service to manage form invitation.
- Updated Response list based on the form access type.

v1.33.0
=======

- Updated Form builder service for generating publishable link.
- Added Form Response entity and service to manage form responses.

v1.32.2
=======

- Update Parent version(dynamo-parent-lib).

v1.32.1
=======

- Refactored Image Compress Module using Imgscalr.

v1.32.0
=======

- Added Image Compress Module using Imgscalr.

v1.31.0
=======

- Add Bean utils for representing a bean with only the specified fields.
- Add Valid UUIDValidator annotation for UUID Validation.

v1.30.0
=======

- Add Csv Read Service method using OpenCsv in Dynamo Csv module.

v1.29.0
=======

- Add Generic Service methods to handle bulk deletion.

v1.28.0
=======

- Migrated from Camunda 8 to Camunda 7 in the Dynamo workflow module.
- Updated the naming convention for the Form module Service.

v1.27.0
=======

- Added Workflow Support using camunda.

v1.26.1
=======

- Added EnableGlobalMethodSecurity in Web Security Config.

v1.26.0
=======

- Added Retrieve Users by roles and groups in User Management Module.

v1.25.0
=======

- Added Form Builder Support.

v1.24.0
=======

- Added User Management Module for managing user database and AWS Cognito.
- Added Retrieve a List of Entities with or without Sorting in Generic Services.

v1.23.0
=======

- Added common HTTP security configuration in Dynamo Auth
- Updated Dynamo Auth module package name
- Update _dynamo-sdk-bom_ project name to _dynamo-sdk-lib-bom_

v1.20.1
======

- Refactored aws ses mail service

v1.20.0
======

- Added get email template in dynamo aws ses
- Added mapstruct dependency

v1.19.0
======

- Added NoSuchElementException and IllegalArgumentException in DynamoExceptionHandler
- Added ValidationExceptionUtils for field violations error handling
- Added dynamo-generics-crud module

v1.18.0
======

- Refactored dynamo exception and exception handler
- Added maven compiler plugin with mapstruct

v1.17.2
======

- Refactored dynamo auth

v1.17.1
======

- Added email template with bcc address

v1.17.0
======

- Refactored dynamo auth

v1.16.2
======

- Refactored reset password workflow in dynamo-auth
- Added profile for Azure Active Directory
- Added profile for SMTP email flow

v1.16.1
======

- Refactored AWS SES send mail to support HTML formatted email

v1.16.0
======

- Added support for Azure Active Directory

v1.15.2
======

- Refactored DynamoDB test method

v1.15.1
======

- Refactored reset password workflow in dynamo-auth to send templated email instead of SMTP email

v1.15.0
======

- Added support for DynamoDB using AWS SDK v2.0
