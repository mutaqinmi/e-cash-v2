import Container from "./container";
import LoadingSpin from "./loading-spin";

export default function Loading(props: {className?: string}){
    return (
        <Container className={`${props.className} h-screen w-screen flex justify-center items-center bg-gray-100`}>
            <LoadingSpin/>
        </Container>
    )
}