import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <main>
      <h1 className="h1-bold">Hello World!</h1>
    </main>
  );
};

export default Home;
