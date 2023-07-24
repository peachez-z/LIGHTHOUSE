package com.ssafy.lighthouse.domain.user.service;

import com.ssafy.lighthouse.domain.user.dto.UserMyPageDto;
import com.ssafy.lighthouse.domain.user.entity.User;
import com.ssafy.lighthouse.domain.user.entity.UserTag;

public interface UserService {

	UserMyPageDto getMyPageUser(Integer userId);

	default UserMyPageDto entityToDto(User userEntity) {
		UserMyPageDto dto = UserMyPageDto.builder()
			.name(userEntity.getName())
			.email(userEntity.getEmail())
			.nickname(userEntity.getNickname())
			.profileImgUrl(userEntity.getProfileImgUrl())
			.age(userEntity.getAge())
			.sidoId(userEntity.getSidoId())
			.gugunId(userEntity.getGugunId())
			.phoneNumber(userEntity.getPhoneNumber())
			.description(userEntity.getDescription())
			.build();
		return dto;
	}
}
