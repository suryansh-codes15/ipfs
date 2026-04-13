import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        blogs: resolve(__dirname, 'blogs.html'),
        calculator: resolve(__dirname, 'calculator.html'),
        'why-us': resolve(__dirname, 'why-us.html'),
        'disclaimer': resolve(__dirname, 'disclaimer.html'),
        'privacy-policy': resolve(__dirname, 'privacy-policy.html'),
        'disclosure': resolve(__dirname, 'disclosure.html'),
        'signal-report': resolve(__dirname, 'signal-report.html'),
        'equity-report': resolve(__dirname, 'equity-report.html'),
        'assessment': resolve(__dirname, 'assessment.html')
      }
    }
  }
});
