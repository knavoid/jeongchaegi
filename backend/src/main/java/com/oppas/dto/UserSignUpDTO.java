package com.oppas.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@RequiredArgsConstructor
@Getter

public class UserSignUpDTO {

    @NotBlank
    private String email;
    @NotBlank
    private String policyType;
    @NotBlank
    private String nickname;
    @NotNull
    @Min(value = 18, message = "나이 부족")
    private Integer age;
    @NotBlank
    private String city;
    @NotBlank
    private String name;
}