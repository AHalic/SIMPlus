# SIM+
The System for Inventory Management help stores of any size manage their stock and sales.
App developed for the Software Engineering class.

Group: Sophie Dilhon, Hazem Zidan, Jack Taormino, Tochukwu Okwudiri, Tony Bogonko

Report Document Folder [link](https://drive.google.com/drive/folders/1cEoiz4s5EvmRFw47YhfBVIg-X-HxKFQt?usp=share_link)


### Tech Stack

These are the primary frameworks and libraries used to implement the project.
- **Javascript**
- **Node.js**: v22.5.1
- **Next.js**: v16.0.0
- **Material UI**: v7.3.4
- **MongoDB**: v6.20.0
- **Mongoose**: v8.19.2


### Deployment
The project was deployed through Vercel and can be accessed through the link [https://sim-plus.vercel.app](https://sim-plus.vercel.app).
Pages are blocked for users not logged in, below are the credentials for a test account to log in and visualize the pages.

```js
email: associate@test.com
password: passcode25$
```


### Running Locally

Make sure you have [*yarn*](https://yarnpkg.com/getting-started/install) installed, then install the project dependencies with the command:

```bash
yarn install
```
The project requires two env vars, create a file named `.env` and add the following var with your strings.
```bash
MONGODB_URI= string connection to your mongoDB databse
JWT_SECRET= string secret
```
Finally run the project with:
```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
