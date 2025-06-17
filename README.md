# DRM UI | DataSpace 2

A modern, responsive dashboard UI for DRM of DataSpace 2 (DS2) project, enabling secure, sovereign, and scalable data exchange across sectors. Built with Vue 3, Vite, Pinia, PrimeVue, and TailwindCSS, this application provides a user-friendly interface for viewing and filtering logs, managing authentication, and accessing DS2 services.

## Features
- **Dashboard**: Welcome and quick navigation to logs and other features.
- **Logs Viewer**: Filter, search, and view logs by type, author, document type, and date.
- **Authentication**: Secure login via Keycloak SSO.
- **Error Handling**: Friendly error and access-denied pages.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **API Proxy**: NGINX reverse proxy for backend API integration.

## Tech Stack
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [PrimeVue](https://www.primefaces.org/primevue/)
- [TailwindCSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Keycloak](https://www.keycloak.org/) (for authentication)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Docker Deployment
Build and run the application using Docker:

```bash
docker build --no-cache -t atchub/ilab-ds2-drm-ui .
docker run -d -p 8080:80 --rm --name ilab-ds2-drm-ui-1 atchub/ilab-ds2-drm-ui
```

## Authentication
- Uses Keycloak for Single Sign-On (SSO).
- Configure your Keycloak URI, realm, and client in the login page or environment as needed.
- After login, user roles and permissions are managed via Keycloak tokens.

## API Proxy & Backend Integration
- The app is served by NGINX, which proxies API requests to the backend (see `nginx.conf`).
- `/ledger/readAll` and `/api` endpoints are proxied to the backend server.
- Update `nginx.conf` as needed for your backend API URLs.

## Project Structure
- `src/` - Main source code
  - `components/` - Vue components (e.g., logs table, dialogs)
  - `layout/` - Layout components (sidebar, topbar, footer)
  - `stores/` - Pinia stores (state management)
  - `views/` - Main pages (Dashboard, Logs, Auth, Error)
  - `router/` - Vue Router configuration
  - `assets/` - Static assets and styles
- `public/` - Static files and images
- `Dockerfile` - Multi-stage build and production setup
- `nginx.conf` - NGINX server and proxy configuration

## License
See [LICENSE.md](LICENSE.md) for license information.

## Contributing
Contributions are welcome! If you have suggestions, bug reports, or would like to submit a pull request, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or fix
3. Commit your changes with clear messages
4. Open a pull request describing your changes

For major changes, please open an issue first to discuss what you would like to change.

## Contact
**Pantelis Theodosiou**  
Email: [p.theodosiou@atc.gr](mailto:p.theodosiou@atc.gr)
