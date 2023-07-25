package com.ssafy.lighthouse.domain.user.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.lighthouse.domain.user.dto.UserMyPageDto;
import com.ssafy.lighthouse.domain.user.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/mypage/{userId}")
    public ResponseEntity<UserMyPageDto> getMyPageInfo(@PathVariable Long userId) {
        // 전체 Tag 목록도 불러와야함
        List<String> tags = userService.getKeywordsByUserId(userId);
        System.out.println(tags.toString());
        UserMyPageDto userMyPageDto = userService.getMyPageUser(userId);
        return new ResponseEntity<>(userMyPageDto, HttpStatus.OK);
    }
}
