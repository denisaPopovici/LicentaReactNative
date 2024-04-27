const scanner = require('sonarqube-scanner');
scanner(
    {
        serverUrl: "http://localhost:9000",
        options: {
            "sonar.login": "admin",
            "sonar.password": "27.12.99d",
            "sonar.projectName": "LicentaReactNative",
            "sonar.sources": "./components"
        },
    },
    () => process.exit()
);