package net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PdfDocument {
    private byte[] documentByteArray;

    private String documentName;
}
