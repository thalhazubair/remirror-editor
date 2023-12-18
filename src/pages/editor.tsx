import dynamic from "next/dynamic";

const Main = dynamic(import("../components/editor"), {
  ssr: false,
});

export default function EditorPage(){
    return(
        <Main/>
    )
}