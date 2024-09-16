import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
     <main>
      <h1 className="bg-special">Hey</h1>
      <Button variant={"destructive"}>Click Me</Button>
      </main>
  );
}


// import Image from "next/image";
// import { cookies } from "next/headers"; // cookies are one of the things you can access in server component
// import getPosts from "@/server/actions/get-posts";
// import createPost from "@/server/actions/create-post";
// import PostButton from "@/components/post-button";

// // export const revalidate = 5; // content changes based on refresh of five seconds
// // export const dynamic = "force-dynamic"

// export default async function Home() {
//   // const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
//   // const todo = await data.json();
//   // console.log(todo)

//   // throw new Error("This is an error")
//   // cookies() // if you want to read something of the cookies and it is included here, nextjs will automatically put this to a dynamic route
//   const { error, success } = await getPosts()
//   if(error) {
//     throw new Error(error)
//   }
//   if (success)
//   return (
//      <main>
//       {success.map(post => (
//         <div key={post.id}>
//           <h2>{post.title}</h2>
//         </div>
//         )
//         )}
//         {/* form for create post */}
//         <form action={createPost}>
//           <input type="text" name="title" placeholder="Title" />
//           <PostButton />
//         </form>
//         <Image 
//         src="/vercel.svg"
//         alt="Vercel Logo"
//         width={72}
//         height={16}
//         /> 
//       </main>
//   );
// }

/* when you run npm run build the jsx (<main><div>{Date.now()}</div>
      </main>) will be exported as SSG (Static Site Generation) - home.html */
// ISR Incremental Static Regeneration - This is fantastic when you have cases like blog
// when you have cookies or anything like that or force dynamic, that is a SSR or SSR DYNAMIC (Server Side Rendering)
