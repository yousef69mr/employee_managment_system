FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/*.jar soa.jar
ENTRYPOINT ["java","-jar","/soa.jar"]
EXPOSE 8090