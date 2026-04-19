# ─────────────────────────────────────────────────────────────
# Stage 1: BUILD — Maven compiles Spring Boot app inside Docker
# ─────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Cache dependencies layer (only re-downloads if pom.xml changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build JAR (tests run separately in CI Job 1)
COPY src ./src
RUN mvn clean package -DskipTests

# ─────────────────────────────────────────────────────────────
# Stage 2: RUN — Lightweight JRE with just the compiled JAR
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Render injects PORT env var — application.properties reads ${PORT:8080}
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
