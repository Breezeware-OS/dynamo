package net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.enumeration;

import java.util.Arrays;

public enum ApplicationStatus {
    IN_PROGRESS, APPROVED, DECLINED, APPLICATION_SUBMITTED, SIGN_DOCUMENT, UPLOAD_DOCUMENT, DOCUMENT_UPLOADED,
    APPLICATION_REVIEWED, APPLICATION_REVIEW, DOCUMENT_REVIEW, COMPLETED, ALL;

    public static ApplicationStatus getApplicationStatus(String status) {
        return Arrays.stream(values()).filter(applicationStatus -> applicationStatus.name().equalsIgnoreCase(status))
                .findFirst().orElseGet(null);
    }
}
