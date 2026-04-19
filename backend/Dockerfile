# ─────────────────────────────────────────────────────────────
# Stage 1: BUILD — compile & package the Spring Boot JAR
# ─────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first (Docker caches this layer — faster rebuilds)
COPY pom.xml .

# Download all dependencies (cached separately from source code)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the JAR, skip tests
RUN mvn clean package -DskipTests

# ─────────────────────────────────────────────────────────────
# Stage 2: RUN — minimal image with just the JAR
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy only the built JAR from Stage 1
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]