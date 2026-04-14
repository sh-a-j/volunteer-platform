package com.project.volunteer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AuthServiceTest {

    // Simulating login logic
    public String login(String username, String password) {
        if(username.equals("admin") && password.equals("1234")) {
            return "Login Successful";
        } else {
            return "Invalid Credentials";
        }
    }

    @Test
    public void testValidLogin() {
        String result = login("admin", "1234");
        assertEquals("Login Successful", result);
    }

    @Test
    public void testInvalidLogin() {
        String result = login("user", "wrong");
        assertEquals("Invalid Credentials", result);
    }
}