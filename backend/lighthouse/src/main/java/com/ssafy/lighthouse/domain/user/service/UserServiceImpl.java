package com.ssafy.lighthouse.domain.user.service;

import com.ssafy.lighthouse.domain.user.dto.ProfileResponse;
import com.ssafy.lighthouse.domain.user.dto.UserMyPageDto;
import com.ssafy.lighthouse.domain.user.entity.User;
import com.ssafy.lighthouse.domain.user.entity.UserTag;
import com.ssafy.lighthouse.domain.user.exception.UserNotFoundException;
import com.ssafy.lighthouse.domain.user.repository.UserRepository;
import com.ssafy.lighthouse.domain.user.repository.UserTagRepository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

	private UserRepository userRepository;
	private UserTagRepository userTagRepository;

	@Autowired
	public UserServiceImpl(UserRepository userRepository, UserTagRepository userTagRepository) {
		this.userRepository = userRepository;
		this.userTagRepository = userTagRepository;
	}

	@Override
	public void addUser(UserMyPageDto userMyPageDto) {
		System.out.println(userMyPageDto.toString());

		User user = User.from(userMyPageDto);
		User savedUser = userRepository.save(user);
		List<Long> list = userMyPageDto.getUserTagList();
		for (Long tagId : list) {
			UserTag userTag = UserTag.from(savedUser.getId(), tagId);
			userTagRepository.save(userTag);
		}
	}

	@Override
	public UserMyPageDto loginUser(String userEmail, String userPwd) {
		// UserMyPageDto userDto = userMapper.loginUser(userId);

		User loginUser = userRepository.findByEmailAndIsValid(userEmail, 1);
		// if (userDto != null && BCrypt.checkpw(userPwd, userRepository.getById(loginUser.getId()).getPassword())) {
		if (loginUser != null) {
			UserMyPageDto userMyPageDto = UserMyPageDto.from(loginUser);
			return userMyPageDto;
		}

		return null;
	}

	@Override
	public UserMyPageDto getUserByEmail(String userEmail) {
		System.out.println(userEmail);
		System.out.println(userRepository.findByEmailAndIsValid(userEmail, 1).toString());
		return UserMyPageDto.from(userRepository.findByEmailAndIsValid(userEmail, 1));
	}

	@Override
	public UserMyPageDto getUserById(Long userId) {
		User user = userRepository.findByIdAndIsValid(userId, 1);
		List<UserTag> userTags = userTagRepository.findByUserIdAndIsValid(1L, 1);
		UserMyPageDto from = UserMyPageDto.from(user);

		for(UserTag userTag : userTags) {
			from.getUserTagList().add(userTag.getTagId());
		}

		return from;
	}

	@Transactional
	@Override
	public void updateUser(UserMyPageDto userMyPageDto) {
		System.out.println("업데이트 닉네임 : " + userMyPageDto.getNickname());
		User foundUser = userRepository.findById(userMyPageDto.getId()).get();
		System.out.println("찾은 유저 : " + foundUser);
		// Update : 닉네임 업데이트
		foundUser.updateUserInfo(userMyPageDto.getPassword(), userMyPageDto.getName(),
			userMyPageDto.getNickname(), userMyPageDto.getProfileImgUrl(),
			userMyPageDto.getAge(), userMyPageDto.getSidoId(), userMyPageDto.getGugunId(),
			userMyPageDto.getPhoneNumber(), userMyPageDto.getDescription());

		userTagRepository.updateIsValidToZeroByUserId(foundUser.getId());

		List<Long> list = userMyPageDto.getUserTagList();
		for (Long tagId : list) {
			UserTag userTag = UserTag.from(foundUser.getId(), tagId);
			userTagRepository.save(userTag);
		}

		System.out.println("업데이트 된 유저 : " + foundUser);
	}

	@Override
	public void deleteUser(Long userId) {
		userRepository.updateIsValidToZero(userId);
	}

	@Override
	public void saveRefreshToken(Long userId, String refreshToken) throws Exception {
		User user = userRepository.findById(userId).orElseThrow(
			() -> new IllegalArgumentException("User not found with ID: " + userId));
		System.out.println(user.getId());
		user.setToken(refreshToken);
		userRepository.save(user);
	}

	@Override
	public Object getRefreshToken(Long userId) throws Exception {
		return userRepository.findById(userId).get().getToken();
		//return userMapper.getRefreshToken(userid);
	}

	@Override
	public void deleRefreshToken(Long userId) throws Exception {
		userRepository.deleteRefreshToken(userId);
		// Map<String, String> map = new HashMap<String, String>();
		// map.put("userId", useriuserIdd);
		// map.put("token", null);
		//userMapper.deleteRefreshToken(map);
	}

	@Override
	public UserMyPageDto getMyPageUser(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(
			() -> new UserNotFoundException(userId.toString())
		);
		return this.entityToDto(user);
	}

	@Override
	public ProfileResponse findProfileByUserId(Long userId) {
		return userRepository.findProfileByUserId(userId);
	}

	// @Override
	// public List<String> getKeywordsByUserId(Long userId) {
	// 	List<String> tags = userTagRepository.findDistinctTagByUserIdAndIsValidTrue(userId);
	// 	return tags;
	// }
}
