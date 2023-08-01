package com.ssafy.lighthouse.domain.user.repository;

import com.ssafy.lighthouse.domain.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {
	List<User> findByIsValid(int isValid);

	//	@Query("SELECT u FROM User u LEFT JOIN FETCH u.userTags ut LEFT JOIN FETCH ut.tag WHERE u.id = :userId")
	//	User findUserWithTags(@Param("userId") Long userId);
	User findByEmailAndIsValid(String email, int isValid);

	User findByIdAndIsValid(Long id, int isValid);

	@Transactional
	@Modifying
	@Query("UPDATE User u SET u.token = NULL WHERE u.id = :userId")
	void deleteRefreshToken(@Param("userId") Long userId);

	@EntityGraph(attributePaths = {"userTags"})
	@Query("select us from User us where us.id = :id and us.isValid = 1")
	Optional<User> findById(@Param("id") Long id);

	@Transactional
	@Modifying
	@Query("UPDATE User u SET u.isValid = 0 WHERE u.id = :userId")
	void updateIsValidToZero(@Param("userId") Long userId);

	// @Query("SELECT u FROM User u LEFT JOIN FETCH u.userTags ut LEFT JOIN FETCH ut.tag WHERE u.id = :userId")
	// User findUserWithTags(@Param("userId") Long userId);
}
