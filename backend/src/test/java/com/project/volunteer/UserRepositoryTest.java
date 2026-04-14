package com.project.volunteer;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class UserRepositoryTest {

    @Test
    public void testUserEmail() {
        String email = "test@gmail.com";
        assertTrue(email.contains("@"));
    }

    @Test
    public void testUserNotNull() {
        String user = "Shravani";
        assertNotNull(user);
    }
}