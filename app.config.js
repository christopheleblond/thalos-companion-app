export default {
    expo: {
        name: "La Voie du Thalos",
        slug: "thalos-companion-app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            "supportsTablet": true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#000000"
            },
            package: "com.tof31320.thaloscompanionapp"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ],
            "expo-font",
            "expo-web-browser"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {},
            eas: {
                projectId: "c0e1faf4-dd23-43a8-a488-f589d4d3d27b"
            },
            firebaseConfig: {
                apiKey: process.env.FIRESTORE_API_KEY,
                authDomain: process.env.FIRESTORE_AUTH_DOMAIN,
                databaseURL: process.env.FIRESTORE_DATABASE_URL,
                projectId: process.env.FIRESTORE_PROJECT_ID,
                storageBucket: process.env.FIRESTORE_STORAGE_BUCKET,
                messagingSenderId: process.env.FIRESTORE_MESSAGING_SENDER_ID,
                appId: process.env.FIRESTORE_APP_ID
            }
        }
    }
}
