import CommunityFeed from "@/components/community/CommunityFeed";
import { Toaster } from "sonner";

export default function CommunityPage() {
    return (
        <>
            <Toaster position="top-center" richColors />
            <CommunityFeed />
        </>
    );
}
