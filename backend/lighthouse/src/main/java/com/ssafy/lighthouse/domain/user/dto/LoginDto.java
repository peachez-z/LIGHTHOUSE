package com.ssafy.lighthouse.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class LoginDto {
	String userEmail;
	String userPwd;
}
