import { bootstrapApp } from "./app";

export async function startApi() {
  const app = await bootstrapApp();

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });
}