package com.oppas.dto.policy;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotPolicyDTO {
    private Long policyId;
    private String polyBizSjnm;
    private Long scrapCount;

    public HotPolicyDTO(Long policyId, String polyBizSjnm, Long scrapCount) {
        this.policyId = policyId;
        this.polyBizSjnm = polyBizSjnm;
        this.scrapCount = scrapCount;
    }
}
