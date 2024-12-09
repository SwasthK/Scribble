
# **Scribble** : Fullstack Blog Application

**Live at : https://scribble-orpin.vercel.app/**

Scribble: Fullstack Blog Application
Scribble is a full-featured, modern blog application that enables users to create, manage, and interact with blogs. It supports a wide range of functionalities like user profiles, post management, social features, and more. The application is built with robust tools and technologies for a seamless user experience.


## 🚀Features

#### Blog Management
- Create, view, edit, delete, and manage blogs.
- Draft and archive functionality for better blog organization.

#### Social Interactions
- Follow/unfollow other users.
- Like, save, and report posts.
- Comment on posts.

#### Categorization & Discovery
- Category-based blog browsing.

#### User Profiles
- Add and manage social links.
- Connect with other users via their profiles.

## 🛠️ Technologies Used
### Frontend
- **React :**  For building the user interface.

- **TypeScript :**  Ensuring type safety and maintainability.
- **Tailwind CSS :**  For modern, utility-first styling.
- **React Router DOM :**  Handling navigation and routing.
- **BlockNote :**  Rich text editor for blog content creation.
- **TanStack Query :**  For data fetching and caching.
- **Recoil :**  State management across the app.
- **Axios :**  API communication.
### Backend
- **Hono :**  Lightweight web framework for API development.  

- **Cloudflare Workers :**  Serverless backend deployment.  
- **Prisma :**  ORM for PostgreSQL database interactions.  
- **Neon DB :**  Managed PostgreSQL database.  
- **Cloudinary :**  Media storage and management.  
- **Zod :**  Schema validation and type inference.  
- **TypeScript :**  Type-safe backend development.

## 🌟 Getting Started

### Prerequisites

- Node.js (>=16)
- PostgreSQL database URL
- Prisma Accelerated URL
- Cloudinary account for media storage
- Cloudflare Workers setup

### Installation  
1 . Clone the repository :
```bash
 git clone https://github.com/SwasthK/scribble.git 

```

2 . Navigate to the project directory :  
```bash
 cd scribble

```
  For convenience, open two seperate terminal :   

2 . Install dependencies :  
#### termnial - 1
```bash
 cd frontend && npm install

```
#### termnial - 2
```bash
 cd server && npm install

```

4 . Run Frontend :
```bash
npm run dev

```
4 . Run Server :
```bash
npm run dev

```
5 . Access Frontend At :
```bash
http://loclhost:5173

```
5 . Access Server At :
```bash
http://loclhost:8787

```




### Configuration

To run this project, you will need to add the following environment variables in your project   

**frontend/.env**

- `VITE_AXIOS_BASE_URL = <BACKEND_API_URL>`

- `VITE_SIGNIN_BG_IMAGE= <AN_IMAGE_URL_FOR_SIGNIN_PAGE>`

- `VITE_SIGNUP_BG_IMAGE= <AN_IMAGE_URL_FOR_SIGNUP_PAGE>`

**server/.env**

- `DATABASE_URL = <Neon DB URL>`

**server/wrangler.toml**

- `[vars] `

- `CORS_ORIGIN = <FRONTEND_API_URL>`

- `DATABASE_URL = <PRISMA_ACCELERATED_URL>`

- `ACCESS_TOKEN_SECRET = <ACCESS_TOKEN_SECRET>`

- `ACCESS_TOKEN_EXPIRY = <ACCESS_TOKEN_EXPIRY>`

- `REFRESH_TOKEN_SECRET = <REFRESH_TOKEN_SECRET>`

- `REFRESH_TOKEN_EXPIRY = <REFRESH_TOKEN_EXPIRY>`

- `ADMIN_PASSKEY = <ADMIN_PASSKEY>`

- `CLOUDINARY_CLOUD_NAME = <CLOUDINARY_CLOUD_NAME>`

- `CLOUDINARY_API_KEY = <CLOUDINARY_API_KEY>`

- `CLOUDINARY_API_SECRET = <CLOUDINARY_API_SECRET>`




## 🌐 Deployment

To deploy this project run
#### Frontend
- Deploy on platforms like Vercel or Netlify Directly from github.
  OR
- Build the project and serve the file into any hosting service.
```bash
  npm run build 
``` 
#### Server

- Deploy the project to cloudflare workers directly .
```bash
  npm run deploy 
``` 



## 🤝 Contributing

Contributions are always welcome!

- Fork the repository.

- Create a new branch: ```git checkout -b feature-name```

- Commit your changes: ```git commit -m 'Add feature-name'```

- Push to the branch: ```git push origin feature-name```

- Submit a pull request.

Please adhere to this project's `code of conduct`.


## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)


## 📝 Authors

- [@SwasthK](https://x.com/swasthik319)


## 🙌 Acknowledgements

Thanks to all the amazing libraries and tools used in this project.
 - [React](https://react.dev/)
 - [Vite](https://vite.dev/)
 - [Hono](https://hono.dev/)
 - [Cloudflare Workers](https://workers.cloudflare.com/)
 - [Cloudinary](https://cloudinary.com/home/)
 - [Block Note](https://www.blocknotejs.org/)
 - [ShadCN](https://ui.shadcn.com/)
 - [TanStack Query](https://tanstack.com/)

   ***Happy Blogging with Scribble! 🎉***

