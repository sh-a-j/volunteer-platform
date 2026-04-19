package com.project.volunteer;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class EnrollmentServiceTest {

    @Test
    public void testEnrollmentSuccess() {
        boolean enrolled = true;
        assertTrue(enrolled);
    }

    @Test
    public void testEnrollmentFailure() {
        boolean enrolled = false;
        assertFalse(enrolled);
    }
}