import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.reppley.template",
  appName: "mobile",
  webDir: "dist",
  plugins: {
    SystemBars: { insetsHandling: "css", style: "LIGHT" },
    SocialLogin: {
      providers: {
        google: true,
        apple: false,
        facebook: false,
        twitter: false,
      },
    },
  },
};
export default config;
