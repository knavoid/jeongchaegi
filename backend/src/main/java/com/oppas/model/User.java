package com.oppas.model;

import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;
import java.sql.Timestamp;

// ORM - Object Relation Mapping

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Builder
@AllArgsConstructor
public class User {
	@Id // primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private int age;
	private String city;
	private String name;
	private String password;
	private String email;
	private String nickname; // 닉네임
	private String role; //ROLE_USER, ROLE_ADMIN
	// OAuth를 위해 구성한 추가 필드 2개
	private String provider;
	private String providerId;
	@CreationTimestamp
	private Timestamp createDate;
	private String refreshToken; // 리프레시 토큰
	private String kakaoToken; // 리프레시 토큰
	private boolean sign;
	private String policyType;
//	@ColumnDefault("false")
//	@Column(columnDefinition = "TINYINT(1)")
//	private boolean join;
	// 유저 권한 설정 메소드
	public void authorizeUser() {
		this.role = "ROLE_USER";
	}



	public void updateRefreshToken(String updateRefreshToken) {
		this.refreshToken = updateRefreshToken;
	}

	public void updateJoin(boolean flag) {
		this.sign = true;
	}
	public void updatekakaoToken(String token) {
		this.kakaoToken = token;
	}
}
