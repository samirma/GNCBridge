
```bash
rm -rf node_modules package-lock.json
npm install
```


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

```bash
docker build -t nextjs-docker . 
docker run -p 80:3000 nextjs-docker

```